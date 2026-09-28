package com.inventory.backend.application.salereturn;

import com.inventory.backend.application.stock.StockService;
import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.domain.sale.Sale;
import com.inventory.backend.domain.sale.SaleItem;
import com.inventory.backend.domain.sale.SaleRepository;
import com.inventory.backend.domain.salereturn.SaleReturn;
import com.inventory.backend.domain.salereturn.SaleReturnItem;
import com.inventory.backend.domain.salereturn.SaleReturnRepository;
import com.inventory.backend.presentation.dto.request.CreateSaleReturnRequest;
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
public class SaleReturnService {

    private final SaleReturnRepository saleReturnRepository;
    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final StockService stockService;

    @Transactional(readOnly = true)
    public List<SaleReturn> findAll() { return saleReturnRepository.findAll(); }

    @Transactional(readOnly = true)
    public List<SaleReturn> findBySaleId(UUID saleId) { return saleReturnRepository.findBySaleId(saleId); }

    @Transactional(readOnly = true)
    public SaleReturn findById(UUID id) {
        return saleReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale return not found: " + id));
    }

    public SaleReturn create(CreateSaleReturnRequest request) {
        Sale sale = saleRepository.findById(request.getSaleId())
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found: " + request.getSaleId()));

        if ("CANCELLED".equals(sale.getStatus())) {
            throw new IllegalStateException("Cannot return items from a cancelled sale");
        }

        SaleReturn ret = new SaleReturn();
        ret.setSaleId(request.getSaleId());
        ret.setReturnDate(request.getReturnDate() != null ? request.getReturnDate() : LocalDate.now());
        ret.setReason(request.getReason());
        ret.setStatus("COMPLETED");

        List<SaleReturnItem> items = new ArrayList<>();
        for (CreateSaleReturnRequest.ReturnItemRequest ir : request.getItems()) {
            Product product = productRepository.findById(ir.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + ir.getProductId()));

            // Find original sale price for this product
            BigDecimal originalPrice = sale.getItems() == null ? BigDecimal.ZERO :
                    sale.getItems().stream()
                            .filter(si -> si.getProductId().equals(ir.getProductId()))
                            .findFirst()
                            .map(SaleItem::getUnitPrice)
                            .orElse(BigDecimal.ZERO);

            // Restore stock
            stockService.adjustStock(ir.getProductId(), ir.getQuantity());

            SaleReturnItem item = new SaleReturnItem();
            item.setProductId(ir.getProductId());
            item.setProductName(product.getName());
            item.setQuantity(ir.getQuantity());
            item.setUnitPrice(originalPrice);
            items.add(item);
        }

        ret.setItems(items);
        ret.setTotalRefund(ret.calculateRefund());
        return saleReturnRepository.save(ret);
    }
}
