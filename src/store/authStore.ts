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

interface JwtPayload {
  exp: number;
  iat: number;
  roles: string[];
  username: string;
}

const decodeJWT = (token: string): JwtPayload => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    throw new Error('Invalid token format');
  }
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        try {
          const response = await apiClient.post('/api/login', { email, password });
          const { token } = response.data;
          
          if (!token) {
            throw new Error('No token received');
          }

          // Decode the JWT token
          const decodedToken = decodeJWT(token);
          
          // Create user object from token data
          const user: User = {
            id: decodedToken.username, // Using username as ID since it's unique
            email: decodedToken.username,
            roles: decodedToken.roles,
            firstName: '', // These will be populated later if needed
            lastName: ''
          };

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
            if (decodedToken.roles.includes('ROLE_ADMIN')) {
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