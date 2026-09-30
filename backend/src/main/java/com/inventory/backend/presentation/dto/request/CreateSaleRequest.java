package com.inventory.backend.presentation.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateSaleRequest {

    private String invoiceCode;

    @NotNull(message = "Sale date is required")
    private LocalDate saleDate;

    private UUID customerId;
    private UUID employeeId;

    private BigDecimal exchangeRate = BigDecimal.ONE;
    private String currency = "USD";
    private BigDecimal discount;
    private String note;

    @NotEmpty(message = "Sale must have at least one item")
    @Valid
    private List<SaleItemRequest> items;

    @Data
    public static class SaleItemRequest {
        @NotNull
        private UUID productId;

        @Positive(message = "Quantity must be positive")
        private double quantity;

        @NotNull
        private BigDecimal unitPrice;

        private BigDecimal discount;
        private String serialNumber;
        private Integer warrantyMonths;
    }
}
