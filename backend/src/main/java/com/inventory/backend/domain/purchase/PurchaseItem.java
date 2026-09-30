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
    private double quantity;            // ordered quantity
    private double orderedQuantity;     // explicit ordered quantity
    private double receivedQuantity;    // received so far (dbo.TblPurchaseDetail.pdReceivedQty)
    private BigDecimal unitCost;
    private BigDecimal discount;

    public PurchaseItem() {}

    public BigDecimal getSubtotal() {
        double effectiveQty = orderedQuantity > 0 ? orderedQuantity : quantity;
        BigDecimal base = unitCost != null ? unitCost.multiply(BigDecimal.valueOf(effectiveQty)) : BigDecimal.ZERO;
        return base.subtract(discount != null ? discount : BigDecimal.ZERO);
    }

    public double getPendingQuantity() {
        double ordered = orderedQuantity > 0 ? orderedQuantity : quantity;
        return Math.max(0.0, ordered - receivedQuantity);
    }

    public boolean isFullyReceived() {
        double ordered = orderedQuantity > 0 ? orderedQuantity : quantity;
        return ordered > 0 && receivedQuantity >= ordered;
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

    public double getQuantity() { return quantity > 0 ? quantity : orderedQuantity; }
    public void setQuantity(double quantity) {
        this.quantity = quantity;
        if (this.orderedQuantity == 0) {
            this.orderedQuantity = quantity;
        }
    }

    public double getOrderedQuantity() { return orderedQuantity > 0 ? orderedQuantity : quantity; }
    public void setOrderedQuantity(double orderedQuantity) {
        this.orderedQuantity = orderedQuantity;
        this.quantity = orderedQuantity;
    }

    public double getReceivedQuantity() { return receivedQuantity; }
    public void setReceivedQuantity(double receivedQuantity) { this.receivedQuantity = receivedQuantity; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
}
