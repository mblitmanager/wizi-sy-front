
import { User } from "@/types";
import { createContext, useContext, useState, ReactNode } from "react";
import { currentUser } from "@/data/mockData";
import { toast } from "sonner";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(currentUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll just use the mock data
      // In a real application, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === "demo@aopia.fr" && password === "password") {
        setUser(currentUser);
        toast.success("Connexion réussie");
      } else {
        toast.error("Email ou mot de passe incorrect");
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Déconnexion réussie");
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
