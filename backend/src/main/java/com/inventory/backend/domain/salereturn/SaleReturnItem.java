package com.inventory.backend.domain.salereturn;

import java.math.BigDecimal;
import java.util.UUID;

public class SaleReturnItem {
    private UUID id;
    private UUID saleReturnId;
    private UUID productId;
    private String productName;
    private double quantity;
    private BigDecimal unitPrice;  // original sale price for refund calc

    public SaleReturnItem() {}

    public BigDecimal getRefundAmount() {
        if (unitPrice == null) return BigDecimal.ZERO;
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSaleReturnId() { return saleReturnId; }
    public void setSaleReturnId(UUID saleReturnId) { this.saleReturnId = saleReturnId; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
