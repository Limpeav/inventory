package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.ExpenseCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaExpenseCategoryRepository extends JpaRepository<ExpenseCategoryEntity, Integer> {
    Optional<ExpenseCategoryEntity> findByExpNameIgnoreCase(String expName);
    boolean existsByExpNameIgnoreCase(String expName);
}
