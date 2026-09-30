import api from './api';

export interface Province {
  code: number;
  name: string;
}

export interface Currency {
  code: number;
  name: string;
}

export interface Account {
  code: number;
  accountTypeCode: number;
  name: string;
  description?: string;
  isCredit?: boolean;
  isDefault?: boolean;
}

export const lookupApi = {
  getProvinces: () => api.get<{ data: Province[] }>('/provinces').then(r => r.data.data),
  getCurrencies: () => api.get<{ data: Currency[] }>('/currencies').then(r => r.data.data),
  getAccounts: () => api.get<{ data: Account[] }>('/accounts').then(r => r.data.data),
};
