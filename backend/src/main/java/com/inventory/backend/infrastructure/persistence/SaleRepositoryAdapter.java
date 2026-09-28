package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.sale.Sale;
import com.inventory.backend.domain.sale.SaleRepository;
import com.inventory.backend.infrastructure.persistence.entity.SaleEntity;
import com.inventory.backend.infrastructure.persistence.entity.SaleItemEntity;
import com.inventory.backend.infrastructure.persistence.mapper.SalePersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaSaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SaleRepositoryAdapter implements SaleRepository {

    private final JpaSaleRepository jpaRepo;
    private final SalePersistenceMapper mapper;

    @Override
    public Sale save(Sale sale) {
        SaleEntity entity = mapper.toEntity(sale);
        // Wire back the parent reference on each item
        if (entity.getItems() != null) {
            for (SaleItemEntity item : entity.getItems()) {
                item.setSale(entity);
            }
        }
        return mapper.toDomain(jpaRepo.save(entity));
    }

    @Override
    public Optional<Sale> findById(UUID id) {
        return jpaRepo.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Sale> findByInvoiceCode(String invoiceCode) {
        return jpaRepo.findByInvoiceCode(invoiceCode).map(mapper::toDomain);
    }

    @Override
    public List<Sale> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Sale> findByCustomerId(UUID customerId) {
        return jpaRepo.findByCustomerId(customerId).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Sale> findByDateRange(LocalDate from, LocalDate to) {
        return jpaRepo.findByDateRange(from, to).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public boolean existsByInvoiceCode(String invoiceCode) {
        return jpaRepo.existsByInvoiceCode(invoiceCode);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepo.deleteById(id);
    }
}
