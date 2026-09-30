package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.expense.Expense;
import com.inventory.backend.domain.expense.ExpenseRepository;
import com.inventory.backend.infrastructure.persistence.mapper.ExpensePersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ExpenseRepositoryAdapter implements ExpenseRepository {

    private final JpaExpenseRepository jpaRepo;
    private final ExpensePersistenceMapper mapper;

    @Override
    public Expense save(Expense expense) {
        return mapper.toDomain(jpaRepo.save(mapper.toEntity(expense)));
    }

    @Override
    public Optional<Expense> findById(UUID id) {
        Optional<Expense> direct = jpaRepo.findByUuid(id).map(mapper::toDomain);
        if (direct.isPresent()) return direct;

        return jpaRepo.findAll().stream()
                .filter(e -> id.equals(UUID.nameUUIDFromBytes(("expense-" + e.getExCode()).getBytes())))
                .findFirst()
                .map(mapper::toDomain);
    }

    @Override
    public List<Expense> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Expense> findByDateRange(LocalDate from, LocalDate to) {
        return jpaRepo.findByDateRange(from.atStartOfDay(), to.atTime(LocalTime.MAX))
                .stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Expense> findByCategoryCode(Integer categoryCode) {
        return jpaRepo.findByExExpID(categoryCode)
                .stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepo.findByUuid(id).ifPresentOrElse(
                e -> jpaRepo.deleteById(e.getExCode()),
                () -> jpaRepo.findAll().stream()
                        .filter(e -> id.equals(UUID.nameUUIDFromBytes(("expense-" + e.getExCode()).getBytes())))
                        .findFirst()
                        .ifPresent(e -> jpaRepo.deleteById(e.getExCode()))
        );
    }
}
