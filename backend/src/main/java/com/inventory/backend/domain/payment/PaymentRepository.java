package com.inventory.backend.domain.payment;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository {
    Payment save(Payment payment);
    Optional<Payment> findById(UUID id);
    List<Payment> findAll();
    List<Payment> findByReferenceId(UUID referenceId);
    List<Payment> findByReferenceType(String referenceType);
    BigDecimal sumByReferenceId(UUID referenceId);
    void deleteById(UUID id);
}
