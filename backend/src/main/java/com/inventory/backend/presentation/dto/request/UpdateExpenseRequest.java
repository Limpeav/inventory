package com.inventory.backend.presentation.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class UpdateExpenseRequest {

    private LocalDate expenseDate;

    @DecimalMin(value = "0.01", message = "Expense amount must be greater than zero")
    private BigDecimal amount;

    private Integer categoryCode;

    private UUID categoryId;

    @Size(max = 50, message = "Reference number must not exceed 50 characters")
    private String referenceNo;

    @Size(max = 100, message = "Description must not exceed 100 characters")
    private String description;

    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;

    private BigDecimal exchangeRate;

    private UUID employeeId;
}
