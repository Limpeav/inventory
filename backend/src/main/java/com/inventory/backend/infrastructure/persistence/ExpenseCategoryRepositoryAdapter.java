package com.inventory.backend.infrastructure.persistence;

import com.inventory.backend.domain.expense.ExpenseCategory;
import com.inventory.backend.domain.expense.ExpenseCategoryRepository;
import com.inventory.backend.infrastructure.persistence.mapper.ExpenseCategoryPersistenceMapper;
import com.inventory.backend.infrastructure.persistence.repository.JpaExpenseCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ExpenseCategoryRepositoryAdapter implements ExpenseCategoryRepository {

    private final JpaExpenseCategoryRepository jpaRepo;
    private final ExpenseCategoryPersistenceMapper mapper;

    @Override
    public ExpenseCategory save(ExpenseCategory category) {
        return mapper.toDomain(jpaRepo.save(mapper.toEntity(category)));
    }

    @Override
    public Optional<ExpenseCategory> findById(UUID id) {
        return jpaRepo.findAll().stream()
                .filter(e -> id.equals(UUID.nameUUIDFromBytes(("expense-cat-" + e.getExpId()).getBytes())))
                .findFirst()
                .map(mapper::toDomain);
    }

    @Override
    public Optional<ExpenseCategory> findByCategoryCode(Integer categoryCode) {
        if (categoryCode == null) return Optional.empty();
        return jpaRepo.findById(categoryCode).map(mapper::toDomain);
    }

    @Override
    public Optional<ExpenseCategory> findByName(String name) {
        if (name == null || name.isBlank()) return Optional.empty();
        return jpaRepo.findByExpNameIgnoreCase(name.trim()).map(mapper::toDomain);
    }

    @Override
    public List<ExpenseCategory> findAll() {
        return jpaRepo.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepo.findAll().stream()
                .filter(e -> id.equals(UUID.nameUUIDFromBytes(("expense-cat-" + e.getExpId()).getBytes())))
                .findFirst()
                .ifPresent(e -> jpaRepo.deleteById(e.getExpId()));
    }
}
