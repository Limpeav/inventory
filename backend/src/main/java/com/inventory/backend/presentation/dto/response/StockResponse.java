package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class StockResponse {
    private UUID id;
    private UUID productId;
    private String productName;
    private String barcode;
    private String categoryName;
    private double quantity;
    private double reservedQty;
    private double availableQty;
    private double reorderLevel;
    private boolean lowStock;
    private LocalDateTime updatedAt;
}
