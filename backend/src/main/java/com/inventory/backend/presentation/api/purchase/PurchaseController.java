package com.inventory.backend.presentation.api.purchase;

import com.inventory.backend.application.purchase.PurchaseService;
import com.inventory.backend.domain.purchase.Purchase;
import com.inventory.backend.domain.user.UserRepository;
import com.inventory.backend.presentation.dto.request.CreatePurchaseRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.PurchaseResponse;
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
@RequestMapping("/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<PurchaseResponse>>> findAll(
            @RequestParam(name = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(name = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<Purchase> purchases = (from != null && to != null)
                ? purchaseService.findByDateRange(from, to)
                : purchaseService.findAll();
        return ResponseEntity.ok(ApiResponse.success(purchases.stream().map(this::toResponse).collect(Collectors.toList())));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(purchaseService.findById(id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> create(
            @Valid @RequestBody CreatePurchaseRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        UUID userId = principal != null
                ? userRepository.findByUsername(principal.getUsername())
                        .or(() -> userRepository.findByEmail(principal.getUsername()))
                        .map(u -> u.getId()).orElse(null)
                : null;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Purchase created", toResponse(purchaseService.create(request, userId))));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<PurchaseResponse>> cancel(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Purchase cancelled", toResponse(purchaseService.cancel(id))));
    }

    private PurchaseResponse toResponse(Purchase p) {
        List<PurchaseResponse.PurchaseItemResponse> items = p.getItems() == null ? List.of() :
                p.getItems().stream().map(i -> PurchaseResponse.PurchaseItemResponse.builder()
                        .id(i.getId()).productId(i.getProductId()).productName(i.getProductName())
                        .quantity(i.getQuantity()).unitCost(i.getUnitCost()).discount(i.getDiscount())
                        .subtotal(i.getSubtotal())
                        .build()).collect(Collectors.toList());

        return PurchaseResponse.builder()
                .id(p.getId()).referenceCode(p.getReferenceCode()).purchaseDate(p.getPurchaseDate())
                .deliveryDate(p.getDeliveryDate()).supplierId(p.getSupplierId())
                .supplierName(purchaseService.resolveSupplierName(p.getSupplierId()))
                .exchangeRate(p.getExchangeRate()).currency(p.getCurrency())
                .discount(p.getDiscount()).totalAmount(p.getTotalAmount()).status(p.getStatus())
                .note(p.getNote()).items(items).createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt())
                .build();
    }
}
