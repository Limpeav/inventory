package com.inventory.backend.application.stock;

import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.domain.stock.StockItem;
import com.inventory.backend.domain.stock.StockRepository;
import com.inventory.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StockService {

    private final StockRepository stockRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<StockItem> findAll() {
        Set<UUID> activeProductIds = productRepository.findAllActive().stream()
                .map(Product::getId)
                .collect(Collectors.toSet());
                
        return stockRepository.findAll().stream()
                .filter(s -> activeProductIds.contains(s.getProductId()))
                .toList();
    }

    @Transactional(readOnly = true)
    public StockItem findByProductId(UUID productId) {
        return stockRepository.findByProductId(productId)
                .orElseGet(() -> {
                    // Auto-initialize stock record for existing products
                    StockItem s = new StockItem();
                    s.setProductId(productId);
                    s.setQuantity(0);
                    return s;
                });
    }

    @Transactional(readOnly = true)
    public List<StockItem> findLowStock(double threshold) {
        Set<UUID> activeProductIds = productRepository.findAllActive().stream()
                .map(Product::getId)
                .collect(Collectors.toSet());

        return stockRepository.findLowStock(threshold).stream()
                .filter(s -> activeProductIds.contains(s.getProductId()))
                .toList();
    }

    /**
     * Adjust stock by delta (positive = add, negative = deduct)
     */
    public StockItem adjustStock(UUID productId, double delta) {
        // Ensure product exists
        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        StockItem stock = stockRepository.findByProductId(productId)
                .orElseGet(() -> {
                    StockItem s = new StockItem();
                    s.setProductId(productId);
                    s.setQuantity(0);
                    return s;
                });

        if (delta > 0) {
            stock.addStock(delta);
        } else if (delta < 0) {
            stock.deductStock(-delta);
        }
        return stockRepository.save(stock);
    }

    /**
     * Set stock to explicit quantity (for manual adjustments)
     */
    public StockItem setStock(UUID productId, double quantity) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        StockItem stock = stockRepository.findByProductId(productId)
                .orElseGet(() -> {
                    StockItem s = new StockItem();
                    s.setProductId(productId);
                    return s;
                });
        stock.setQuantity(quantity);
        return stockRepository.save(stock);
    }

    @Transactional(readOnly = true)
    public String resolveProductName(UUID productId) {
        return productRepository.findById(productId).map(Product::getName).orElse(null);
    }

    @Transactional(readOnly = true)
    public String resolveBarcode(UUID productId) {
        return productRepository.findById(productId).map(Product::getBarcode).orElse(null);
    }
}
