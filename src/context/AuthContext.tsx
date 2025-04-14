import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { User } from '../types';
import { toast } from '@/hooks/use-toast';
import { decodeToken, isTokenExpired, getUserRoleFromToken } from '@/utils/tokenUtils';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface LoginResponse {
  token: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const checkAndRefreshToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      if (isTokenExpired(token)) {
        await refreshToken();
      } else {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
        await fetchUser();
      }
    } catch (error) {
      console.error('Error checking token:', error);
      await logout();
    }
  };

  useEffect(() => {
    checkAndRefreshToken();

    // Set up automatic token refresh every 10 minutes
    const refreshInterval = setInterval(() => {
      checkAndRefreshToken();
    }, 10 * 60 * 1000);

    // Set up a listener for window focus to check token
    const handleFocus = () => {
      checkAndRefreshToken();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get<User>('/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/login', { email, password });
      const { token } = response.data;
      
      if (!token) {
        throw new Error('Token non reçu');
      }

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      await fetchUser();
    } catch (error) {
      throw new Error('Identifiants invalides');
    }
  };

  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        throw new Error('No token to refresh');
      }

      const response = await api.post<LoginResponse>('/refresh');
      const { token } = response.data;
      
      if (!token) {
        throw new Error('New token not received');
      }

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error refreshing token:', error);
      await logout();
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
