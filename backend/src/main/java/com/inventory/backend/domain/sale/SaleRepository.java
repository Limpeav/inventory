package com.inventory.backend.domain.sale;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SaleRepository {
    Sale save(Sale sale);
    Optional<Sale> findById(UUID id);
    Optional<Sale> findByInvoiceCode(String invoiceCode);
    List<Sale> findAll();
    List<Sale> findByCustomerId(UUID customerId);
    List<Sale> findByDateRange(LocalDate from, LocalDate to);
    boolean existsByInvoiceCode(String invoiceCode);
    void deleteById(UUID id);
}
