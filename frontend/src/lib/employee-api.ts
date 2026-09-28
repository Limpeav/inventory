import api from './api';

export interface Employee {
  id: string;
  name: string;
  gender?: string;
  phone?: string;
  address?: string;
  startDate?: string;
  pictureUrl?: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeRequest {
  name: string;
  gender?: string;
  phone?: string;
  address?: string;
  startDate?: string;
  pictureUrl?: string;
  description?: string;
}

export const employeeApi = {
  getAll: (activeOnly = false) =>
    api.get<{ data: Employee[] }>('/employees', { params: { activeOnly } }).then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Employee }>(`/employees/${id}`).then(r => r.data.data),
  create: (data: CreateEmployeeRequest) => api.post<{ data: Employee }>('/employees', data).then(r => r.data.data),
  update: (id: string, data: CreateEmployeeRequest) => api.put<{ data: Employee }>(`/employees/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};
