package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.payment.Payment;
import com.inventory.backend.domain.payment.PaymentRepository;
import com.inventory.backend.infrastructure.persistence.mapper.PaymentPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PaymentRepositoryAdapter implements PaymentRepository {

    private final JpaPaymentRepository jpaRepo;
    private final PaymentPersistenceMapper mapper;

    @Override public Payment save(Payment p) { return mapper.toDomain(jpaRepo.save(mapper.toEntity(p))); }
    @Override public Optional<Payment> findById(UUID id) { return jpaRepo.findById(id).map(mapper::toDomain); }
    @Override public List<Payment> findAll() { return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList()); }
    @Override public List<Payment> findByReferenceId(UUID referenceId) { return jpaRepo.findByReferenceId(referenceId).stream().map(mapper::toDomain).collect(Collectors.toList()); }
    @Override public List<Payment> findByReferenceType(String referenceType) { return jpaRepo.findByReferenceType(referenceType).stream().map(mapper::toDomain).collect(Collectors.toList()); }
    @Override public BigDecimal sumByReferenceId(UUID referenceId) { return jpaRepo.sumByReferenceId(referenceId); }
    @Override public void deleteById(UUID id) { jpaRepo.deleteById(id); }
}
