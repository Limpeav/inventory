package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ProductResponse {
    private UUID id;
    private String name;
    private String barcode;
    private String model;
    private String packageUnit;
    private String description;
    private UUID categoryId;
    private String categoryName;
    private BigDecimal cost;
    private BigDecimal price;
    private double reorderLevel;
    private boolean hidden;
    private boolean deleted;
    private LocalDate startDate;
    private String productType;
    private String nameKh;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
