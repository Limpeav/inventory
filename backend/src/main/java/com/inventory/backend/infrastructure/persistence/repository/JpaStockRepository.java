package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.StockItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaStockRepository extends JpaRepository<StockItemEntity, UUID> {
    Optional<StockItemEntity> findByProductId(UUID productId);

    @Query("SELECT s FROM StockItemEntity s WHERE s.quantity <= :threshold")
    List<StockItemEntity> findLowStock(@Param("threshold") double threshold);
}
