import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { User } from "@/types";
import { api, AUTH_LOGOUT_EVENT, setTokenProvider } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { AppRole, getUserRole } from "@/utils/roles";

interface UserContextType {
  user: User | null;
  token: string | null;
  role: AppRole;
  /** Vrai uniquement pendant la résolution initiale de la session. */
  isLoading: boolean;
  error: string | null;
  /** Renvoie le token en cas de succès, `null` sinon (le message est dans `error`). */
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  refetchUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_CACHE_KEY = "user_cache";

const TOAST_STYLE = {
  style: { background: "#fb923c", color: "#fff" },
  className: "bg-orange-400 text-white",
};

function readCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: User | null) {
  try {
    if (user) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_CACHE_KEY);
  } catch {
    // Quota plein ou stockage désactivé : le cache est un simple bonus
  }
}

/** IP du client transmise au login. Plafonnée pour ne jamais retarder la connexion. */
async function getClientIp(timeoutMs = 1500): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
    const data = await response.json();
    return data.ip ?? "unknown";
  } catch {
    return "unknown";
  } finally {
    clearTimeout(timer);
  }
}

function errorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) return error.response?.data?.message || fallback;
  return error instanceof Error ? error.message : fallback;
}

export function UserProvider({ children }: { children: ReactNode }) {
  // Démarrage instantané : si un token et un profil sont en cache, on les utilise
  // tout de suite et /me revalide en arrière-plan.
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => (localStorage.getItem(TOKEN_KEY) ? readCachedUser() : null));
  const [isLoading, setIsLoading] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY) && !readCachedUser());
  const [error, setError] = useState<string | null>(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    writeCachedUser(null);
    queryClient.clear();
    setUser(null);
    setToken(null);
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get("/me");
      const userData: User = response.data?.data || response.data;
      setUser(userData);
      setToken(localStorage.getItem(TOKEN_KEY));
      writeCachedUser(userData);
      setError(null);
    } catch (err) {
      // Un 401 déclenche déjà AUTH_LOGOUT_EVENT via l'intercepteur.
      // Une erreur réseau ne doit pas déconnecter : on garde le profil en cache.
      if (isAxiosError(err) && err.response?.status === 401) clearSession();
    }
  }, [clearSession]);

  const refetchUser = useCallback(async () => {
    if (localStorage.getItem(TOKEN_KEY)) await fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      fetchUserData().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    window.addEventListener(AUTH_LOGOUT_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, clearSession);
  }, [fetchUserData, clearSession]);

  useEffect(() => {
    setTokenProvider(() => token ?? localStorage.getItem(TOKEN_KEY));
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const clientIp = await getClientIp();
      const response = await api.post(
        "/login",
        { email, password },
        { headers: { "X-Client-IP": clientIp } }
      );

      const result = response.data?.data || response.data;
      const newToken: string | undefined = result.token || result.access_token;
      const refreshToken: string | undefined = result.refresh_token || result.refreshToken;
      const userData: User | undefined = result.user || result.userData;

      if (!newToken) throw new Error("Réponse de connexion invalide");

      localStorage.setItem(TOKEN_KEY, newToken);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      writeCachedUser(userData ?? null);

      setUser(userData ?? null);
      setToken(newToken);
      toast.success("Connexion réussie", TOAST_STYLE);

      // Le login ne renvoie pas toujours le profil complet (stagiaire, avatar...)
      if (!userData) fetchUserData();
      return newToken;
    } catch (err) {
      const message = errorMessage(err, "Email ou mot de passe incorrect.");
      setError(message);
      return null;
    }
  }, [fetchUserData]);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch {
      // Le token est peut-être déjà invalide : on nettoie quand même côté client
    }

    try {
      localStorage.clear();
      sessionStorage.clear();
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    } catch (e) {
      console.warn("Nettoyage du stockage incomplet", e);
    }

    const domain = window.location.hostname;
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (!name) return;
      const expired = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = expired;
      document.cookie = `${expired}; domain=${domain}`;
      document.cookie = `${expired}; domain=.${domain}`;
    });

    clearSession();
    toast.success("Déconnexion réussie", TOAST_STYLE);

    // Rechargement complet pour repartir d'un état propre (service worker, sockets...)
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  }, [clearSession]);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...updatedUser } : null;
      writeCachedUser(next);
      return next;
    });
  }, []);

  const role = useMemo(() => getUserRole(user), [user]);

  const contextValue = useMemo(
    () => ({ user, token, role, isLoading, error, login, logout, updateUser, refetchUser }),
    [user, token, role, isLoading, error, login, logout, updateUser, refetchUser]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
