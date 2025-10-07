import { CatalogueFormationResponse } from "@/types/stagiaire";
import axios, { AxiosRequestHeaders } from "axios";

const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// ✅ UNE seule instance axios configurée
export const api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Gestion centralisée du token
let tokenProvider: (() => string | null | undefined) | null = null;

export function setTokenProvider(provider: () => string | null | undefined) {
  tokenProvider = provider;
}

// ✅ UN SEUL intercepteur de requête
api.interceptors.request.use((config) => {
  try {
    const token = tokenProvider
      ? tokenProvider()
      : localStorage.getItem("token");
    if (token) {
      // ✅ Correction du typage
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Error reading auth token", err);
  }
  return config;
});

// ✅ UN SEUL intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Déclencher un événement global pour la déconnexion
      localStorage.removeItem("token");
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(error);
  }
);

// ✅ TOUTES les API utilisent la même instance
export const catalogueFormationApi = {
  getCatalogueFormation: async (
    stagiaireId: string
  ): Promise<CatalogueFormationResponse> => {
    const response = await api.get<CatalogueFormationResponse>(
      `/catalogueFormations/stagiaire/${stagiaireId}`
    );
    return response.data;
  },

  getFormationDetails: async (formationId: string): Promise<any> => {
    const response = await api.get(
      `/catalogueFormations/formations/${formationId}`
    );
    return response.data;
  },

  getFormationQuizzes: async (formationId: string): Promise<any[]> => {
    const response = await api.get(`/formations/${formationId}/quizzes`);
    return response.data;
  },

  getAllCatalogueFormation: async (): Promise<CatalogueFormationResponse> => {
    const response = await api.get<CatalogueFormationResponse>(
      `/catalogueFormations/with-formations`
    );
    return response.data;
  },
};

// Supprimez les autres instances axios dans votre projet
