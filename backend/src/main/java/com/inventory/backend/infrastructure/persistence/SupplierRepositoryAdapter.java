package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.supplier.Supplier;
import com.inventory.backend.domain.supplier.SupplierRepository;
import com.inventory.backend.infrastructure.persistence.mapper.SupplierPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaSupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SupplierRepositoryAdapter implements SupplierRepository {

    private final JpaSupplierRepository jpaRepo;
    private final SupplierPersistenceMapper mapper;

    @Override
    public Supplier save(Supplier supplier) {
        return mapper.toDomain(jpaRepo.save(mapper.toEntity(supplier)));
    }

    @Override
    public Optional<Supplier> findById(UUID id) {
        return jpaRepo.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Supplier> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepo.existsByName(name);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepo.deleteById(id);
    }
}
