package com.inventory.backend.domain.stock;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StockRepository {
    StockItem save(StockItem stockItem);
    Optional<StockItem> findByProductId(UUID productId);
    List<StockItem> findAll();
    List<StockItem> findLowStock(double threshold);
}
