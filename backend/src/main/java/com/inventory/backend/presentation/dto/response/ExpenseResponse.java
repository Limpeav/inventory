package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ExpenseResponse {
    private UUID id;
    private Integer expenseCode;
    private LocalDate expenseDate;
    private Integer categoryCode;
    private String categoryName;
    private BigDecimal amount;
    private String referenceNo;
    private String description;
    private String status;
    private BigDecimal exchangeRate;
    private UUID employeeId;
    private String employeeName;
    private LocalDateTime createdAt;
}
