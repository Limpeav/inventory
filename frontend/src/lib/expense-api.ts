import api from './api';

export interface Expense {
  id: string;
  expenseCode?: number;
  expenseDate: string;
  categoryCode?: number;
  categoryName?: string;
  amount: number;
  referenceNo?: string;
  description?: string;
  status: string;
  exchangeRate?: number;
  employeeId?: string;
  employeeName?: string;
  createdAt?: string;
}

export interface ExpenseCategory {
  id: string;
  categoryCode: number;
  name: string;
  description?: string;
}

export interface CreateExpenseRequest {
  expenseDate?: string;
  amount: number;
  categoryCode?: number;
  categoryId?: string;
  referenceNo?: string;
  description?: string;
  status?: string;
  exchangeRate?: number;
  employeeId?: string;
}

export interface UpdateExpenseRequest {
  expenseDate?: string;
  amount?: number;
  categoryCode?: number;
  categoryId?: string;
  referenceNo?: string;
  description?: string;
  status?: string;
  exchangeRate?: number;
  employeeId?: string;
}

export interface CreateExpenseCategoryRequest {
  name: string;
  description?: string;
}

export const expenseApi = {
  getAll: (params?: { from?: string; to?: string; categoryCode?: number }) =>
    api.get<{ data: Expense[] }>('/expenses', { params }).then(r => r.data.data),

  getById: (id: string) =>
    api.get<{ data: Expense }>(`/expenses/${id}`).then(r => r.data.data),

  create: (data: CreateExpenseRequest) =>
    api.post<{ data: Expense }>('/expenses', data).then(r => r.data.data),

  update: (id: string, data: UpdateExpenseRequest) =>
    api.put<{ data: Expense }>(`/expenses/${id}`, data).then(r => r.data.data),

  delete: (id: string) =>
    api.delete(`/expenses/${id}`),

  getCategories: () =>
    api.get<{ data: ExpenseCategory[] }>('/expenses/categories').then(r => r.data.data),

  createCategory: (data: CreateExpenseCategoryRequest) =>
    api.post<{ data: ExpenseCategory }>('/expenses/categories', data).then(r => r.data.data),
};
