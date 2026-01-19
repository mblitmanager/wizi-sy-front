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
import api, { setTokenProvider } from "@/services/api";

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  refetchUser: () => Promise<void>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Constants
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
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
  const fetchUserData = useCallback(async (authToken: string) => {
    try {
      const response = await api.get("/me");
      const userData = response.data.data || response.data;

      startTransition(() => {
        setUser(userData);
        setToken(authToken);
        setError(null);
      });
      return true;
    } catch (error) {
      // L'intercepteur gère déjà la suppression du token
      startTransition(() => {
        setUser(null);
        setToken(null);
        setError("Authentication failed");
      });
      return false;
    }
  }, []);

  const refetchUser = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      await fetchUserData(storedToken);
    }
  }, [fetchUserData]);

  // Initial auth check - RUNS ONCE
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
    
    // Listen for global auth:logout events
    const onAuthLogout = () => {
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    };
    window.addEventListener("auth:logout", onAuthLogout as EventListener);
    
    return () => {
      mounted = false;
      window.removeEventListener("auth:logout", onAuthLogout as EventListener);
    };
  }, [fetchUserData]); // Removed 'token' dependency

  // Sync token provider with state changes
  useEffect(() => {
    setTokenProvider(() => token ?? localStorage.getItem("token"));
    return () => {
       // Reset to localStorage only on unmount/change? 
       // Actually setTokenProvider just sets a callback. It's fine to update it.
       setTokenProvider(() => localStorage.getItem("token"));
    };
  }, [token]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentToken = token || localStorage.getItem("token");

      if (currentToken) {
        try {
          await apiFetch("/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.warn("Logout API call failed");
        }
      }

      // 🔥 NETTOYAGE RADICAL - Efface tout le stockage local et session
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log("Storage cleared successfully");
      } catch (e) {
        console.warn("Failed to clear storage completely", e);
      }

      // 🔥 NETTOYAGE DU CACHE NAVIGATEUR (Service Worker / Assets)
      try {
        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
          console.log("All caches cleared successfully");
        }
      } catch (e) {
        console.warn("Failed to clear browser cache", e);
      }

      // 🔥 Nettoie les cookies de votre domaine
      const domain = window.location.hostname;
      const cookies = document.cookie.split(";");

      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        // Supprime le cookie avec différents chemins et domaines
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`;
      });

      setUser(null);
      setToken(null);

      window.dispatchEvent(new Event("auth:logout"));
      toast.success("Déconnexion réussie", TOAST_STYLE);

      // Forcer le rechargement pour tout remettre à zéro
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
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

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const clientIp = await getClientIp();

      // ✅ Utiliser l'instance api
      const response = await api.post(
        "/login",
        {
          email,
          password,
        },
        {
          headers: {
            "X-Client-IP": clientIp,
          },
        }
      );

      // Update for the new { data: { ... } } wrapper from Node.js
      console.log("Login Response Data:", response.data);
      const loginResult = response.data.data || response.data;
      
      const newToken = loginResult.token || loginResult.access_token;
      const refreshToken = loginResult.refresh_token || loginResult.refreshToken;
      const userData = loginResult.user || loginResult.userData;

      console.log("Extracted Token:", newToken ? "PRÉSENT" : "ABSENT");

      // Store tokens IMMEDIATELY (outside startTransition) to prevent race conditions
      if (newToken) {
        localStorage.setItem("token", newToken);
        console.log("Token stored in localStorage");
      }
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      startTransition(() => {
        setUser(userData);
        setToken(newToken);
        setError(null);
      });

      toast.success("Connexion réussie", TOAST_STYLE);
      return newToken;
    } catch (error) {
      const message = handleApiError(error, "Erreur lors de la connexion");
      startTransition(() => setError(message));
      return null;
    } finally {
      startTransition(() => setIsLoading(false));
    }
  }, []);

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
