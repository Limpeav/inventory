package com.inventory.backend.application.purchase;

import com.inventory.backend.application.stock.StockService;
import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.domain.purchase.Purchase;
import com.inventory.backend.domain.purchase.PurchaseItem;
import com.inventory.backend.domain.purchase.PurchaseRepository;
import com.inventory.backend.domain.supplier.Supplier;
import com.inventory.backend.domain.supplier.SupplierRepository;
import com.inventory.backend.infrastructure.websocket.WsEvent;
import com.inventory.backend.infrastructure.websocket.WsNotificationService;
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
    private final WsNotificationService wsNotificationService;

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
     * Create a purchase — increases stock quantities for received goods atomically.
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
        purchase.setPaymentDueDate(request.getPaymentDueDate());
        purchase.setSupplierId(request.getSupplierId());
        purchase.setUserId(userId);
        purchase.setExchangeRate(request.getExchangeRate() != null ? request.getExchangeRate() : BigDecimal.ONE);
        purchase.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        purchase.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);
        purchase.setNote(request.getNote());
        purchase.setPurchaseUuid(UUID.randomUUID().toString());

        String initialDeliveryStatus = request.getDeliveryStatus() != null && !request.getDeliveryStatus().isBlank()
                ? request.getDeliveryStatus().toUpperCase() : "RECEIVED";

        List<PurchaseItem> items = new ArrayList<>();
        boolean allReceived = true;
        boolean anyReceived = false;

        for (CreatePurchaseRequest.PurchaseItemRequest ir : request.getItems()) {
            Product product = productRepository.findById(ir.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + ir.getProductId()));

            double ordered = ir.getQuantity();
            double received;
            if (ir.getReceivedQuantity() != null) {
                received = ir.getReceivedQuantity();
            } else if ("ORDERED".equalsIgnoreCase(initialDeliveryStatus)) {
                received = 0.0;
            } else {
                received = ordered;
            }

            if (received > 0) {
                stockService.adjustStock(ir.getProductId(), received);
                anyReceived = true;
            }
            if (received < ordered) {
                allReceived = false;
            }

            PurchaseItem item = new PurchaseItem();
            item.setProductId(ir.getProductId());
            item.setProductName(product.getName());
            item.setOrderedQuantity(ordered);
            item.setReceivedQuantity(received);
            item.setUnitCost(ir.getUnitCost());
            item.setDiscount(ir.getDiscount() != null ? ir.getDiscount() : BigDecimal.ZERO);
            items.add(item);
        }

        String finalStatus = allReceived ? "RECEIVED" : (anyReceived ? "PARTIALLY_RECEIVED" : "ORDERED");
        purchase.setDeliveryStatus(finalStatus);
        purchase.setStatus(finalStatus);
        if (anyReceived) {
            purchase.setActualDeliveryDate(request.getDeliveryDate() != null ? request.getDeliveryDate() : LocalDate.now());
        }

        purchase.setItems(items);
        purchase.setTotalAmount(purchase.calculateTotal());
        Purchase saved = purchaseRepository.save(purchase);
        wsNotificationService.broadcast(WsEvent.of(
                WsEvent.Type.PURCHASE_CREATED,
                saved.getId().toString(),
                saved.getReferenceCode() != null ? saved.getReferenceCode() : saved.getId().toString(),
                null, null));
        return saved;
    }

    /**
     * Receive goods against a purchase order — increases inventory for received items.
     */
    public Purchase receiveItems(UUID id, com.inventory.backend.presentation.dto.request.ReceivePurchaseItemsRequest request) {
        Purchase purchase = findById(id);
        if ("CANCELLED".equals(purchase.getStatus())) {
            throw new IllegalStateException("Cannot receive items for a cancelled purchase");
        }

        for (com.inventory.backend.presentation.dto.request.ReceivePurchaseItemsRequest.ReceiveItemEntry entry : request.getItems()) {
            if (entry.getQuantityReceived() <= 0) continue;

            PurchaseItem item = purchase.getItems().stream()
                    .filter(i -> (entry.getItemId() != null && entry.getItemId().equals(i.getId()))
                            || (entry.getProductId() != null && entry.getProductId().equals(i.getProductId())))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Item not found in purchase: "
                            + (entry.getItemId() != null ? entry.getItemId() : entry.getProductId())));

            double newReceived = item.getReceivedQuantity() + entry.getQuantityReceived();
            item.setReceivedQuantity(newReceived);
            stockService.adjustStock(item.getProductId(), entry.getQuantityReceived());
        }

        boolean allReceived = purchase.getItems().stream().allMatch(PurchaseItem::isFullyReceived);
        boolean anyReceived = purchase.getItems().stream().anyMatch(i -> i.getReceivedQuantity() > 0);
        String finalStatus = allReceived ? "RECEIVED" : (anyReceived ? "PARTIALLY_RECEIVED" : "ORDERED");

        purchase.setDeliveryStatus(finalStatus);
        purchase.setStatus(finalStatus);
        purchase.setActualDeliveryDate(request.getDeliveryDate() != null ? request.getDeliveryDate() : LocalDate.now());

        Purchase saved = purchaseRepository.save(purchase);
        wsNotificationService.broadcast(WsEvent.of(
                WsEvent.Type.PURCHASE_RECEIVED,
                saved.getId().toString(),
                saved.getReferenceCode() != null ? saved.getReferenceCode() : saved.getId().toString(),
                null, null));
        return saved;
    }

    /**
     * Cancel purchase — restores (deducts) actually received stock quantities.
     */
    public Purchase cancel(UUID id) {
        Purchase purchase = findById(id);
        if ("CANCELLED".equals(purchase.getStatus())) {
            throw new IllegalStateException("Purchase is already cancelled");
        }
        for (PurchaseItem item : purchase.getItems()) {
            if (item.getReceivedQuantity() > 0) {
                stockService.adjustStock(item.getProductId(), -item.getReceivedQuantity());
            }
        }
        purchase.setStatus("CANCELLED");
        purchase.setDeliveryStatus("CANCELLED");
        Purchase saved = purchaseRepository.save(purchase);
        wsNotificationService.broadcast(WsEvent.of(
                WsEvent.Type.PURCHASE_CANCELLED,
                saved.getId().toString(),
                saved.getReferenceCode() != null ? saved.getReferenceCode() : saved.getId().toString(),
                null, null));
        return saved;
    }

    @Transactional(readOnly = true)
    public String resolveSupplierName(UUID supplierId) {
        if (supplierId == null) return null;
        return supplierRepository.findById(supplierId).map(Supplier::getName).orElse(null);
    }
}
