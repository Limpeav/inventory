import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse } from '@/types';

interface AuthState {
  user: Omit<AuthResponse, 'accessToken' | 'refreshToken' | 'tokenType'> | null;
  isAuthenticated: boolean;
  setAuth: (auth: Omit<AuthResponse, 'accessToken' | 'refreshToken'>) => void;
  clearAuth: () => void;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (auth) => {
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
