import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

/**
 * Client HTTP unique de l'application.
 * Toutes les requêtes vers l'API doivent passer par `api` : le token est injecté
 * automatiquement, rafraîchi quand il expire, et un 401 déconnecte proprement.
 */

export const API_URL: string = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

/** Base des fichiers publics (avatars, médias...) servis par le backend. */
export const MEDIA_URL: string =
  import.meta.env.VITE_API_URL_MEDIA || API_URL.replace(/\/api\/?$/, "");

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";

/** Événement global écouté par le UserContext pour vider la session. */
export const AUTH_LOGOUT_EVENT = "auth:logout";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let tokenProvider: () => string | null | undefined = () => localStorage.getItem(TOKEN_KEY);

export function setTokenProvider(provider: () => string | null | undefined) {
  tokenProvider = provider;
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
}

api.interceptors.request.use((config) => {
  const token = tokenProvider();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Laisser le navigateur poser le boundary multipart
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }
  return config;
});

// --- Rafraîchissement du token ------------------------------------------------

let refreshPromise: Promise<string> | null = null;

/** Un seul appel /refresh à la fois : les requêtes concurrentes attendent le même résultat. */
function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    refreshPromise = (
      refreshToken
        ? axios
            .post(`${API_URL}/refresh`, { refresh_token: refreshToken })
            .then((res) => {
              const accessToken: string = res.data?.access_token ?? res.data?.data?.access_token;
              if (!accessToken) throw new Error("Refresh sans access_token");
              localStorage.setItem(TOKEN_KEY, accessToken);
              return accessToken;
            })
        : Promise.reject(new Error("Aucun refresh token"))
    ).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

const isAuthEndpoint = (url = "") => /\/(login|refresh|logout)\b/.test(url);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ error?: string; message?: string }>) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status !== 401 || !original || isAuthEndpoint(original.url)) {
      return Promise.reject(error);
    }

    if (error.response.data?.error === "token_expired" && !original._retry) {
      original._retry = true;
      try {
        const newToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        clearStoredSession();
        return Promise.reject(error);
      }
    }

    // Token invalide ou révoqué : on ne déconnecte que si une session existait
    if (original.headers.Authorization) {
      clearStoredSession();
    }
    return Promise.reject(error);
  }
);

/** Extrait un tableau d'une réponse Laravel, qu'elle soit `[...]`, `{ data: [...] }` ou `{ member: [...] }`. */
export function unwrapList<T = unknown>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["data", "member", "items"]) {
      const value = record[key];
      if (Array.isArray(value)) return value as T[];
      if (value && typeof value === "object" && Array.isArray((value as Record<string, unknown>).data)) {
        return (value as Record<string, unknown>).data as T[];
      }
    }
  }
  return [];
}

/** Extrait l'objet utile d'une réponse `{ data: {...} }` ou `{...}`. */
export function unwrapData<T = unknown>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export default api;
