import api from './api';

export interface Customer {
  id: string;
  customerId?: string;
  name: string;
  phone?: string;
  fax?: string;
  address?: string;
  email?: string;
  province?: string;
  creditLimit?: number;
  creditDays?: number;
  status: number;
  statusLabel?: string;
  description?: string;
  employeeCode?: string;
  vat?: string;
  nameKh?: string;
  addressKh?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerRequest {
  customerId?: string;
  name: string;
  phone?: string;
  fax?: string;
  address?: string;
  email?: string;
  province?: string;
  creditLimit?: number;
  creditDays?: number;
  status?: number;
  description?: string;
  employeeCode?: string;
  vat?: string;
  nameKh?: string;
  addressKh?: string;
}

export const customerApi = {
  getAll: (activeOnly = false) =>
    api.get<{ data: Customer[] }>('/customers', { params: { activeOnly } }).then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Customer }>(`/customers/${id}`).then(r => r.data.data),
  create: (data: CreateCustomerRequest) => api.post<{ data: Customer }>('/customers', data).then(r => r.data.data),
  update: (id: string, data: CreateCustomerRequest) => api.put<{ data: Customer }>(`/customers/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};
