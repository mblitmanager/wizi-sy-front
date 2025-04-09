import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { authAPI } from '../api';
import { toast } from '@/hooks/use-toast';

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

// Session expiration time in milliseconds (2 hours)
const SESSION_EXPIRATION = 2 * 60 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  // Function to refresh the session
  const refreshSession = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Tenter de récupérer l'utilisateur courant via l'API
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      
      // Update session timestamp
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      startSessionTimer();
      
      return true;
    } catch (error) {
      console.error('Session refresh error:', error);
      handleSessionExpiration();
      return false;
    }
  };

  // Function to start the session timer
  const startSessionTimer = () => {
    // Clear any existing timer
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    
    // Set new timer for session expiration
    const timer = setTimeout(() => {
      handleSessionExpiration();
    }, SESSION_EXPIRATION);
    
    setSessionTimer(timer);
  };

  // Function to handle session expiration
  const handleSessionExpiration = () => {
    // Clear user data and token
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

  // Check for session validity on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const timestamp = localStorage.getItem('sessionTimestamp');
      
      if (token) {
        // Check if session is expired
        if (timestamp && Date.now() - parseInt(timestamp) > SESSION_EXPIRATION) {
          handleSessionExpiration();
          setIsLoading(false);
          return;
        }

        try {
          // Tenter de récupérer l'utilisateur via l'API
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          
          // Update session timestamp
          localStorage.setItem('sessionTimestamp', Date.now().toString());
          startSessionTimer();
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('sessionTimestamp');
          console.error('Authentication error:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Cleanup function to clear timer
    return () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    };
  }, []);

  // Set up event listeners for user activity
  useEffect(() => {
    if (user) {
      const handleUserActivity = () => {
        // Only refresh if we have a current session
        const token = localStorage.getItem('token');
        if (token) {
          localStorage.setItem('sessionTimestamp', Date.now().toString());
          startSessionTimer();
        }
      };

      // Add event listeners to track user activity
      window.addEventListener('click', handleUserActivity);
      window.addEventListener('keypress', handleUserActivity);
      window.addEventListener('scroll', handleUserActivity);
      window.addEventListener('mousemove', handleUserActivity);

      return () => {
        // Clean up event listeners
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
      // Utiliser l'API réelle pour la connexion
      const response = await authAPI.login(email, password);
      
      // Store user data in localStorage
      localStorage.setItem('token', response.token || 'default-token');
      localStorage.setItem('userId', response.id);
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      
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
      // Utiliser l'API réelle pour l'inscription
      const response = await authAPI.register(username, email, password);
      
      // Store user data in localStorage
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
