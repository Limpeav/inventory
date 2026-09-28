package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaProductRepository extends JpaRepository<ProductEntity, UUID> {
    Optional<ProductEntity> findByBarcode(String barcode);
    List<ProductEntity> findByCategoryId(UUID categoryId);
    boolean existsByBarcode(String barcode);

    @Query("SELECT p FROM ProductEntity p WHERE p.hidden = false AND p.deleted = false")
    List<ProductEntity> findAllActive();
}
