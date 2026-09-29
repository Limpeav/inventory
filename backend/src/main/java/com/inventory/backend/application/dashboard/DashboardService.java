package com.inventory.backend.application.dashboard;

import com.inventory.backend.domain.customer.CustomerRepository;
import com.inventory.backend.domain.employee.EmployeeRepository;
import com.inventory.backend.domain.product.Product;
import com.inventory.backend.domain.product.ProductRepository;
import com.inventory.backend.domain.purchase.Purchase;
import com.inventory.backend.domain.purchase.PurchaseRepository;
import com.inventory.backend.domain.sale.Sale;
import com.inventory.backend.domain.sale.SaleRepository;
import com.inventory.backend.domain.stock.StockRepository;
import com.inventory.backend.domain.supplier.SupplierRepository;
import com.inventory.backend.presentation.dto.response.DashboardStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final EmployeeRepository employeeRepository;
    private final SaleRepository saleRepository;
    private final PurchaseRepository purchaseRepository;
    private final StockRepository stockRepository;

    public DashboardStatsResponse getStats() {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        // ── Counts ──────────────────────────────────────────────────────────
        long totalProducts  = productRepository.findAll().stream().filter(p -> !p.isDeleted()).count();
        long totalCustomers = customerRepository.findAll().size();
        long totalSuppliers = supplierRepository.findAll().size();
        long totalEmployees = employeeRepository.findAllActive().size();

        // ── Sales ────────────────────────────────────────────────────────────
        List<Sale> allSales  = saleRepository.findAll();
        List<Sale> todaySales = allSales.stream()
                .filter(s -> !"CANCELLED".equals(s.getStatus()) && today.equals(s.getSaleDate()))
                .collect(Collectors.toList());
        List<Sale> monthSales = saleRepository.findByDateRange(monthStart, today).stream()
                .filter(s -> !"CANCELLED".equals(s.getStatus()))
                .collect(Collectors.toList());

        BigDecimal todayRevenue = todaySales.stream()
                .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal monthRevenue = monthSales.stream()
                .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRevenue = allSales.stream()
                .filter(s -> !"CANCELLED".equals(s.getStatus()))
                .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // ── Purchases ────────────────────────────────────────────────────────
        List<Purchase> monthPurchases = purchaseRepository.findByDateRange(monthStart, today).stream()
                .filter(p -> !"CANCELLED".equals(p.getStatus()))
                .collect(Collectors.toList());

        BigDecimal monthSpend = monthPurchases.stream()
                .map(p -> p.getTotalAmount() != null ? p.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // ── Stock Alerts ─────────────────────────────────────────────────────
        List<DashboardStatsResponse.LowStockAlert> lowStockAlerts = new ArrayList<>();
        List<Product> allProducts = productRepository.findAll();
        stockRepository.findAll().forEach(stock -> {
            allProducts.stream()
                    .filter(p -> p.getId().equals(stock.getProductId()) && !p.isDeleted())
                    .findFirst()
                    .ifPresent(product -> {
                        if (product.needsReorder(stock.getQuantity())) {
                            lowStockAlerts.add(DashboardStatsResponse.LowStockAlert.builder()
                                    .productId(product.getId().toString())
                                    .productName(product.getName())
                                    .quantity(stock.getQuantity())
                                    .reorderLevel(product.getReorderLevel())
                                    .build());
                        }
                    });
        });

        // ── Recent Sales (last 10) ───────────────────────────────────────────
        List<DashboardStatsResponse.RecentSale> recentSales = allSales.stream()
                .sorted(Comparator.comparing(Sale::getSaleDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .map(s -> DashboardStatsResponse.RecentSale.builder()
                        .id(s.getId().toString())
                        .invoiceCode(s.getInvoiceCode())
                        .saleDate(s.getSaleDate())
                        .customerName(null) // resolved in controller to avoid N+1
                        .totalAmount(s.getTotalAmount())
                        .currency(s.getCurrency())
                        .status(s.getStatus())
                        .build())
                .collect(Collectors.toList());

        // ── Top Products (by qty sold, all time) ─────────────────────────────
        Map<UUID, double[]> productTotals = new HashMap<>();  // [qty, revenue]
        allSales.stream()
                .filter(s -> !"CANCELLED".equals(s.getStatus()))
                .flatMap(s -> s.getItems() != null ? s.getItems().stream() : java.util.stream.Stream.empty())
                .forEach(item -> {
                    productTotals.computeIfAbsent(item.getProductId(), k -> new double[]{0, 0});
                    double[] totals = productTotals.get(item.getProductId());
                    totals[0] += item.getQuantity();
                    totals[1] += item.getSubtotal() != null ? item.getSubtotal().doubleValue() : 0;
                });

        List<DashboardStatsResponse.TopProduct> topProducts = productTotals.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue()[0], a.getValue()[0]))
                .limit(5)
                .map(e -> {
                    String name = allProducts.stream()
                            .filter(p -> p.getId().equals(e.getKey()))
                            .map(Product::getName).findFirst().orElse(e.getKey().toString());
                    return DashboardStatsResponse.TopProduct.builder()
                            .productId(e.getKey().toString())
                            .productName(name)
                            .totalSold(e.getValue()[0])
                            .totalRevenue(BigDecimal.valueOf(e.getValue()[1]))
                            .build();
                })
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .totalProducts(totalProducts)
                .totalCustomers(totalCustomers)
                .totalSuppliers(totalSuppliers)
                .totalEmployees(totalEmployees)
                .todayRevenue(todayRevenue)
                .monthRevenue(monthRevenue)
                .totalRevenue(totalRevenue)
                .monthSpend(monthSpend)
                .todaySaleCount(todaySales.size())
                .monthSaleCount(monthSales.size())
                .monthPurchaseCount(monthPurchases.size())
                .lowStockCount(lowStockAlerts.size())
                .lowStockAlerts(lowStockAlerts)
                .recentSales(recentSales)
                .topProducts(topProducts)
                .build();
    }
}
