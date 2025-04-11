import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { authAPI } from '../api';
import { toast } from '@/hooks/use-toast';
import { decodeToken, isTokenExpired, getUserRoleFromToken } from '@/utils/tokenUtils';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshSession: async () => false,
});

const SESSION_EXPIRATION = 2 * 60 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  const refreshSession = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    if (isTokenExpired(token)) {
      handleSessionExpiration();
      return false;
    }
    
    try {
      const decodedToken = decodeToken(token);
      if (!decodedToken || !decodedToken.id) {
        handleSessionExpiration();
        return false;
      }
      
      localStorage.setItem('userId', decodedToken.id);
      
      const userData = await authAPI.getCurrentUser();
      
      if (decodedToken.role && !userData.role) {
        userData.role = decodedToken.role;
      }
      
      userData.token = token;
      
      setUser(userData);
      
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      startSessionTimer();
      
      return true;
    } catch (error) {
      console.error('Session refresh error:', error);
      handleSessionExpiration();
      return false;
    }
  };

  const startSessionTimer = () => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    
    const timer = setTimeout(() => {
      handleSessionExpiration();
    }, SESSION_EXPIRATION);
    
    setSessionTimer(timer);
  };

  const handleSessionExpiration = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionTimestamp');
    setUser(null);
    
    toast({
      title: "Session expirée",
      description: "Votre session a expiré. Veuillez vous reconnecter.",
      variant: "destructive",
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const timestamp = localStorage.getItem('sessionTimestamp');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      if (isTokenExpired(token)) {
        handleSessionExpiration();
        setIsLoading(false);
        return;
      }
      
      if (timestamp && Date.now() - parseInt(timestamp) > SESSION_EXPIRATION) {
        handleSessionExpiration();
        setIsLoading(false);
        return;
      }

      try {
        const decodedToken = decodeToken(token);
        if (!decodedToken || !decodedToken.id) {
          throw new Error('Invalid token format');
        }
        
        localStorage.setItem('userId', decodedToken.id);
        
        const userData = await authAPI.getCurrentUser();
        
        if (decodedToken.role && !userData.role) {
          userData.role = decodedToken.role;
        }
        
        userData.token = token;
        
        setUser(userData);
        
        localStorage.setItem('sessionTimestamp', Date.now().toString());
        startSessionTimer();
      } catch (error) {
        console.error('Authentication error:', error);
        handleSessionExpiration();
      }
      
      setIsLoading(false);
    };

    checkAuth();

    return () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      const handleUserActivity = () => {
        if (localStorage.getItem('token')) {
          localStorage.setItem('sessionTimestamp', Date.now().toString());
          startSessionTimer();
        }
      };

      window.addEventListener('click', handleUserActivity);
      window.addEventListener('keypress', handleUserActivity);
      window.addEventListener('scroll', handleUserActivity);
      window.addEventListener('mousemove', handleUserActivity);

      return () => {
        window.removeEventListener('click', handleUserActivity);
        window.removeEventListener('keypress', handleUserActivity);
        window.removeEventListener('scroll', handleUserActivity);
        window.removeEventListener('mousemove', handleUserActivity);
      };
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      if (!response.token) {
        throw new Error('No token received from server');
      }
      
      const decodedToken = decodeToken(response.token);
      
      if (!decodedToken) {
        throw new Error('Invalid token format');
      }
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', decodedToken.id || response.id);
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      
      if (decodedToken.role && !response.role) {
        response.role = decodedToken.role;
      }
      
      setUser(response);
      startSessionTimer();
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue sur Wizi Learn${response.role === 'admin' ? ' - Mode Administrateur' : ''}!`,
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(username, email, password);
      
      localStorage.setItem('token', response.token || 'default-token');
      localStorage.setItem('userId', response.id);
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      
      setUser(response);
      startSessionTimer();
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur Wizi Learn!",
      });
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    localStorage.removeItem('sessionTimestamp');
    setUser(null);
    
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
    
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
