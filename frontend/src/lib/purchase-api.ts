import api from './api';

export interface PurchaseItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  orderedQuantity?: number;
  receivedQuantity?: number;
  pendingQuantity?: number;
  fullyReceived?: boolean;
  unitCost: number;
  discount?: number;
  subtotal?: number;
}

export interface Purchase {
  id: string;
  referenceCode?: string;
  purchaseDate: string;
  deliveryDate?: string;
  actualDeliveryDate?: string;
  deliveryStatus?: string;
  paymentDueDate?: string;
  supplierId?: string;
  supplierName?: string;
  exchangeRate?: number;
  currency?: string;
  discount?: number;
  totalAmount?: number;
  status: string;
  note?: string;
  items?: PurchaseItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePurchaseRequest {
  referenceCode?: string;
  purchaseDate: string;
  deliveryDate?: string;
  actualDeliveryDate?: string;
  deliveryStatus?: string;
  paymentDueDate?: string;
  supplierId?: string;
  exchangeRate?: number;
  currency?: string;
  discount?: number;
  note?: string;
  items: { productId: string; quantity: number; receivedQuantity?: number; unitCost: number; discount?: number }[];
}

export const purchaseApi = {
  getAll: (from?: string, to?: string) =>
    api.get<{ data: Purchase[] }>('/purchases', { params: { from, to } }).then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Purchase }>(`/purchases/${id}`).then(r => r.data.data),
  create: (data: CreatePurchaseRequest) => api.post<{ data: Purchase }>('/purchases', data).then(r => r.data.data),
  cancel: (id: string) => api.patch<{ data: Purchase }>(`/purchases/${id}/cancel`).then(r => r.data.data),
  receive: (id: string, items: { itemId?: string; productId?: string; quantityReceived: number }[], deliveryDate?: string) =>
    api.post<{ data: Purchase }>(`/purchases/${id}/receive`, { items, deliveryDate }).then(r => r.data.data),
};
