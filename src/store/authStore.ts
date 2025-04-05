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
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        try {
          const response = await apiClient.post('/api/login', { email, password });
          const { token, user } = response.data;
          
          // Update axios default headers with the new token
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ token, user });
          localStorage.setItem('token', token);
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
        
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;