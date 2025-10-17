import { CatalogueFormationResponse } from "@/types/stagiaire";
import axios from "axios";

const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Optional token provider: a function returning the current auth token (string | null).
// If not set, we fall back to reading from localStorage to preserve existing behaviour.
let tokenProvider: (() => string | null | undefined) | null = null;

export function setTokenProvider(provider: () => string | null | undefined) {
  tokenProvider = provider;
}

api.interceptors.request.use((config) => {
  try {
    const token = tokenProvider
      ? tokenProvider()
      : localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  } catch (err) {
    // If reading token fails, omit Authorization header (safe fallback)
    console.warn("Error reading auth token for API request interceptor", err);
  }
  return config;
});

// Export specific API services for components that import them
export const catalogueFormationApi = {
  getCatalogueFormation: async (
    stagiaireId: string
  ): Promise<CatalogueFormationResponse> => {
    try {
      // Use the configured api instance instead of axios directly
      const response = await api.get<CatalogueFormationResponse>(
        `/catalogueFormations/stagiaire/${stagiaireId}`
        // Remove the manual headers - the interceptor will handle it
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du catalogue:", error);
      throw error;
    }
  },

  getFormationDetails: async (formationId: string): Promise<any> => {
    try {
      const response = await axios.get(
        `${VITE_API_URL}/catalogueFormations/formations/${formationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de la formation:",
        error
      );
      throw error;
    }
  },

  getFormationQuizzes: async (formationId: string): Promise<any[]> => {
    try {
      const response = await axios.get(
        `${VITE_API_URL}/formations/${formationId}/quizzes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des quiz de la formation:",
        error
      );
      throw error;
    }
  },

  getAllCatalogueFormation: async (): Promise<CatalogueFormationResponse> => {
    try {
      // Vérifier si un token existe
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await axios.get<CatalogueFormationResponse>(
        `${VITE_API_URL}/catalogueFormations/with-formations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du catalogue complet:",
        error
      );

      // Relancer l'erreur pour que React Query puisse la gérer
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Optionnel: nettoyer le token invalide
        localStorage.removeItem("token");
      }
      throw error;
    }
  },
};

export const progressAPI = {
  getUserProgress: () => api.get("/stagiaire/progress"),
};

export const stagiaireAPI = {
  getStagiaireData: () => api.get("/stagiaire"),
};

export const rankingService = {
  getGlobalRanking: () => api.get("/quiz/classement/global"),
  getQuizRanking: (quizId: string) => api.get(`/quiz/${quizId}/classement`),
  getUserRankingStats: () => api.get("/stagiaire/ranking-stats"),
};

// Sponsorship service
export const sponsorshipService = {
  getLink: () => api.get("/stagiaire/parrainage/link"),
  getReferrals: () => api.get("/stagiaire/parrainage/filleuls"),
  getStats: () => api.get("/stagiaire/parrainage/stats"),
};

// Notification service API endpoints
export const notificationAPI = {
  getSettings: () => api.get("/notifications/settings"),
  updateSettings: (settings: any) =>
    api.post("/notifications/settings", settings),
  registerDevice: (token: string) =>
    api.post("/notifications/register-device", { token }),
  unregisterDevice: (token: string) =>
    api.delete("/notifications/unregister-device", { data: { token } }),
};

export const formationApi = {
  getFormations: () => api.get("formation/listFormation"),
};

export const questionApi = {
  getQuestionById: (id: string) => api.get(`questions/questionById/${id}`),
};

export default api;
