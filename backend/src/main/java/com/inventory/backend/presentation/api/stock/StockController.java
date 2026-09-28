package com.inventory.backend.presentation.api.stock;

import com.inventory.backend.application.stock.StockService;
import com.inventory.backend.domain.stock.StockItem;
import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.StockResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;
    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StockResponse>>> findAll() {
        List<StockResponse> list = stockService.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<StockResponse>> findByProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(stockService.findByProductId(productId))));
    }

    @GetMapping("/low")
    public ResponseEntity<ApiResponse<List<StockResponse>>> findLowStock(
            @RequestParam(defaultValue = "10") double threshold) {
        List<StockResponse> list = stockService.findLowStock(threshold).stream()
                .map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PatchMapping("/product/{productId}/adjust")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<StockResponse>> adjust(
            @PathVariable UUID productId,
            @RequestParam double delta) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(stockService.adjustStock(productId, delta))));
    }

    @PutMapping("/product/{productId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<StockResponse>> setStock(
            @PathVariable UUID productId,
            @RequestParam double quantity) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(stockService.setStock(productId, quantity))));
    }

    private StockResponse toResponse(StockItem s) {
        Product product = productRepository.findById(s.getProductId()).orElse(null);
        return StockResponse.builder()
                .id(s.getId())
                .productId(s.getProductId())
                .productName(product != null ? product.getName() : null)
                .barcode(product != null ? product.getBarcode() : null)
                .quantity(s.getQuantity())
                .reservedQty(s.getReservedQty())
                .availableQty(s.getAvailableQty())
                .reorderLevel(product != null ? product.getReorderLevel() : 0)
                .lowStock(product != null && product.needsReorder(s.getQuantity()))
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
