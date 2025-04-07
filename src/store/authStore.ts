import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import apiClient from '../lib/axios';
import { AxiosError } from 'axios';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        try {
          const response = await apiClient.post('/api/login', { email, password });
          const { token, user } = response.data;
          
          if (!user || !user.roles) {
            throw new Error('Invalid user data received');
          }

          // Update axios default headers with the new token
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Set the user and token in the store
          set({ token, user });
          localStorage.setItem('token', token);

          // Clear any existing navigation timeouts
          if (window.navigationTimeout) {
            clearTimeout(window.navigationTimeout);
          }

          // Delay navigation slightly to ensure state is updated
          window.navigationTimeout = setTimeout(() => {
            if (user.roles.includes('ROLE_ADMIN')) {
              window.location.href = '/admin';
            } else {
              window.location.href = '/';
            }
          }, 100);

        } catch (error) {
          if (error instanceof AxiosError) {
            if (!error.response) {
              throw new Error('Network error. Please check your connection and try again.');
            }
            if (error.response.status === 401) {
              throw new Error('Invalid email or password');
            }
            throw new Error(error.response.data?.message || 'An error occurred during login');
          }
          throw new Error('An unexpected error occurred');
        }
      },
      logout: () => {
        // Clear axios default headers
        delete apiClient.defaults.headers.common['Authorization'];
        
        // Clear the store
        set({ user: null, token: null });
        localStorage.removeItem('token');

        // Redirect to login
        window.location.href = '/login';
      },
      isAdmin: () => {
        const state = get();
        return state.user?.roles?.includes('ROLE_ADMIN') || false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

// Add type declaration for the timeout
declare global {
  interface Window {
    navigationTimeout?: number;
  }
}

export default useAuthStore;