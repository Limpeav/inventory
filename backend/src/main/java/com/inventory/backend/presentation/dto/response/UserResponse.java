package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private String fullName;
    private boolean active;
    private List<RoleResponse> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
