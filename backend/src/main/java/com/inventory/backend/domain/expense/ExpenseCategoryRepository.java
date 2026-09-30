package com.inventory.backend.domain.expense;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExpenseCategoryRepository {
    ExpenseCategory save(ExpenseCategory category);
    Optional<ExpenseCategory> findById(UUID id);
    Optional<ExpenseCategory> findByCategoryCode(Integer categoryCode);
    Optional<ExpenseCategory> findByName(String name);
    List<ExpenseCategory> findAll();
    void deleteById(UUID id);
}
