package com.inventory.backend.application.purchase;

import com.inventory.backend.application.stock.StockService;
import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.domain.purchase.Purchase;
import com.inventory.backend.domain.purchase.PurchaseItem;
import com.inventory.backend.domain.purchase.PurchaseRepository;
import com.inventory.backend.domain.supplier.Supplier;
import com.inventory.backend.domain.supplier.SupplierRepository;
import com.inventory.backend.presentation.dto.request.CreatePurchaseRequest;
import com.inventory.backend.presentation.exception.ResourceAlreadyExistsException;
import com.inventory.backend.presentation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final StockService stockService;

    @Transactional(readOnly = true)
    public List<Purchase> findAll() { return purchaseRepository.findAll(); }

    @Transactional(readOnly = true)
    public Purchase findById(UUID id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Purchase> findByDateRange(LocalDate from, LocalDate to) {
        return purchaseRepository.findByDateRange(from, to);
    }

    /**
     * Create a purchase — increases stock quantities atomically.
     */
    public Purchase create(CreatePurchaseRequest request, UUID userId) {
        if (request.getReferenceCode() != null && !request.getReferenceCode().isBlank()
                && purchaseRepository.existsByReferenceCode(request.getReferenceCode())) {
            throw new ResourceAlreadyExistsException("Reference code already exists: " + request.getReferenceCode());
        }

        Purchase purchase = new Purchase();
        purchase.setPurchaseDate(request.getPurchaseDate() != null ? request.getPurchaseDate() : LocalDate.now());
        purchase.setReferenceCode(request.getReferenceCode());
        purchase.setDeliveryDate(request.getDeliveryDate());
        purchase.setSupplierId(request.getSupplierId());
        purchase.setUserId(userId);
        purchase.setExchangeRate(request.getExchangeRate() != null ? request.getExchangeRate() : BigDecimal.ONE);
        purchase.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        purchase.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);
        purchase.setNote(request.getNote());
        purchase.setStatus("RECEIVED");
        purchase.setPurchaseUuid(UUID.randomUUID().toString());

        List<PurchaseItem> items = new ArrayList<>();
        for (CreatePurchaseRequest.PurchaseItemRequest ir : request.getItems()) {
            Product product = productRepository.findById(ir.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + ir.getProductId()));

            // Add to stock
            stockService.adjustStock(ir.getProductId(), ir.getQuantity());

            PurchaseItem item = new PurchaseItem();
            item.setProductId(ir.getProductId());
            item.setProductName(product.getName());
            item.setQuantity(ir.getQuantity());
            item.setUnitCost(ir.getUnitCost());
            item.setDiscount(ir.getDiscount() != null ? ir.getDiscount() : BigDecimal.ZERO);
            items.add(item);
        }
        purchase.setItems(items);
        purchase.setTotalAmount(purchase.calculateTotal());
        return purchaseRepository.save(purchase);
    }

    /**
     * Cancel purchase — restores (deducts) stock quantities.
     */
    public Purchase cancel(UUID id) {
        Purchase purchase = findById(id);
        if ("CANCELLED".equals(purchase.getStatus())) {
            throw new IllegalStateException("Purchase is already cancelled");
        }
        for (PurchaseItem item : purchase.getItems()) {
            stockService.adjustStock(item.getProductId(), -item.getQuantity());
        }
        purchase.setStatus("CANCELLED");
        return purchaseRepository.save(purchase);
    }

    @Transactional(readOnly = true)
    public String resolveSupplierName(UUID supplierId) {
        if (supplierId == null) return null;
        return supplierRepository.findById(supplierId).map(Supplier::getName).orElse(null);
    }
}
