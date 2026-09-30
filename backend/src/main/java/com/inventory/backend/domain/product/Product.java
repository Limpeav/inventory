package com.inventory.backend.domain.product;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain Entity: Product
 * Mirrors SmartInventory Product BLL (barcode, category, cost, price, reorder level)
 */
public class Product {
    private UUID id;
    private String name;
    private String barcode;
    private String model;
    private String packageUnit;   // packing unit (e.g. Box, Piece)
    private String description;
    private UUID categoryId;
    private BigDecimal cost;
    private BigDecimal price;
    private double reorderLevel;  // SecureStock threshold
    private boolean hidden;
    private boolean deleted;
    private LocalDate startDate;
    private String productType;   // maps dbo.TblProducts.proType
    private String nameKh;        // maps dbo.TblProducts.pronamech
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Product() {}

    // Domain behavior
    public boolean needsReorder(double currentStock) {
        return currentStock <= reorderLevel;
    }

    public void markDeleted() { this.deleted = true; }
    public void markHidden()  { this.hidden = true; }
    public void unHide()      { this.hidden = false; }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getPackageUnit() { return packageUnit; }
    public void setPackageUnit(String packageUnit) { this.packageUnit = packageUnit; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public double getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(double reorderLevel) { this.reorderLevel = reorderLevel; }

    public boolean isHidden() { return hidden; }
    public void setHidden(boolean hidden) { this.hidden = hidden; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getNameKh() { return nameKh; }
    public void setNameKh(String nameKh) { this.nameKh = nameKh; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
