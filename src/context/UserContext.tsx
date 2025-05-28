import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  refetchUser: () => Promise<void>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const getClientIp = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'IP:", error);
    return "unknown";
  }
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: ReactNode }) {
  const VITE_API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetchUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const response = await fetch("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token invalide ou expiré
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Error refetching user:", error);
    }
  };

  // Vérifier le token au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          // Vérifier si le token est valide
          const response = await fetch(`${VITE_API_URL}/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token invalide ou expiré
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem("token");
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
      const clientIp = await getClientIp();
      const response = await fetch(`${VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-IP": clientIp,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Ensure the data structure matches what your app expects
      localStorage.setItem("token", data.token);
      setUser(data.user); // Set only the user object
      setToken(data.token);
      toast.success("Connexion réussie");
    } catch (error) {
      toast.error(error.message || "Erreur lors de la connexion");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${VITE_API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Erreur lors de la déconnexion");
    } finally {
      setIsLoading(false);
    }
  };
  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && user) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error(
          "Type de fichier invalide. Veuillez choisir un JPEG, PNG ou GIF."
        );
        return;
      }

      if (file.size > maxSize) {
        toast.error("Fichier trop volumineux. Taille maximale : 5MB.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8000/api/avatar/${user.id}/update-profile`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          toast.success("Image mise à jour avec succès");
          await refetchUser();
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.message || "Erreur lors de la mise à jour de l'image"
          );
        }
      } catch (error) {
        toast.error("Erreur inattendue");
        console.error("Image upload error:", error);
      } finally {
        setIsLoading(false);
      }
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
        refetchUser,
        handleImageChange,
      }}>
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
