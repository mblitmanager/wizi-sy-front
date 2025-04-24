import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Stagiaire } from '@/types';
import { authService } from '@/services/api';
import { decodeToken } from '@/utils/tokenUtils';

interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

interface ProgressResponse {
  stagiaire: Stagiaire;
  progress: {
    level: string;
    total_points: number;
  };
}

interface AuthResponse {
  token: string;
  user: ApiUser;
}

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
          const userData = await authService.getCurrentUser() as ApiUser;
          if (userData) {
            try {
              const progressResponse = await fetch(`${import.meta.env.VITE_API_URL}/stagiaire/progress`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (progressResponse.ok) {
                const data = await progressResponse.json() as ProgressResponse;
                if (data && data.stagiaire && data.progress) {
                  const stagiaire = data.stagiaire;
                  
                  const formattedUser: User = {
                    id: userData.id.toString(),
                    username: userData.name || userData.username || 'Utilisateur',
                    email: userData.email,
                    role: userData.role,
                    level: parseInt(data.progress.level) || 1,
                    points: data.progress.total_points || 0,
                    stagiaire: {
                      id: stagiaire.id,
                      prenom: stagiaire.prenom || '',
                      civilite: stagiaire.civilite || '',
                      telephone: stagiaire.telephone || '',
                      adresse: stagiaire.adresse || '',
                      date_naissance: stagiaire.date_naissance || '',
                      ville: stagiaire.ville || '',
                      code_postal: stagiaire.code_postal || '',
                      role: stagiaire.role || 'stagiaire',
                      statut: stagiaire.statut || 'actif',
                      user_id: stagiaire.user_id || userData.id
                    }
                  };
                  
                  setUser(formattedUser);
                } else {
                  console.error('Données de progression invalides:', data);
                  throw new Error('Données de progression invalides');
                }
              } else {
                console.error('Erreur lors de la récupération de la progression:', progressResponse.status);
                throw new Error('Erreur lors de la récupération de la progression');
              }
            } catch (error) {
              console.error('Erreur lors de la récupération des données de progression:', error);
              // En cas d'erreur, on crée un utilisateur basique sans données de progression
              const basicUser: User = {
                id: userData.id.toString(),
                username: userData.name || userData.username || 'Utilisateur',
                email: userData.email,
                role: userData.role,
                level: 1,
                points: 0,
                stagiaire: {
                  id: userData.id,
                  prenom: '',
                  civilite: '',
                  telephone: '',
                  adresse: '',
                  date_naissance: '',
                  ville: '',
                  code_postal: '',
                  role: 'stagiaire',
                  statut: 'actif',
                  user_id: userData.id
                }
              };
              setUser(basicUser);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
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
      const response = await authService.login(email, password);
      if (response && (response as any).token) {
        const typedResponse = response as any;
        localStorage.setItem('token', typedResponse.token);
        
        // Récupérer les données du stagiaire depuis l'API
        const progressResponse = await fetch(`${import.meta.env.VITE_API_URL}/stagiaire/progress`, {
          headers: {
            'Authorization': `Bearer ${typedResponse.token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (progressResponse.ok) {
          const data = await progressResponse.json();
          const stagiaire = data.stagiaire;
          
          const formattedUser: User = {
            id: stagiaire.id.toString(),
            username: stagiaire.user.name,
            email: stagiaire.user.email,
            role: stagiaire.role,
            level: parseInt(data.progress.level),
            points: data.progress.total_points,
            stagiaire: {
              id: stagiaire.id,
              prenom: stagiaire.prenom,
              civilite: stagiaire.civilite,
              telephone: stagiaire.telephone,
              adresse: stagiaire.adresse,
              date_naissance: stagiaire.date_naissance,
              ville: stagiaire.ville,
              code_postal: stagiaire.code_postal,
              role: stagiaire.role,
              statut: stagiaire.statut,
              user_id: stagiaire.user_id
            }
          };
          
          setUser(formattedUser);
          localStorage.setItem('userName', formattedUser.username);
          localStorage.setItem('userEmail', formattedUser.email);
          localStorage.setItem('userRole', formattedUser.role);
          localStorage.setItem('userLevel', formattedUser.level.toString());
          localStorage.setItem('userPoints', formattedUser.points.toString());
        }
      } else {
        throw new Error('Aucun jeton reçu');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Mock register function (to be implemented with real API)
  const register = async (userData: any) => {
    try {
      // TODO: Implement real registration API call
      console.log('Enregistrement de l\'utilisateur avec les données:', userData);  
      // Mock successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      throw error;
    }
  };

  // Session refresh function
  const refreshSession = async () => {
    try {
      // TODO: Implement real session refresh API call
      console.log('Refreshing session');
      
      // For now, just check current user to validate the token
      const userData = await authService.getCurrentUser();
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
      console.error('Erreur lors de la mise à jour de la session:', error);
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
