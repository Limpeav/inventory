package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaRoleRepository extends JpaRepository<RoleEntity, UUID> {
    Optional<RoleEntity> findByName(String name);
    boolean existsByName(String name);
}
