package com.inventory.backend.domain.sale;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Domain Entity: Sale (header)
 * Mirrors SmartInventory Sale BLL — sale invoice header with UUID audit trail
 */
public class Sale {
    private UUID id;
    private String invoiceCode;        // business invoice number
    private LocalDate saleDate;
    private UUID customerId;
    private UUID employeeId;           // salesperson
    private UUID userId;               // system user who recorded it
    private BigDecimal exchangeRate;   // KHR/USD rate at time of sale
    private String currency;           // KHR or USD
    private BigDecimal discount;       // overall discount amount
    private BigDecimal totalAmount;
    private String status;             // PENDING, COMPLETED, CANCELLED, RETURNED
    private boolean paid;              // mirrors salPay — true when payment is recorded
    private String note;
    private String saleUuid;           // audit UUID from SmartInventory
    private List<SaleItem> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Sale() {}

    // Domain behavior
    public BigDecimal calculateTotal() {
        return items.stream()
                .map(SaleItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .subtract(discount != null ? discount : BigDecimal.ZERO);
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getInvoiceCode() { return invoiceCode; }
    public void setInvoiceCode(String invoiceCode) { this.invoiceCode = invoiceCode; }

    public LocalDate getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDate saleDate) { this.saleDate = saleDate; }

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public BigDecimal getExchangeRate() { return exchangeRate; }
    public void setExchangeRate(BigDecimal exchangeRate) { this.exchangeRate = exchangeRate; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getSaleUuid() { return saleUuid; }
    public void setSaleUuid(String saleUuid) { this.saleUuid = saleUuid; }

    public List<SaleItem> getItems() { return items; }
    public void setItems(List<SaleItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
