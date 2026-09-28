package com.inventory.backend.presentation.api.salereturn;

import com.inventory.backend.application.salereturn.SaleReturnService;
import com.inventory.backend.domain.salereturn.SaleReturn;
import com.inventory.backend.domain.salereturn.SaleReturnItem;
import com.inventory.backend.presentation.dto.request.CreateSaleReturnRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.SaleReturnResponse;
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
@RequestMapping("/returns")
@RequiredArgsConstructor
public class SaleReturnController {

    private final SaleReturnService saleReturnService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('USER')")
    public ResponseEntity<ApiResponse<List<SaleReturnResponse>>> findAll(
            @RequestParam(required = false) UUID saleId) {
        List<SaleReturn> list = saleId != null
                ? saleReturnService.findBySaleId(saleId)
                : saleReturnService.findAll();
        return ResponseEntity.ok(ApiResponse.success(list.stream().map(this::toResponse).collect(Collectors.toList())));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('USER')")
    public ResponseEntity<ApiResponse<SaleReturnResponse>> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(saleReturnService.findById(id))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<SaleReturnResponse>> create(@Valid @RequestBody CreateSaleReturnRequest request) {
        SaleReturn created = saleReturnService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Return processed and stock restored", toResponse(created)));
    }

    private SaleReturnResponse toResponse(SaleReturn r) {
        List<SaleReturnResponse.SaleReturnItemResponse> items = r.getItems() == null ? List.of() :
                r.getItems().stream()
                        .map(this::toItemResponse)
                        .collect(Collectors.toList());

        return SaleReturnResponse.builder()
                .id(r.getId())
                .saleId(r.getSaleId())
                .returnDate(r.getReturnDate())
                .reason(r.getReason())
                .totalRefund(r.getTotalRefund())
                .status(r.getStatus())
                .items(items)
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }

    private SaleReturnResponse.SaleReturnItemResponse toItemResponse(SaleReturnItem item) {
        return SaleReturnResponse.SaleReturnItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .refundAmount(item.getRefundAmount())
                .build();
    }
}
