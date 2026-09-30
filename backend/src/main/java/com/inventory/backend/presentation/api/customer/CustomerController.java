package com.inventory.backend.presentation.api.customer;

import com.inventory.backend.application.customer.CustomerService;
import com.inventory.backend.domain.customer.Customer;
import com.inventory.backend.presentation.dto.request.CreateCustomerRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.CustomerResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> findAll(
            @RequestParam(name = "activeOnly", defaultValue = "false") boolean activeOnly) {
        List<Customer> list = activeOnly ? customerService.findAllActive() : customerService.findAll();
        return ResponseEntity.ok(ApiResponse.success(list.stream().map(this::toResponse).collect(Collectors.toList())));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<CustomerResponse>> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(customerService.findById(id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> create(@Valid @RequestBody CreateCustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created", toResponse(customerService.create(request))));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> update(
            @PathVariable("id") UUID id, @Valid @RequestBody CreateCustomerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Customer updated", toResponse(customerService.update(id, request))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        customerService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private CustomerResponse toResponse(Customer c) {
        return CustomerResponse.builder()
                .id(c.getId()).customerId(c.getCustomerId()).name(c.getName())
                .phone(c.getPhone()).fax(c.getFax()).address(c.getAddress())
                .email(c.getEmail()).province(c.getProvince())
                .creditLimit(c.getCreditLimit()).creditDays(c.getCreditDays())
                .status(c.getStatus()).statusLabel(c.getStatus() == 0 ? "Active" : "Inactive")
                .description(c.getDescription()).employeeCode(c.getEmployeeCode())
                .vat(c.getVat()).nameKh(c.getNameKh()).addressKh(c.getAddressKh())
                .createdAt(c.getCreatedAt()).updatedAt(c.getUpdatedAt())
                .build();
    }
}
