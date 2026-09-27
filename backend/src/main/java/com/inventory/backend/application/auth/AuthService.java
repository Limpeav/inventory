package com.inventory.backend.application.auth;

import com.inventory.backend.domain.user.User;
import com.inventory.backend.domain.user.UserRepository;
import com.inventory.backend.infrastructure.security.config.CustomUserDetailsService;
import com.inventory.backend.infrastructure.security.jwt.JwtTokenProvider;
import com.inventory.backend.presentation.dto.request.LoginRequest;
import com.inventory.backend.presentation.dto.request.RefreshTokenRequest;
import com.inventory.backend.presentation.dto.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/**
 * Application Use Case: Authentication
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(r -> r.getName()).toList())
                .build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String username = jwtTokenProvider.extractUsername(request.getRefreshToken());
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtTokenProvider.isTokenValid(request.getRefreshToken(), userDetails)) {
            throw new RuntimeException("Invalid refresh token");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(request.getRefreshToken())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(r -> r.getName()).toList())
                .build();
    }
}
