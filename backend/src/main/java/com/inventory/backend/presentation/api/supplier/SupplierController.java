package com.inventory.backend.presentation.api.supplier;

import com.inventory.backend.application.supplier.SupplierService;
import com.inventory.backend.domain.supplier.Supplier;
import com.inventory.backend.presentation.dto.request.CreateSupplierRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.SupplierResponse;
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
@RequestMapping("/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<SupplierResponse>>> findAll() {
        List<SupplierResponse> list = supplierService.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<SupplierResponse>> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(supplierService.findById(id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<SupplierResponse>> create(@Valid @RequestBody CreateSupplierRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Supplier created", toResponse(supplierService.create(request))));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<SupplierResponse>> update(
            @PathVariable("id") UUID id, @Valid @RequestBody CreateSupplierRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Supplier updated", toResponse(supplierService.update(id, request))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        supplierService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private SupplierResponse toResponse(Supplier s) {
        return SupplierResponse.builder()
                .id(s.getId()).name(s.getName()).contactName(s.getContactName())
                .telephone(s.getTelephone()).phone(s.getPhone()).fax(s.getFax())
                .address(s.getAddress()).email(s.getEmail()).website(s.getWebsite())
                .country(s.getCountry()).description(s.getDescription())
                .createdAt(s.getCreatedAt()).updatedAt(s.getUpdatedAt())
                .build();
    }
}
