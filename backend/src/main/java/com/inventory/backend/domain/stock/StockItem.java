package com.inventory.backend.domain.stock;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain Entity: StockItem
 * Tracks current quantity per product (mirrors SmartInventory CheckStock BLL)
 */
public class StockItem {
    private UUID id;
    private UUID productId;
    private double quantity;
    private double reservedQty;   // qty reserved by pending orders
    private LocalDateTime updatedAt;
    private Long version;

    public StockItem() {}

    // Domain behavior
    public double getAvailableQty() {
        return quantity - reservedQty;
    }

    public void addStock(double qty) {
        this.quantity += qty;
    }

    public void deductStock(double qty) {
        if (qty > this.quantity) throw new IllegalStateException("Insufficient stock");
        this.quantity -= qty;
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }

    public double getReservedQty() { return reservedQty; }
    public void setReservedQty(double reservedQty) { this.reservedQty = reservedQty; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
