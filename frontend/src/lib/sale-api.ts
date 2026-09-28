import api from './api';

export interface SaleItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  subtotal?: number;
}

export interface Sale {
  id: string;
  invoiceCode?: string;
  saleDate: string;
  customerId?: string;
  customerName?: string;
  employeeId?: string;
  exchangeRate?: number;
  currency?: string;
  discount?: number;
  totalAmount?: number;
  status: string;
  note?: string;
  items?: SaleItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSaleRequest {
  invoiceCode?: string;
  saleDate: string;
  customerId?: string;
  employeeId?: string;
  exchangeRate?: number;
  currency?: string;
  discount?: number;
  note?: string;
  items: { productId: string; quantity: number; unitPrice: number; discount?: number }[];
}

export const saleApi = {
  getAll: (from?: string, to?: string) =>
    api.get<{ data: Sale[] }>('/sales', { params: { from, to } }).then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Sale }>(`/sales/${id}`).then(r => r.data.data),
  create: (data: CreateSaleRequest) => api.post<{ data: Sale }>('/sales', data).then(r => r.data.data),
  cancel: (id: string) => api.patch<{ data: Sale }>(`/sales/${id}/cancel`).then(r => r.data.data),
};
