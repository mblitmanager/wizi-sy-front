import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { User } from "@/types";
import { toast } from "sonner";
import { startTransition } from "react";

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  refetchUser: () => Promise<void>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Constants
const API_URL = import.meta.env.VITE_API_URL || "http://wizi-learn.com/api";
const TOAST_STYLE = {
  style: { background: "#fb923c", color: "#fff" },
  className: "bg-orange-400 text-white",
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

// Helper functions
const getClientIp = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) throw new Error("Failed to fetch IP");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching client IP:", error);
    return "unknown";
  }
};

const handleApiError = (error: unknown, defaultMessage: string) => {
  const message = error instanceof Error ? error.message : defaultMessage;
  toast.error(message, TOAST_STYLE);
  return message;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced fetch wrapper with abort controller
  const apiFetch = useCallback(
    async (endpoint: string, options?: RequestInit) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Request failed");
        }
        return await response.json();
      } finally {
        clearTimeout(timeoutId);
      }
    },
    []
  );

  // Auth check with transition support
  const fetchUserData = useCallback(
    async (authToken: string) => {
      try {
        const userData = await apiFetch("/me", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        startTransition(() => {
          setUser(userData);
          setToken(authToken);
          setError(null);
        });
        return true;
      } catch (error) {
        startTransition(() => {
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
          setError(
            error instanceof Error ? error.message : "Authentication failed"
          );
        });
        return false;
      }
    },
    [apiFetch]
  );

  const refetchUser = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      await fetchUserData(storedToken);
    }
  }, [fetchUserData]);

  // Initial auth check with cleanup
  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && mounted) {
        await fetchUserData(storedToken);
      }
      if (mounted) setIsLoading(false);
    };

    initializeAuth();
    return () => {
      mounted = false;
    };
  }, [fetchUserData]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentToken = token || localStorage.getItem("token");
      if (!currentToken) throw new Error("No token found");

      await apiFetch("/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      });

      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
      toast.success("Déconnexion réussie", TOAST_STYLE);
    } catch (error) {
      handleApiError(error, "Erreur lors de la déconnexion");
    } finally {
      setIsLoading(false);
    }
  }, [token, apiFetch]);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
  }, []);

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user || !token) return;

      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        toast.error(
          "Type de fichier invalide. Veuillez choisir un JPEG, PNG ou GIF.",
          TOAST_STYLE
        );
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          "Fichier trop volumineux. Taille maximale : 5MB.",
          TOAST_STYLE
        );
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      try {
        await apiFetch(`/avatar/${user.id}/update-profile`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        toast.success("Image mise à jour avec succès", TOAST_STYLE);
        await refetchUser();
      } catch (error) {
        handleApiError(error, "Erreur lors de la mise à jour de l'image");
      } finally {
        setIsLoading(false);
      }
    },
    [user, token, apiFetch, refetchUser]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const clientIp = await getClientIp();
        const data = await apiFetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-IP": clientIp,
          },
          body: JSON.stringify({ email, password }),
        });

        startTransition(() => {
          localStorage.setItem("token", data.token);
          setUser(data.user);
          setToken(data.token);
          setError(null);
        });
        toast.success("Connexion réussie", TOAST_STYLE);
      } catch (error) {
        const message = handleApiError(error, "Erreur lors de la connexion");
        startTransition(() => setError(message));
      } finally {
        startTransition(() => setIsLoading(false));
      }
    },
    [apiFetch]
  );

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      user,
      token,
      isLoading,
      error,
      login,
      logout,
      updateUser,
      refetchUser,
      handleImageChange,
    }),
    [
      user,
      token,
      isLoading,
      error,
      login,
      logout,
      updateUser,
      refetchUser,
      handleImageChange,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
