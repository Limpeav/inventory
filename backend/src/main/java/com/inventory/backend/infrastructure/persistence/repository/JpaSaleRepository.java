package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.SaleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaSaleRepository extends JpaRepository<SaleEntity, UUID> {
    Optional<SaleEntity> findByInvoiceCode(String invoiceCode);
    boolean existsByInvoiceCode(String invoiceCode);
    List<SaleEntity> findByCustomerId(UUID customerId);

    @Query("SELECT s FROM SaleEntity s WHERE s.saleDate BETWEEN :from AND :to ORDER BY s.saleDate DESC")
    List<SaleEntity> findByDateRange(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
