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
public class SaleReturnResponse {
    private UUID id;
    private UUID saleId;
    private LocalDate returnDate;
    private String reason;
    private BigDecimal totalRefund;
    private String status;
    private List<SaleReturnItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class SaleReturnItemResponse {
        private UUID id;
        private UUID productId;
        private String productName;
        private double quantity;
        private BigDecimal unitPrice;
        private BigDecimal refundAmount;
    }
}
