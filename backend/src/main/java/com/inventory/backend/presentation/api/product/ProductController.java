package com.inventory.backend.presentation.api.product;

import com.inventory.backend.application.product.ProductService;
import com.inventory.backend.domain.product.Product;
import com.inventory.backend.presentation.dto.request.CreateProductRequest;
import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.ProductResponse;
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
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> findAll(
            @RequestParam(name = "activeOnly", defaultValue = "false") boolean activeOnly) {
        List<Product> products = activeOnly ? productService.findAllActive() : productService.findAll();
        List<ProductResponse> response = products.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> findById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(productService.findById(id))));
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ApiResponse<ProductResponse>> findByBarcode(@PathVariable("barcode") String barcode) {
        return ResponseEntity.ok(ApiResponse.success(toResponse(productService.findByBarcode(barcode))));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created", toResponse(productService.create(request))));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable("id") UUID id, @Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Product updated", toResponse(productService.update(id, request))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") UUID id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .barcode(p.getBarcode())
                .model(p.getModel())
                .packageUnit(p.getPackageUnit())
                .description(p.getDescription())
                .categoryId(p.getCategoryId())
                .categoryName(productService.resolveCategoryName(p.getCategoryId()))
                .cost(p.getCost())
                .price(p.getPrice())
                .reorderLevel(p.getReorderLevel())
                .hidden(p.isHidden())
                .deleted(p.isDeleted())
                .startDate(p.getStartDate())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
