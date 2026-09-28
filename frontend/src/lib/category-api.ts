import api from './api';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export const categoryApi = {
  getAll: () => api.get<{ data: Category[] }>('/categories').then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Category }>(`/categories/${id}`).then(r => r.data.data),
  create: (data: CreateCategoryRequest) => api.post<{ data: Category }>('/categories', data).then(r => r.data.data),
  update: (id: string, data: CreateCategoryRequest) => api.put<{ data: Category }>(`/categories/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};
