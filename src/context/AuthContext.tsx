
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authAPI } from '@/api';
import { decodeToken } from '@/utils/tokenUtils';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  refreshSession: () => Promise<void>;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  refreshSession: async () => {},
  getRedirectPath: () => '/',
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          // Transforme les données utilisateur en User
          if (userData) {
            const typedUserData = userData as any;
            const formattedUser: User = {
              id: typedUserData.id || '',
              username: typedUserData.name || typedUserData.username || 'Utilisateur',
              email: typedUserData.email || '',
              role: typedUserData.role || 'stagiaire',
              level: typedUserData.level || 1,
              points: typedUserData.points || 0
            };
            setUser(formattedUser);
          }
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      if (response && (response as any).token) {
        const typedResponse = response as any;
        localStorage.setItem('token', typedResponse.token);
        
        // Decode and set user data from token
        const decodedToken = decodeToken(typedResponse.token);
        if (decodedToken) {
          const formattedUser: User = {
            id: decodedToken.id || '',
            username: 'Utilisateur',
            email: email,
            role: decodedToken.role || 'stagiaire',
            level: 1,
            points: 0
          };
          setUser(formattedUser);
        }
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Mock register function (to be implemented with real API)
  const register = async (userData: any) => {
    try {
      // TODO: Implement real registration API call
      console.log('Register user with data:', userData);
      // Mock successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Session refresh function
  const refreshSession = async () => {
    try {
      // TODO: Implement real session refresh API call
      console.log('Refreshing session');
      
      // For now, just check current user to validate the token
      const userData = await authAPI.getCurrentUser();
      // Transforme les données utilisateur en User
      if (userData) {
        const typedUserData = userData as any;
        const formattedUser: User = {
          id: typedUserData.id || '',
          username: typedUserData.name || typedUserData.username || 'Utilisateur',
          email: typedUserData.email || '',
          role: typedUserData.role || 'stagiaire',
          level: typedUserData.level || 1,
          points: typedUserData.points || 0
        };
        setUser(formattedUser);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      throw error;
    }
  };

  // Get redirect path based on user role
  const getRedirectPath = () => {
    if (!user) return '/auth/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'formateur':
        return '/formateur';
      case 'commercial':
        return '/commercial';
      case 'pole_relation_client':
        return '/pole-relation';
      default:
        return '/';
    }
  };

  // Value object to be provided by context
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register,
    refreshSession,
    getRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
