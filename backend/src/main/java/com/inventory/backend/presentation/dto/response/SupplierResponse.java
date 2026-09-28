package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SupplierResponse {
    private UUID id;
    private String name;
    private String contactName;
    private String telephone;
    private String phone;
    private String fax;
    private String address;
    private String email;
    private String website;
    private String country;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
