package com.inventory.backend.domain.purchase;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Domain Entity: PurchaseItem (line item)
 * Mirrors SmartInventory Purchase detail logic
 */
public class PurchaseItem {
    private UUID id;
    private UUID purchaseId;
    private UUID productId;
    private String productName;   // snapshot at time of purchase
    private double quantity;
    private BigDecimal unitCost;
    private BigDecimal discount;

    public PurchaseItem() {}

    public BigDecimal getSubtotal() {
        BigDecimal base = unitCost.multiply(BigDecimal.valueOf(quantity));
        return base.subtract(discount != null ? discount : BigDecimal.ZERO);
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getPurchaseId() { return purchaseId; }
    public void setPurchaseId(UUID purchaseId) { this.purchaseId = purchaseId; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
}
