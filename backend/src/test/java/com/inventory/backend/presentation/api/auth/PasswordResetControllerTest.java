package com.inventory.backend.presentation.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventory.backend.application.auth.AuthService;
import com.inventory.backend.application.auth.PasswordResetService;
import com.inventory.backend.presentation.dto.request.ForgotPasswordRequest;
import com.inventory.backend.presentation.dto.request.ResetPasswordRequest;
import com.inventory.backend.presentation.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Mock
    private PasswordResetService passwordResetService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("POST /auth/forgot-password with valid email returns 200 OK and generic message")
    void forgotPassword_ValidEmail_Returns200() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest("admin@inventory.com");

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("If an account with that email exists, a password reset link has been sent."));

        verify(passwordResetService).processForgotPassword(eq("admin@inventory.com"), anyString());
    }

    @Test
    @DisplayName("POST /auth/forgot-password with invalid email returns 400 Bad Request")
    void forgotPassword_InvalidEmail_Returns400() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest("not-an-email");

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.data.email").exists());

        verify(passwordResetService, never()).processForgotPassword(any(), any());
    }

    @Test
    @DisplayName("POST /auth/reset-password with valid request returns 200 OK")
    void resetPassword_ValidRequest_Returns200() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest("valid-token-abc", "NewPassword@123");

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Password has been successfully reset. You can now log in with your new password."));

        verify(passwordResetService).processResetPassword("valid-token-abc", "NewPassword@123");
    }

    @Test
    @DisplayName("POST /auth/reset-password with short password returns 400 Bad Request")
    void resetPassword_ShortPassword_Returns400() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest("valid-token-abc", "123");

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.newPassword").exists());

        verify(passwordResetService, never()).processResetPassword(any(), any());
    }

    @Test
    @DisplayName("POST /auth/reset-password with expired token throws IllegalArgumentException and returns 400 Bad Request")
    void resetPassword_ExpiredToken_Returns400() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest("expired-token", "NewPassword@123");

        doThrow(new IllegalArgumentException("This password reset link has expired. Please request a new one."))
                .when(passwordResetService).processResetPassword("expired-token", "NewPassword@123");

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("This password reset link has expired. Please request a new one."));
    }
}
