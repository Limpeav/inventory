package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.PermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JpaPermissionRepository extends JpaRepository<PermissionEntity, UUID> {
    boolean existsByName(String name);
}
