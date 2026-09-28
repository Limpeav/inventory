package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CustomerResponse {
    private UUID id;
    private String customerId;
    private String name;
    private String phone;
    private String fax;
    private String address;
    private String email;
    private String province;
    private BigDecimal creditLimit;
    private int creditDays;
    private int status;
    private String statusLabel;
    private String description;
    private String employeeCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
