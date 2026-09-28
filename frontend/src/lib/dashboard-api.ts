import api from './api';

export interface LowStockAlert {
  productId: string;
  productName: string;
  quantity: number;
  reorderLevel: number;
}

export interface RecentSale {
  id: string;
  invoiceCode?: string;
  saleDate: string;
  customerName?: string;
  totalAmount: number;
  currency: string;
  status: string;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalEmployees: number;

  todayRevenue: number;
  monthRevenue: number;
  totalRevenue: number;

  monthSpend: number;

  todaySaleCount: number;
  monthSaleCount: number;
  monthPurchaseCount: number;

  lowStockCount: number;
  lowStockAlerts: LowStockAlert[];

  recentSales: RecentSale[];
  topProducts: TopProduct[];
}

export const dashboardApi = {
  getStats: () => api.get<{ data: DashboardStats }>('/dashboard/stats').then(r => r.data.data),
};
