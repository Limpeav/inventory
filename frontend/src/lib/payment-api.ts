import api from './api';

export interface Payment {
  id: string;
  referenceType: string;
  referenceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  currency: string;
  exchangeRate: number;
  note?: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  referenceType: string;
  referenceId: string;
  amount: number;
  paymentMethod?: string;
  paymentDate?: string;
  currency?: string;
  exchangeRate?: number;
  note?: string;
}

export const paymentApi = {
  getAll: (referenceId?: string) =>
    api.get<{ data: Payment[] }>('/payments', { params: referenceId ? { referenceId } : {} }).then(r => r.data.data),
  getByReferenceId: (referenceId: string) =>
    api.get<{ data: Payment[] }>(`/payments/reference/${referenceId}`).then(r => r.data.data),
  getTotalPaid: (referenceId: string) =>
    api.get<{ data: number }>(`/payments/reference/${referenceId}/total`).then(r => r.data.data),
  create: (data: CreatePaymentRequest) =>
    api.post<{ data: Payment }>('/payments', data).then(r => r.data.data),
  delete: (id: string) =>
    api.delete(`/payments/${id}`),
};
