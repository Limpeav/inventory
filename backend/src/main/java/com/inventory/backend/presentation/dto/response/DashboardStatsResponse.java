package com.inventory.backend.presentation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {

    // Counts
    private long totalProducts;
    private long totalCustomers;
    private long totalSuppliers;
    private long totalEmployees;

    // Revenue
    private BigDecimal todayRevenue;
    private BigDecimal monthRevenue;
    private BigDecimal totalRevenue;

    // Purchases
    private BigDecimal monthSpend;

    // Transactions
    private long todaySaleCount;
    private long monthSaleCount;
    private long monthPurchaseCount;

    // Stock alerts
    private long lowStockCount;
    private List<LowStockAlert> lowStockAlerts;

    // Recent activity
    private List<RecentSale> recentSales;
    private List<TopProduct> topProducts;

    @Data
    @Builder
    public static class LowStockAlert {
        private String productId;
        private String productName;
        private double quantity;
        private double reorderLevel;
    }

    @Data
    @Builder
    public static class RecentSale {
        private String id;
        private String invoiceCode;
        private LocalDate saleDate;
        private String customerName;
        private BigDecimal totalAmount;
        private String currency;
        private String status;
    }

    @Data
    @Builder
    public static class TopProduct {
        private String productId;
        private String productName;
        private double totalSold;
        private BigDecimal totalRevenue;
    }
}
