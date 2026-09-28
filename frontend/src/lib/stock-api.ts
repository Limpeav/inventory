import api from './api';

export interface StockItem {
  id?: string;
  productId: string;
  productName?: string;
  barcode?: string;
  categoryName?: string;
  quantity: number;
  reservedQty?: number;
  availableQty?: number;
  reorderLevel?: number;
  lowStock?: boolean;
  updatedAt?: string;
}

export const stockApi = {
  getAll: () => api.get<{ data: StockItem[] }>('/stock').then(r => r.data.data),
  getByProduct: (productId: string) => api.get<{ data: StockItem }>(`/stock/product/${productId}`).then(r => r.data.data),
  getLowStock: (threshold = 10) => api.get<{ data: StockItem[] }>('/stock/low', { params: { threshold } }).then(r => r.data.data),
  adjust: (productId: string, delta: number) => api.patch<{ data: StockItem }>(`/stock/product/${productId}/adjust`, null, { params: { delta } }).then(r => r.data.data),
  setStock: (productId: string, quantity: number) => api.put<{ data: StockItem }>(`/stock/product/${productId}`, null, { params: { quantity } }).then(r => r.data.data),
};
