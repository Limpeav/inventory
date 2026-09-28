package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class EmployeeResponse {
    private UUID id;
    private String name;
    private String gender;
    private String phone;
    private String address;
    private LocalDate startDate;
    private String pictureUrl;
    private String description;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
