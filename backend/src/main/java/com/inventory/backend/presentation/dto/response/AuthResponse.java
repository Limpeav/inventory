package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private String username;
    private String fullName;
    private String email;
    private List<String> roles;
}
