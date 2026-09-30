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
public class SaleResponse {
    private UUID id;
    private String invoiceCode;
    private LocalDate saleDate;
    private UUID customerId;
    private String customerName;
    private UUID employeeId;
    private String employeeName;   // resolved name of the salesperson
    private BigDecimal exchangeRate;
    private String currency;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String status;
    private boolean paid;          // true = payment recorded (mirrors salPay)
    private String note;
    private List<SaleItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class SaleItemResponse {
        private UUID id;
        private UUID productId;
        private String productName;
        private double quantity;
        private BigDecimal unitPrice;
        private BigDecimal discount;
        private BigDecimal subtotal;
    }
}
