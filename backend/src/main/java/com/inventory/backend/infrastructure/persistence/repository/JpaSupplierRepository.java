package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.SupplierEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaSupplierRepository extends JpaRepository<SupplierEntity, UUID> {
    boolean existsByName(String name);
}
