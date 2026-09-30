package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PaymentResponse {
    private UUID id;
    private String referenceType;
    private UUID referenceId;
    private String referenceCode;
    private BigDecimal amount;
    private BigDecimal totalAmount;
    private BigDecimal remainingBalance;
    private String paymentMethod;
    private LocalDate paymentDate;
    private String currency;
    private BigDecimal exchangeRate;
    private String note;
    private LocalDateTime createdAt;
}
