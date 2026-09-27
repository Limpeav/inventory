import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { AuthResponse } from '@/types';

interface AuthState {
  user: Omit<AuthResponse, 'accessToken' | 'refreshToken' | 'tokenType'> | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponse) => void;
  clearAuth: () => void;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (auth: AuthResponse) => {
        Cookies.set('accessToken', auth.accessToken, { expires: 1 });
        Cookies.set('refreshToken', auth.refreshToken, { expires: 7 });
        set({
          user: {
            username: auth.username,
            fullName: auth.fullName,
            email: auth.email,
            roles: auth.roles,
          },
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        set({ user: null, isAuthenticated: false });
      },

      hasRole: (role: string) => {
        const { user } = get();
        return user?.roles?.includes(role) ?? false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
