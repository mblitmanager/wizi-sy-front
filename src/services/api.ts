/**
 * API métier transverses. Le client HTTP lui-même vit dans `@/lib/api`
 * et est ré-exporté ici pour les imports historiques.
 */
import { api } from "@/lib/api";

export { api, setTokenProvider } from "@/lib/api";

export const catalogueFormationApi = {
  getCatalogueFormation: async (stagiaireId: string) => {
    const response = await api.get(`/catalogueFormations/stagiaire/${stagiaireId}`);
    return response.data;
  },

  getFormationDetails: async (formationId: string) => {
    const response = await api.get(`/catalogueFormations/formations/${formationId}`);
    return response.data;
  },

  getFormationQuizzes: async (formationId: string) => {
    const response = await api.get(`/formations/${formationId}/quizzes`);
    return response.data;
  },

  getAllCatalogueFormation: async (page = 1, category = "Tous") => {
    const response = await api.get("/catalogueFormations/with-formations", {
      params: { page, category },
    });
    return response.data;
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

export const sponsorshipService = {
  getLink: () => api.get("/stagiaire/parrainage/link"),
  getReferrals: () => api.get("/stagiaire/parrainage/filleuls"),
  getStats: () => api.get("/stagiaire/parrainage/stats"),
};

export const notificationAPI = {
  getSettings: () => api.get("/notifications/settings"),
  updateSettings: (settings: Record<string, unknown>) => api.post("/notifications/settings", settings),
  registerDevice: (token: string) => api.post("/notifications/register-device", { token }),
  unregisterDevice: (token: string) =>
    api.delete("/notifications/unregister-device", { data: { token } }),
};

export const formationApi = {
  getFormations: () => api.get("formation/listFormation"),
};

export const dashboardApi = {
  getHomeData: () => api.get("/stagiaire/dashboard/home"),
};

export const questionApi = {
  getQuestionById: (id: string) => api.get(`questions/questionById/${id}`),
};

export default api;
