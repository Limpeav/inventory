package com.inventory.backend.domain.sale;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Domain Entity: SaleItem (line item)
 * Mirrors SmartInventory SaleDetail BLL
 */
public class SaleItem {
    private UUID id;
    private UUID saleId;
    private UUID productId;
    private String productName;   // snapshot at time of sale
    private double quantity;
    private BigDecimal unitPrice;
    private BigDecimal discount;  // per-line discount amount
    private String serialNumber;  // machine serial number / S/N
    private Integer warrantyMonths; // warranty in months (e.g. 3, 6, 12, 24)

    public SaleItem() {}

    // Domain behavior
    public BigDecimal getSubtotal() {
        BigDecimal base = unitPrice.multiply(BigDecimal.valueOf(quantity));
        return base.subtract(discount != null ? discount : BigDecimal.ZERO);
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSaleId() { return saleId; }
    public void setSaleId(UUID saleId) { this.saleId = saleId; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public Integer getWarrantyMonths() { return warrantyMonths; }
    public void setWarrantyMonths(Integer warrantyMonths) { this.warrantyMonths = warrantyMonths; }
}
