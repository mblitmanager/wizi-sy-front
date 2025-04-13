import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, authAPI } from '@/api';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isAdmin: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await authAPI.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue sur Wizi Learn!',
      });
    } catch (error) {
      throw new Error('Identifiants invalides');
    }
  };

  const refreshToken = async () => {
    try {
      await authAPI.refreshToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
      await logout();
    }
  };

  const refreshSession = async () => {
    try {
      await refreshToken();
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing session:', error);
      await logout();
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
      toast({
        title: 'Déconnexion',
        description: 'Vous avez été déconnecté avec succès.',
      });
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      isLoading,
      login, 
      logout, 
      refreshToken,
      isAdmin,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};
