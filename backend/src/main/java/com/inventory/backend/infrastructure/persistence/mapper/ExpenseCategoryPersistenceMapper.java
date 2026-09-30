package com.inventory.backend.infrastructure.persistence.mapper;

import com.inventory.backend.domain.expense.ExpenseCategory;
import com.inventory.backend.infrastructure.persistence.entity.ExpenseCategoryEntity;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ExpenseCategoryPersistenceMapper {

    public ExpenseCategory toDomain(ExpenseCategoryEntity entity) {
        if (entity == null) return null;
        UUID id = UUID.nameUUIDFromBytes(("expense-cat-" + entity.getExpId()).getBytes());
        return new ExpenseCategory(
                id,
                entity.getExpId(),
                entity.getExpName(),
                entity.getExpDescription()
        );
    }

    public ExpenseCategoryEntity toEntity(ExpenseCategory domain) {
        if (domain == null) return null;
        ExpenseCategoryEntity entity = new ExpenseCategoryEntity();
        if (domain.getCategoryCode() != null) {
            entity.setExpId(domain.getCategoryCode());
        }
        entity.setExpName(domain.getName());
        entity.setExpDescription(domain.getDescription());
        return entity;
    }
}
