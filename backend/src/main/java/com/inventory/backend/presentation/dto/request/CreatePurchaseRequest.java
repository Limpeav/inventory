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
public class CreatePurchaseRequest {

    private String referenceCode;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    private LocalDate deliveryDate;
    private UUID supplierId;
    private BigDecimal exchangeRate = BigDecimal.ONE;
    private String currency = "USD";
    private BigDecimal discount;
    private String note;

    @NotEmpty(message = "Purchase must have at least one item")
    @Valid
    private List<PurchaseItemRequest> items;

    @Data
    public static class PurchaseItemRequest {
        @NotNull
        private UUID productId;

        @Positive(message = "Quantity must be positive")
        private double quantity;

        @NotNull
        private BigDecimal unitCost;

        private BigDecimal discount;
    }
}
