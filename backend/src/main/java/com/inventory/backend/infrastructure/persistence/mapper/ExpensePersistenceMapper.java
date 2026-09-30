package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.expense.Expense;
import com.inventory.backend.infrastructure.persistence.entity.ExpenseCategoryEntity;
import com.inventory.backend.infrastructure.persistence.entity.ExpenseEntity;
import com.inventory.backend.infrastructure.persistence.repository.JpaExpenseCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ExpensePersistenceMapper {

    private final JpaExpenseCategoryRepository categoryRepo;

    public Expense toDomain(ExpenseEntity entity) {
        if (entity == null) return null;
        Expense expense = new Expense();
        expense.setId(entity.getUuid() != null
                ? entity.getUuid()
                : UUID.nameUUIDFromBytes(("expense-" + entity.getExCode()).getBytes()));
        expense.setExpenseCode(entity.getExCode());
        expense.setExpenseDate(entity.getExDate() != null ? entity.getExDate().toLocalDate() : null);
        expense.setAmount(entity.getExAmount() != null ? BigDecimal.valueOf(entity.getExAmount()) : BigDecimal.ZERO);
        expense.setReferenceNo(entity.getExRefNo());
        expense.setDescription(entity.getExDescription());
        expense.setStatus(entity.getExStatus() != null ? entity.getExStatus() : "PAID");
        expense.setCategoryCode(entity.getExExpID());
        expense.setExchangeRate(entity.getExExchangeRate() != null ? BigDecimal.valueOf(entity.getExExchangeRate()) : BigDecimal.ONE);
        expense.setAccountCode(entity.getExAccountCode());
        expense.setCreatedAt(entity.getExDate());

        if (entity.getExExpID() != null) {
            categoryRepo.findById(entity.getExExpID())
                    .map(ExpenseCategoryEntity::getExpName)
                    .ifPresent(expense::setCategoryName);
        }

        return expense;
    }

    public ExpenseEntity toEntity(Expense domain) {
        if (domain == null) return null;
        ExpenseEntity entity = new ExpenseEntity();
        if (domain.getExpenseCode() != null) {
            entity.setExCode(domain.getExpenseCode());
        }
        entity.setUuid(domain.getId() != null ? domain.getId() : UUID.randomUUID());
        entity.setExDate(domain.getExpenseDate() != null ? domain.getExpenseDate().atStartOfDay() : LocalDateTime.now());
        entity.setExAmount(domain.getAmount() != null ? domain.getAmount().doubleValue() : 0.0);
        entity.setExRefNo(domain.getReferenceNo());
        entity.setExDescription(domain.getDescription());
        entity.setExStatus(domain.getStatus() != null ? domain.getStatus() : "PAID");
        entity.setExExpID(domain.getCategoryCode());
        entity.setExExchangeRate(domain.getExchangeRate() != null ? domain.getExchangeRate().doubleValue() : 1.0);
        entity.setExAccountCode(domain.getAccountCode() != null ? domain.getAccountCode() : 1);
        return entity;
    }
}
