package com.inventory.backend.domain.expense;

import java.util.UUID;

/**
 * Domain Entity: ExpenseCategory
 * Bridges legacy dbo.TblExpenseList (ExpID PK, ExpName, ExpDescription)
 */
public class ExpenseCategory {
    private UUID id;
    private Integer categoryCode;
    private String name;
    private String description;

    public ExpenseCategory() {}

    public ExpenseCategory(UUID id, Integer categoryCode, String name, String description) {
        this.id = id;
        this.categoryCode = categoryCode;
        this.name = name;
        this.description = description;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Integer getCategoryCode() { return categoryCode; }
    public void setCategoryCode(Integer categoryCode) { this.categoryCode = categoryCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
