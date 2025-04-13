import { api } from './api';
import { User } from '@/types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', {
      email,
      password
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/api/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User; stagiaire?: any }>('/api/me');
    return response.data.user;
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post<{ token: string }>('/api/refresh-token');
    return response.data;
  }
}; 