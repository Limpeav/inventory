import api from '@/lib/api';
import { ApiResponse, Role, Permission, CreateRoleRequest, UpdateRoleRequest } from '@/types';

export const roleApi = {
  getAll: async (): Promise<ApiResponse<Role[]>> => {
    const response = await api.get<ApiResponse<Role[]>>('/roles');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Role>> => {
    const response = await api.get<ApiResponse<Role>>(`/roles/${id}`);
    return response.data;
  },

  create: async (data: CreateRoleRequest): Promise<ApiResponse<Role>> => {
    const response = await api.post<ApiResponse<Role>>('/roles', data);
    return response.data;
  },

  update: async (id: string, data: UpdateRoleRequest): Promise<ApiResponse<Role>> => {
    const response = await api.put<ApiResponse<Role>>(`/roles/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/roles/${id}`);
    return response.data;
  },

  getAllPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    const response = await api.get<ApiResponse<Permission[]>>('/roles/permissions');
    return response.data;
  },
};
