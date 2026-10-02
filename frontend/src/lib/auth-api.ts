import api from '@/lib/api';
import { ApiResponse, AuthResponse, ForgotPasswordRequest, LoginRequest, ResetPasswordRequest } from '@/types';
import axios from 'axios';

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    // Send to Next.js route handler to set HttpOnly cookies
    const response = await axios.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
    // Password reset goes through the standard proxy
    const response = await api.post<ApiResponse<null>>('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<null>> => {
    // Password reset goes through the standard proxy
    const response = await api.post<ApiResponse<null>>('/auth/reset-password', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Send to Next.js route handler to clear cookies
    await axios.post('/api/auth/logout');
  },
};
