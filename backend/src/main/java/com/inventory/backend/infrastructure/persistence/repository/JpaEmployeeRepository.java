package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface JpaEmployeeRepository extends JpaRepository<EmployeeEntity, UUID> {
    @Query("SELECT e FROM EmployeeEntity e WHERE e.active = true")
    List<EmployeeEntity> findAllActive();
}
