package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.purchase.Purchase;
import com.inventory.backend.domain.purchase.PurchaseRepository;
import com.inventory.backend.infrastructure.persistence.entity.PurchaseEntity;
import com.inventory.backend.infrastructure.persistence.entity.PurchaseItemEntity;
import com.inventory.backend.infrastructure.persistence.mapper.PurchasePersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaPurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PurchaseRepositoryAdapter implements PurchaseRepository {

    private final JpaPurchaseRepository jpaRepo;
    private final PurchasePersistenceMapper mapper;

    @Override
    public Purchase save(Purchase purchase) {
        PurchaseEntity entity = mapper.toEntity(purchase);
        if (entity.getItems() != null) {
            for (PurchaseItemEntity item : entity.getItems()) {
                item.setPurchase(entity);
            }
        }
        return mapper.toDomain(jpaRepo.save(entity));
    }

    @Override
    public Optional<Purchase> findById(UUID id) {
        return jpaRepo.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Purchase> findByReferenceCode(String referenceCode) {
        return jpaRepo.findByReferenceCode(referenceCode).map(mapper::toDomain);
    }

    @Override
    public List<Purchase> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Purchase> findBySupplierId(UUID supplierId) {
        return jpaRepo.findBySupplierId(supplierId).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Purchase> findByDateRange(LocalDate from, LocalDate to) {
        return jpaRepo.findByDateRange(from, to).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public boolean existsByReferenceCode(String referenceCode) {
        return jpaRepo.existsByReferenceCode(referenceCode);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepo.deleteById(id);
    }
}
