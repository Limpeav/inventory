package com.inventory.backend.application.auth;

import com.inventory.backend.application.mail.EmailService;
import com.inventory.backend.domain.auth.PasswordResetToken;
import com.inventory.backend.domain.auth.PasswordResetTokenRepository;
import com.inventory.backend.domain.user.User;
import com.inventory.backend.domain.user.UserRepository;
import com.inventory.backend.infrastructure.security.RateLimiterService;
import com.inventory.backend.infrastructure.security.token.TokenGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @Spy
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Spy
    private TokenGenerator tokenGenerator = new TokenGenerator();

    @Mock
    private RateLimiterService rateLimiterService;

    @InjectMocks
    private PasswordResetService passwordResetService;

    private User sampleUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        sampleUser = new User(
                userId,
                "admin",
                "admin@example.com",
                passwordEncoder.encode("OldPassword@123"),
                "Administrator",
                true,
                null,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        ReflectionTestUtils.setField(passwordResetService, "frontendBaseUrl", "http://localhost:3000");
        ReflectionTestUtils.setField(passwordResetService, "expirationMinutes", 15);
    }

    @Test
    @DisplayName("Forgot password: Valid active user should invalidate prior tokens, save hash, and dispatch email")
    void forgotPassword_ValidUser_Success() {
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(sampleUser));

        passwordResetService.processForgotPassword("admin@example.com", "127.0.0.1");

        verify(tokenRepository).invalidateActiveTokensForUser(userId);

        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(tokenRepository).save(tokenCaptor.capture());

        PasswordResetToken savedToken = tokenCaptor.getValue();
        assertNotNull(savedToken.getTokenHash());
        assertEquals(64, savedToken.getTokenHash().length());
        assertEquals(userId, savedToken.getUserId());
        assertFalse(savedToken.isUsed());
        assertTrue(savedToken.getExpiresAt().isAfter(LocalDateTime.now()));

        verify(emailService).sendPasswordResetEmail(
                eq("admin@example.com"),
                eq("Administrator"),
                contains("http://localhost:3000/reset-password?token=")
        );
    }

    @Test
    @DisplayName("Forgot password: Unknown user returns generic response without error or email dispatch")
    void forgotPassword_UnknownUser_GenericResponse() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertDoesNotThrow(() ->
                passwordResetService.processForgotPassword("unknown@example.com", "127.0.0.1")
        );

        verify(tokenRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetEmail(any(), any(), any());
    }

    @Test
    @DisplayName("Forgot password: Inactive user returns generic response without email dispatch")
    void forgotPassword_InactiveUser_GenericResponse() {
        sampleUser.deactivate();
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(sampleUser));

        assertDoesNotThrow(() ->
                passwordResetService.processForgotPassword("admin@example.com", "127.0.0.1")
        );

        verify(tokenRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetEmail(any(), any(), any());
    }

    @Test
    @DisplayName("Reset password: Valid token should update password, mark token used, and invalidate others")
    void resetPassword_ValidToken_Success() {
        String rawToken = "my-secret-test-token-12345";
        String tokenHash = tokenGenerator.hashToken(rawToken);

        PasswordResetToken token = new PasswordResetToken(
                UUID.randomUUID(),
                tokenHash,
                userId,
                LocalDateTime.now().plusMinutes(15),
                false,
                null,
                LocalDateTime.now()
        );

        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));
        when(userRepository.findById(userId)).thenReturn(Optional.of(sampleUser));

        passwordResetService.processResetPassword(rawToken, "NewSecurePassword@2026");

        // Verify password updated
        verify(userRepository).save(sampleUser);
        assertTrue(passwordEncoder.matches("NewSecurePassword@2026", sampleUser.getPasswordHash()));

        // Verify token marked used
        verify(tokenRepository).save(token);
        assertTrue(token.isUsed());
        assertNotNull(token.getUsedAt());

        // Verify invalidation of remaining tokens
        verify(tokenRepository).invalidateActiveTokensForUser(userId);
    }

    @Test
    @DisplayName("Reset password: Expired token should be rejected")
    void resetPassword_ExpiredToken_Rejected() {
        String rawToken = "expired-token-123";
        String tokenHash = tokenGenerator.hashToken(rawToken);

        PasswordResetToken token = new PasswordResetToken(
                UUID.randomUUID(),
                tokenHash,
                userId,
                LocalDateTime.now().minusMinutes(5), // Expired 5 mins ago
                false,
                null,
                LocalDateTime.now().minusMinutes(20)
        );

        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                passwordResetService.processResetPassword(rawToken, "NewSecurePassword@2026")
        );
        assertTrue(ex.getMessage().contains("expired"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Reset password: Already used token should be rejected")
    void resetPassword_UsedToken_Rejected() {
        String rawToken = "already-used-token-123";
        String tokenHash = tokenGenerator.hashToken(rawToken);

        PasswordResetToken token = new PasswordResetToken(
                UUID.randomUUID(),
                tokenHash,
                userId,
                LocalDateTime.now().plusMinutes(10),
                true, // Already used
                LocalDateTime.now().minusMinutes(2),
                LocalDateTime.now().minusMinutes(5)
        );

        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                passwordResetService.processResetPassword(rawToken, "NewSecurePassword@2026")
        );
        assertTrue(ex.getMessage().contains("already been used"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Reset password: Non-existent token should be rejected")
    void resetPassword_NonExistentToken_Rejected() {
        String rawToken = "non-existent-token";
        String tokenHash = tokenGenerator.hashToken(rawToken);

        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                passwordResetService.processResetPassword(rawToken, "NewSecurePassword@2026")
        );
        verify(userRepository, never()).save(any());
    }
}
