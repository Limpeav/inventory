package com.inventory.backend.presentation.api.auth;

import com.inventory.backend.application.auth.AuthService;
import com.inventory.backend.presentation.dto.request.LoginRequest;
import com.inventory.backend.presentation.dto.request.RefreshTokenRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.AuthResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // For stateless JWT, logout is handled client-side by deleting the token
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
