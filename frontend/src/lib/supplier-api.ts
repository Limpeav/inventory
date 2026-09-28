import api from './api';

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  telephone?: string;
  phone?: string;
  fax?: string;
  address?: string;
  email?: string;
  website?: string;
  country?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierRequest {
  name: string;
  contactName?: string;
  telephone?: string;
  phone?: string;
  fax?: string;
  address?: string;
  email?: string;
  website?: string;
  country?: string;
  description?: string;
}

export const supplierApi = {
  getAll: () => api.get<{ data: Supplier[] }>('/suppliers').then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Supplier }>(`/suppliers/${id}`).then(r => r.data.data),
  create: (data: CreateSupplierRequest) => api.post<{ data: Supplier }>('/suppliers', data).then(r => r.data.data),
  update: (id: string, data: CreateSupplierRequest) => api.put<{ data: Supplier }>(`/suppliers/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/suppliers/${id}`),
};
