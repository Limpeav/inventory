package com.inventory.backend.presentation.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UpdateUserRequest {
    @Email(message = "Invalid email format")
    private String email;

    private String fullName;
    private Boolean active;
    private List<UUID> roleIds;
}
