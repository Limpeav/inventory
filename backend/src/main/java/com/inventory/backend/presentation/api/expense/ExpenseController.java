package com.inventory.backend.presentation.api.expense;

import com.inventory.backend.application.expense.ExpenseService;
import com.inventory.backend.domain.expense.Expense;
import com.inventory.backend.domain.expense.ExpenseCategory;
import com.inventory.backend.domain.user.UserRepository;
import com.inventory.backend.presentation.dto.request.CreateExpenseCategoryRequest;
import com.inventory.backend.presentation.dto.request.CreateExpenseRequest;
import com.inventory.backend.presentation.dto.request.UpdateExpenseRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.ExpenseCategoryResponse;
import com.inventory.backend.presentation.dto.response.ExpenseResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> findAll(
            @RequestParam(name = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(name = "categoryCode", required = false) Integer categoryCode) {

        List<Expense> expenses;
        if (from != null && to != null) {
            expenses = expenseService.findByDateRange(from, to);
        } else if (categoryCode != null) {
            expenses = expenseService.findByCategory(categoryCode);
        } else {
            expenses = expenseService.findAll();
        }

        List<ExpenseResponse> response = expenses.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ExpenseResponse>> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(expenseService.findById(id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ExpenseResponse>> create(
            @Valid @RequestBody CreateExpenseRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        UUID userId = principal != null
                ? userRepository.findByUsername(principal.getUsername())
                        .or(() -> userRepository.findByEmail(principal.getUsername()))
                        .map(u -> u.getId()).orElse(null)
                : null;
        Expense created = expenseService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Expense recorded successfully", toResponse(created)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ExpenseResponse>> update(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateExpenseRequest request) {
        Expense updated = expenseService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", toResponse(updated)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        expenseService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", null));
    }

    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<ExpenseCategoryResponse>>> findAllCategories() {
        List<ExpenseCategoryResponse> response = expenseService.findAllCategories().stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ExpenseCategoryResponse>> createCategory(
            @Valid @RequestBody CreateExpenseCategoryRequest request) {
        ExpenseCategory created = expenseService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", toCategoryResponse(created)));
    }

    private ExpenseResponse toResponse(Expense e) {
        return ExpenseResponse.builder()
                .id(e.getId())
                .expenseCode(e.getExpenseCode())
                .expenseDate(e.getExpenseDate())
                .categoryCode(e.getCategoryCode())
                .categoryName(e.getCategoryName())
                .amount(e.getAmount())
                .referenceNo(e.getReferenceNo())
                .description(e.getDescription())
                .status(e.getStatus())
                .exchangeRate(e.getExchangeRate())
                .employeeId(e.getEmployeeId())
                .employeeName(e.getEmployeeName())
                .createdAt(e.getCreatedAt())
                .build();
    }

    private ExpenseCategoryResponse toCategoryResponse(ExpenseCategory c) {
        return ExpenseCategoryResponse.builder()
                .id(c.getId())
                .categoryCode(c.getCategoryCode())
                .name(c.getName())
                .description(c.getDescription())
                .build();
    }
}
