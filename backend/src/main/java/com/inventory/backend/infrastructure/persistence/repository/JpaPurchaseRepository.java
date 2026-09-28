package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.PurchaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaPurchaseRepository extends JpaRepository<PurchaseEntity, UUID> {
    Optional<PurchaseEntity> findByReferenceCode(String referenceCode);
    boolean existsByReferenceCode(String referenceCode);
    List<PurchaseEntity> findBySupplierId(UUID supplierId);

    @Query("SELECT p FROM PurchaseEntity p WHERE p.purchaseDate BETWEEN :from AND :to ORDER BY p.purchaseDate DESC")
    List<PurchaseEntity> findByDateRange(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
