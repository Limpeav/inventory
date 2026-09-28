import api from './api';

export interface SaleReturnItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  refundAmount: number;
}

export interface SaleReturn {
  id: string;
  saleId: string;
  returnDate: string;
  reason?: string;
  totalRefund: number;
  status: string;
  items: SaleReturnItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleReturnRequest {
  saleId: string;
  returnDate?: string;
  reason?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export const returnApi = {
  getAll: (saleId?: string) =>
    api.get<{ data: SaleReturn[] }>('/returns', { params: saleId ? { saleId } : {} }).then(r => r.data.data),
  getById: (id: string) =>
    api.get<{ data: SaleReturn }>(`/returns/${id}`).then(r => r.data.data),
  create: (data: CreateSaleReturnRequest) =>
    api.post<{ data: SaleReturn }>('/returns', data).then(r => r.data.data),
};
