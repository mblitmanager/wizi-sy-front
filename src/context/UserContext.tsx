
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier le token au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Vérifier si le token est valide
          const response = await fetch('http://localhost:8000/api/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token invalide ou expiré
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        
        // Fetch user details
        const userResponse = await fetch('http://localhost:8000/api/me', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });
        
        const userData = await userResponse.json();
        setUser(userData);
        setToken(data.token);
        toast.success("Connexion réussie");
      } else {
        toast.error(data.message || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:8000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      toast.success("Déconnexion réussie");
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
