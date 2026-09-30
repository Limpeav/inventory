package com.inventory.backend.domain.expense;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain Entity: Expense
 * Bridges legacy dbo.TblExpense (exCode PK, exExpID category FK, exAmount, exRefNo, exDate, etc.)
 */
public class Expense {
    private UUID id;
    private Integer expenseCode;
    private LocalDate expenseDate;
    private Integer categoryCode;
    private String categoryName;
    private BigDecimal amount;
    private String referenceNo;
    private String description;
    private String status;           // PAID, PENDING, APPROVED
    private Integer accountCode;
    private BigDecimal exchangeRate;
    private UUID employeeId;
    private String employeeName;
    private UUID userId;
    private LocalDateTime createdAt;

    public Expense() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Integer getExpenseCode() { return expenseCode; }
    public void setExpenseCode(Integer expenseCode) { this.expenseCode = expenseCode; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public Integer getCategoryCode() { return categoryCode; }
    public void setCategoryCode(Integer categoryCode) { this.categoryCode = categoryCode; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getAccountCode() { return accountCode; }
    public void setAccountCode(Integer accountCode) { this.accountCode = accountCode; }

    public BigDecimal getExchangeRate() { return exchangeRate; }
    public void setExchangeRate(BigDecimal exchangeRate) { this.exchangeRate = exchangeRate; }

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
