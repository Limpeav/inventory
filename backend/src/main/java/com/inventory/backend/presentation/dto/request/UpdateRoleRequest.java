package com.inventory.backend.presentation.dto.request;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UpdateRoleRequest {
    private String description;
    private List<UUID> permissionIds;
}
