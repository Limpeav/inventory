import api from './api';

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  model?: string;
  packageUnit?: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  cost?: number;
  price?: number;
  reorderLevel?: number;
  hidden: boolean;
  deleted: boolean;
  startDate?: string;
  productType?: string;
  nameKh?: string;
  brand?: string;
  condition?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  barcode?: string;
  model?: string;
  packageUnit?: string;
  description?: string;
  categoryId?: string;
  cost?: number;
  price?: number;
  reorderLevel?: number;
  hidden?: boolean;
  startDate?: string;
  productType?: string;
  nameKh?: string;
  brand?: string;
  condition?: string;
}

export const productApi = {
  getAll: (activeOnly = false) =>
    api.get<{ data: Product[] }>('/products', { params: { activeOnly } }).then(r => r.data.data),
  getById: (id: string) => api.get<{ data: Product }>(`/products/${id}`).then(r => r.data.data),
  getByBarcode: (barcode: string) => api.get<{ data: Product }>(`/products/barcode/${barcode}`).then(r => r.data.data),
  create: (data: CreateProductRequest) => api.post<{ data: Product }>('/products', data).then(r => r.data.data),
  update: (id: string, data: CreateProductRequest) => api.put<{ data: Product }>(`/products/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/products/${id}`),
};
