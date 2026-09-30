package com.inventory.backend.presentation.api.sale;

import com.inventory.backend.application.sale.SaleService;
import com.inventory.backend.domain.sale.Sale;
import com.inventory.backend.domain.user.UserRepository;
import com.inventory.backend.presentation.dto.request.CreateSaleRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.SaleResponse;
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
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<SaleResponse>>> findAll(
            @RequestParam(name = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<Sale> sales = (from != null && to != null)
                ? saleService.findByDateRange(from, to)
                : saleService.findAll();
        return ResponseEntity.ok(ApiResponse.success(sales.stream().map(this::toResponse).collect(Collectors.toList())));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<SaleResponse>> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(saleService.findById(id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<SaleResponse>> create(
            @Valid @RequestBody CreateSaleRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        UUID userId = principal != null
                ? userRepository.findByUsername(principal.getUsername())
                        .or(() -> userRepository.findByEmail(principal.getUsername()))
                        .map(u -> u.getId()).orElse(null)
                : null;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sale created", toResponse(saleService.create(request, userId))));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<SaleResponse>> cancel(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Sale cancelled", toResponse(saleService.cancel(id))));
    }

    private SaleResponse toResponse(Sale s) {
        List<SaleResponse.SaleItemResponse> items = s.getItems() == null ? List.of() :
                s.getItems().stream().map(i -> SaleResponse.SaleItemResponse.builder()
                        .id(i.getId()).productId(i.getProductId()).productName(i.getProductName())
                        .quantity(i.getQuantity()).unitPrice(i.getUnitPrice()).discount(i.getDiscount())
                        .subtotal(i.getSubtotal())
                        .serialNumber(i.getSerialNumber())
                        .warrantyMonths(i.getWarrantyMonths())
                        .build()).collect(Collectors.toList());

        return SaleResponse.builder()
                .id(s.getId()).invoiceCode(s.getInvoiceCode()).saleDate(s.getSaleDate())
                .customerId(s.getCustomerId()).customerName(saleService.resolveCustomerName(s.getCustomerId()))
                .employeeId(s.getEmployeeId()).employeeName(saleService.resolveEmployeeName(s.getEmployeeId()))
                .exchangeRate(s.getExchangeRate()).currency(s.getCurrency())
                .discount(s.getDiscount()).totalAmount(s.getTotalAmount())
                .status(s.getStatus()).paid(s.isPaid())
                .note(s.getNote()).items(items).createdAt(s.getCreatedAt()).updatedAt(s.getUpdatedAt())
                .build();
    }
}
