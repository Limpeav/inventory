package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PurchaseResponse {
    private UUID id;
    private String referenceCode;
    private LocalDate purchaseDate;
    private LocalDate deliveryDate;
    private UUID supplierId;
    private String supplierName;
    private BigDecimal exchangeRate;
    private String currency;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String status;
    private String note;
    private List<PurchaseItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class PurchaseItemResponse {
        private UUID id;
        private UUID productId;
        private String productName;
        private double quantity;
        private BigDecimal unitCost;
        private BigDecimal discount;
        private BigDecimal subtotal;
    }
}
