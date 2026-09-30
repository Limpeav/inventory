package com.inventory.backend.application.expense;

import com.inventory.backend.domain.employee.Employee;
import com.inventory.backend.domain.employee.EmployeeRepository;
import com.inventory.backend.domain.expense.Expense;
import com.inventory.backend.domain.expense.ExpenseCategory;
import com.inventory.backend.domain.expense.ExpenseCategoryRepository;
import com.inventory.backend.domain.expense.ExpenseRepository;
import com.inventory.backend.presentation.dto.request.CreateExpenseCategoryRequest;
import com.inventory.backend.presentation.dto.request.CreateExpenseRequest;
import com.inventory.backend.presentation.dto.request.UpdateExpenseRequest;
import com.inventory.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<Expense> findAll() {
        List<Expense> expenses = expenseRepository.findAll();
        expenses.forEach(this::enrichExpense);
        return expenses;
    }

    @Transactional(readOnly = true)
    public Expense findById(UUID id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found: " + id));
        enrichExpense(expense);
        return expense;
    }

    @Transactional(readOnly = true)
    public List<Expense> findByDateRange(LocalDate from, LocalDate to) {
        List<Expense> expenses = expenseRepository.findByDateRange(from, to);
        expenses.forEach(this::enrichExpense);
        return expenses;
    }

    @Transactional(readOnly = true)
    public List<Expense> findByCategory(Integer categoryCode) {
        List<Expense> expenses = expenseRepository.findByCategoryCode(categoryCode);
        expenses.forEach(this::enrichExpense);
        return expenses;
    }

    public Expense create(CreateExpenseRequest request, UUID userId) {
        Integer catCode = request.getCategoryCode();
        if (catCode == null && request.getCategoryId() != null) {
            catCode = expenseCategoryRepository.findById(request.getCategoryId())
                    .map(ExpenseCategory::getCategoryCode)
                    .orElse(null);
        }

        Expense expense = new Expense();
        expense.setId(UUID.randomUUID());
        expense.setExpenseDate(request.getExpenseDate() != null ? request.getExpenseDate() : LocalDate.now());
        expense.setAmount(request.getAmount());
        expense.setCategoryCode(catCode);
        expense.setReferenceNo(request.getReferenceNo());
        expense.setDescription(request.getDescription());
        expense.setStatus(
                request.getStatus() != null && !request.getStatus().isBlank() ? request.getStatus().toUpperCase()
                        : "PAID");
        expense.setExchangeRate(request.getExchangeRate() != null ? request.getExchangeRate() : BigDecimal.ONE);
        expense.setEmployeeId(request.getEmployeeId());
        expense.setUserId(userId);

        Expense saved = expenseRepository.save(expense);
        enrichExpense(saved);
        return saved;
    }

    public Expense update(UUID id, UpdateExpenseRequest request) {
        Expense expense = findById(id);

        if (request.getExpenseDate() != null)
            expense.setExpenseDate(request.getExpenseDate());
        if (request.getAmount() != null)
            expense.setAmount(request.getAmount());

        Integer catCode = request.getCategoryCode();
        if (catCode == null && request.getCategoryId() != null) {
            catCode = expenseCategoryRepository.findById(request.getCategoryId())
                    .map(ExpenseCategory::getCategoryCode)
                    .orElse(null);
        }
        if (catCode != null)
            expense.setCategoryCode(catCode);

        if (request.getReferenceNo() != null)
            expense.setReferenceNo(request.getReferenceNo());
        if (request.getDescription() != null)
            expense.setDescription(request.getDescription());
        if (request.getStatus() != null)
            expense.setStatus(request.getStatus().toUpperCase());
        if (request.getExchangeRate() != null)
            expense.setExchangeRate(request.getExchangeRate());
        if (request.getEmployeeId() != null)
            expense.setEmployeeId(request.getEmployeeId());

        Expense saved = expenseRepository.save(expense);
        enrichExpense(saved);
        return saved;
    }

    public void delete(UUID id) {
        findById(id); // ensure exists
        expenseRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ExpenseCategory> findAllCategories() {
        return expenseCategoryRepository.findAll();
    }

    public ExpenseCategory createCategory(CreateExpenseCategoryRequest request) {
        ExpenseCategory cat = new ExpenseCategory();
        cat.setName(request.getName().trim());
        cat.setDescription(request.getDescription());
        return expenseCategoryRepository.save(cat);
    }

    private void enrichExpense(Expense expense) {
        if (expense.getCategoryCode() != null
                && (expense.getCategoryName() == null || expense.getCategoryName().isBlank())) {
            expenseCategoryRepository.findByCategoryCode(expense.getCategoryCode())
                    .ifPresent(cat -> expense.setCategoryName(cat.getName()));
        }
        if (expense.getEmployeeId() != null && expense.getEmployeeName() == null) {
            employeeRepository.findById(expense.getEmployeeId())
                    .ifPresent(emp -> expense.setEmployeeName(emp.getName()));
        }
    }
}
