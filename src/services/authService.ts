import { api } from './api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'formateur' | 'stagiaire';
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', {
      email,
      password
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/me');
    return response.data;
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post<{ token: string }>('/refresh-token');
    return response.data;
  }
}; 