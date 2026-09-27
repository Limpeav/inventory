package com.inventory.backend.application.auth;

import com.inventory.backend.application.mail.EmailService;
import com.inventory.backend.domain.auth.PasswordResetToken;
import com.inventory.backend.domain.auth.PasswordResetTokenRepository;
import com.inventory.backend.domain.user.User;
import com.inventory.backend.domain.user.UserRepository;
import com.inventory.backend.infrastructure.security.RateLimiterService;
import com.inventory.backend.infrastructure.security.token.TokenGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final TokenGenerator tokenGenerator;
    private final RateLimiterService rateLimiterService;

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Value("${app.reset-token.expiration-minutes:15}")
    private int expirationMinutes;

    /**
     * Processes a forgot-password request.
     * Always completes cleanly without leaking whether the email exists.
     */
    public void processForgotPassword(String rawEmail, String clientIp) {
        String email = (rawEmail != null) ? rawEmail.trim().toLowerCase() : "";

        // Rate limiting: 10 requests per 15 min per IP, 5 per 15 min per email
        if (clientIp != null && !clientIp.isBlank()) {
            rateLimiterService.checkRateLimit("ip:" + clientIp, 10, Duration.ofMinutes(15));
        }
        if (!email.isBlank()) {
            rateLimiterService.checkRateLimit("email:" + email, 5, Duration.ofMinutes(15));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.info("Password reset requested for non-existent email [normalized={}]", maskEmail(email));
            return;
        }

        User user = userOpt.get();
        if (!user.isActive()) {
            log.warn("Password reset requested for disabled user account [id={}]", user.getId());
            return;
        }

        // Invalidate any previously issued active tokens for this user
        tokenRepository.invalidateActiveTokensForUser(user.getId());

        // Generate cryptographically secure random token and compute its SHA-256 hash
        String rawToken = tokenGenerator.generateSecureToken();
        String tokenHash = tokenGenerator.hashToken(rawToken);

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(expirationMinutes);
        PasswordResetToken resetToken = new PasswordResetToken(
                null,
                tokenHash,
                user.getId(),
                expiresAt,
                false,
                null,
                LocalDateTime.now()
        );
        tokenRepository.save(resetToken);

        // Build reset link using frontend base URL
        String sanitizedBaseUrl = frontendBaseUrl.replaceAll("/+$", "");
        String resetUrl = sanitizedBaseUrl + "/reset-password?token=" + URLEncoder.encode(rawToken, StandardCharsets.UTF_8);

        // Send email with reset instructions
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), resetUrl);
            log.info("Password reset link created and dispatched for user [id={}]", user.getId());
        } catch (Exception ex) {
            log.error("Failed to send password reset email for user [id={}]: {}", user.getId(), ex.getMessage());
            // Do not rethrow raw exception to preserve generic response and prevent user enumeration
        }
    }

    /**
     * Resets a user's password using a secure reset token.
     * Enforces single-use, validates expiration, and updates password transactionally.
     */
    @Transactional
    public void processResetPassword(String rawToken, String newPassword) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Reset token is required.");
        }
        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("New password is required.");
        }

        // Hash the incoming raw token to look up in the database
        String tokenHash = tokenGenerator.hashToken(rawToken);

        PasswordResetToken token = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Password reset link is invalid or has expired. Please request a new one."));

        if (token.isUsed()) {
            log.warn("Attempt to reuse already redeemed password reset token [tokenId={}]", token.getId());
            throw new IllegalArgumentException("This password reset link has already been used. Please request a new one.");
        }

        if (token.isExpired()) {
            log.warn("Attempt to use expired password reset token [tokenId={}]", token.getId());
            throw new IllegalArgumentException("This password reset link has expired. Please request a new one.");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Associated user account was not found."));

        if (!user.isActive()) {
            throw new IllegalStateException("Account is inactive or disabled. Please contact an administrator.");
        }

        // Update user's password using BCrypt
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Mark token as used
        token.markUsed();
        tokenRepository.save(token);

        // Invalidate any other active tokens for this user
        tokenRepository.invalidateActiveTokensForUser(user.getId());

        log.info("Password successfully updated for user [id={}]", user.getId());
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf('@');
        String prefix = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        if (prefix.length() <= 2) {
            return prefix.charAt(0) + "***" + domain;
        }
        return prefix.charAt(0) + "***" + prefix.charAt(prefix.length() - 1) + domain;
    }
}
