package com.inventory.backend.application.sale;

import com.inventory.backend.application.stock.StockService;
import com.inventory.backend.domain.customer.Customer;
import com.inventory.backend.domain.customer.CustomerRepository;
import com.inventory.backend.domain.employee.Employee;
import com.inventory.backend.domain.employee.EmployeeRepository;
import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.domain.sale.Sale;
import com.inventory.backend.domain.sale.SaleItem;
import com.inventory.backend.domain.sale.SaleRepository;
import com.inventory.backend.infrastructure.websocket.WsEvent;
import com.inventory.backend.infrastructure.websocket.WsNotificationService;
import com.inventory.backend.presentation.dto.request.CreateSaleRequest;
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
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final StockService stockService;
    private final WsNotificationService wsNotificationService;

    @Transactional(readOnly = true)
    public List<Sale> findAll() { return saleRepository.findAll(); }

    @Transactional(readOnly = true)
    public Sale findById(UUID id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Sale> findByDateRange(LocalDate from, LocalDate to) {
        return saleRepository.findByDateRange(from, to);
    }

    /**
     * Create a sale — validates stock and deducts quantities atomically.
     */
    public Sale create(CreateSaleRequest request, UUID userId) {
        if (request.getInvoiceCode() != null && !request.getInvoiceCode().isBlank()
                && saleRepository.existsByInvoiceCode(request.getInvoiceCode())) {
            throw new ResourceAlreadyExistsException("Invoice code already exists: " + request.getInvoiceCode());
        }

        Sale sale = new Sale();
        sale.setSaleDate(request.getSaleDate() != null ? request.getSaleDate() : LocalDate.now());
        sale.setInvoiceCode(request.getInvoiceCode());
        sale.setCustomerId(request.getCustomerId());
        sale.setEmployeeId(request.getEmployeeId());
        sale.setUserId(userId);
        sale.setExchangeRate(request.getExchangeRate() != null ? request.getExchangeRate() : BigDecimal.ONE);
        sale.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        sale.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);
        sale.setNote(request.getNote());
        sale.setStatus("COMPLETED");
        sale.setSaleUuid(UUID.randomUUID().toString());

        List<SaleItem> items = new ArrayList<>();
        for (CreateSaleRequest.SaleItemRequest ir : request.getItems()) {
            Product product = productRepository.findById(ir.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + ir.getProductId()));

            // Deduct stock
            stockService.adjustStock(ir.getProductId(), -ir.getQuantity());

            SaleItem item = new SaleItem();
            item.setProductId(ir.getProductId());
            item.setProductName(product.getName());
            item.setQuantity(ir.getQuantity());
            item.setUnitPrice(ir.getUnitPrice());
            item.setDiscount(ir.getDiscount() != null ? ir.getDiscount() : BigDecimal.ZERO);
            item.setSerialNumber(ir.getSerialNumber());
            item.setWarrantyMonths(ir.getWarrantyMonths() != null ? ir.getWarrantyMonths() : 0);
            items.add(item);
        }
        sale.setItems(items);
        sale.setTotalAmount(sale.calculateTotal());
        Sale saved = saleRepository.save(sale);
        wsNotificationService.broadcast(WsEvent.of(
                WsEvent.Type.SALE_CREATED,
                saved.getId().toString(),
                saved.getInvoiceCode() != null ? saved.getInvoiceCode() : saved.getId().toString(),
                null, null));
        return saved;
    }

    /**
     * Cancel sale — restores stock quantities.
     */
    public Sale cancel(UUID id) {
        Sale sale = findById(id);
        if ("CANCELLED".equals(sale.getStatus())) {
            throw new IllegalStateException("Sale is already cancelled");
        }
        // Restore stock
        for (SaleItem item : sale.getItems()) {
            stockService.adjustStock(item.getProductId(), item.getQuantity());
        }
        sale.setStatus("CANCELLED");
        Sale saved = saleRepository.save(sale);
        wsNotificationService.broadcast(WsEvent.of(
                WsEvent.Type.SALE_CANCELLED,
                saved.getId().toString(),
                saved.getInvoiceCode() != null ? saved.getInvoiceCode() : saved.getId().toString(),
                null, null));
        return saved;
    }

    @Transactional(readOnly = true)
    public String resolveCustomerName(UUID customerId) {
        if (customerId == null) return null;
        return customerRepository.findById(customerId).map(Customer::getName).orElse(null);
    }

    @Transactional(readOnly = true)
    public String resolveEmployeeName(UUID employeeId) {
        if (employeeId == null) return null;
        return employeeRepository.findById(employeeId).map(Employee::getName).orElse(null);
    }
}
