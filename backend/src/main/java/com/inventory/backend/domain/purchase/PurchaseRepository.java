package com.inventory.backend.domain.purchase;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PurchaseRepository {
    Purchase save(Purchase purchase);
    Optional<Purchase> findById(UUID id);
    Optional<Purchase> findByReferenceCode(String referenceCode);
    List<Purchase> findAll();
    List<Purchase> findBySupplierId(UUID supplierId);
    List<Purchase> findByDateRange(LocalDate from, LocalDate to);
    boolean existsByReferenceCode(String referenceCode);
    void deleteById(UUID id);
}
