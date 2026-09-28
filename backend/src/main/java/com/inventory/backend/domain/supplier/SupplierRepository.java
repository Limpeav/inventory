package com.inventory.backend.domain.supplier;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SupplierRepository {
    Supplier save(Supplier supplier);
    Optional<Supplier> findById(UUID id);
    List<Supplier> findAll();
    boolean existsByName(String name);
    void deleteById(UUID id);
}
