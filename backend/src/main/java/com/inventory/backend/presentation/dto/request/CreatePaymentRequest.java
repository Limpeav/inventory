package com.inventory.backend.presentation.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreatePaymentRequest {

    @NotNull(message = "Reference type is required (e.g., SALE, PURCHASE)")
    private String referenceType;

    @NotNull(message = "Reference ID is required")
    private UUID referenceId;

    @NotNull(message = "Payment amount is required")
    @Positive(message = "Payment amount must be greater than zero")
    private BigDecimal amount;

    private String paymentMethod = "CASH";

    private LocalDate paymentDate;

    private String currency = "USD";

    private BigDecimal exchangeRate = BigDecimal.ONE;

    private String note;
}
