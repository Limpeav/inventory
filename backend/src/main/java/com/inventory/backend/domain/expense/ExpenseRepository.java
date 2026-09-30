package com.inventory.backend.domain.expense;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExpenseRepository {
    Expense save(Expense expense);
    Optional<Expense> findById(UUID id);
    List<Expense> findAll();
    List<Expense> findByDateRange(LocalDate from, LocalDate to);
    List<Expense> findByCategoryCode(Integer categoryCode);
    void deleteById(UUID id);
}
