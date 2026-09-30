package com.inventory.backend.infrastructure.persistence.repository;

import com.inventory.backend.infrastructure.persistence.entity.ExpenseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaExpenseRepository extends JpaRepository<ExpenseEntity, Integer> {
    Optional<ExpenseEntity> findByUuid(UUID uuid);
    List<ExpenseEntity> findByExExpID(Integer exExpID);

    @Query("SELECT e FROM ExpenseEntity e WHERE e.exDate >= :from AND e.exDate <= :to ORDER BY e.exDate DESC")
    List<ExpenseEntity> findByDateRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
