package com.inventory.backend.domain.salereturn;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Domain Entity: SaleReturn (header)
 * Mirrors SmartInventory Return BLL
 */
public class SaleReturn {
    private UUID id;
    private UUID saleId;
    private LocalDate returnDate;
    private String reason;
    private BigDecimal totalRefund;
    private String status;   // PENDING, COMPLETED, REJECTED
    private List<SaleReturnItem> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SaleReturn() {}

    public BigDecimal calculateRefund() {
        return items.stream()
                .map(SaleReturnItem::getRefundAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSaleId() { return saleId; }
    public void setSaleId(UUID saleId) { this.saleId = saleId; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public BigDecimal getTotalRefund() { return totalRefund; }
    public void setTotalRefund(BigDecimal totalRefund) { this.totalRefund = totalRefund; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<SaleReturnItem> getItems() { return items; }
    public void setItems(List<SaleReturnItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
