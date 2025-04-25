import axios from "axios";

const API_URL = process.env.VITE_API_URL || "http://localhost:8000/api";

// Log the current API URL to help with debugging
console.log("Using API URL:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Additional handling for 401 errors
    if (error.response?.status === 401) {
      console.log("Unauthorized access detected, redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/login", credentials),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (data: { token: string; password: string }) =>
    api.post("/auth/reset-password", data),
};

// User services
export const userService = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data: { name: string; email: string; password?: string }) =>
    api.put("/user/profile", data),
};

// Quiz services
export const quizService = {
  getQuizzes: () => api.get("/quizzes"),
  getQuiz: (id: string) => api.get(`/quizzes/${id}`),
  getQuestions: (id: string) => api.get(`/quiz/${id}/questions`),
  getCategories: () => api.get("/quiz/categories"),
  playQuiz: (id: string) => api.post(`/quizzes/${id}/play`),
  submitQuiz: (
    id: string,
    answers: Record<string, string>,
    score: number,
    timeSpent: number
  ) => api.post(`/quizzes/${id}/submit`, { answers, score, timeSpent }),
  getReponsesByQuestion: (questionId: string) =>
    api.get(`/questions/${questionId}/reponses`),
};

// Training services
export const trainingService = {
  getTrainings: () => api.get("/trainings"),
  getTraining: (id: string) => api.get(`/trainings/${id}`),
  getFormationsByCategory: (categoryId: string) =>
    api.get(`/formations/categories/${categoryId}`),
};

// Ranking services
export const rankingService = {
  getRankings: () => api.get("/stagiaire/ranking/global"),
  getTrainingRankings: (trainingId: string) =>
    api.get(`/stagiaire/ranking/formation/${trainingId}`),
  getRewards: () => api.get("/stagiaire/rewards"),
};

// Media services
export const mediaService = {
  getMedia: () => api.get("/media"),
  getMediaItem: (id: string) => api.get(`/media/${id}`),
};

// Sponsorship services
export const sponsorshipService = {
  getLink: () => api.get("/stagiaire/parrainage/link"),
  getReferrals: () => api.get("/stagiaire/parrainage/filleuls"),
  getStats: () => api.get("/stagiaire/parrainage/stats"),
};

// Calendar services
export const calendarService = {
  getCalendar: () => api.get("/calendar"),
  getEvents: () => api.get("/calendar/events"),
};

// Contacts services
export const contactService = {
  getCommerciaux: async () => {
    const response = await api.get("/stagiaire/contacts/commerciaux");
    return response.data;
  },

  getFormateurs: async () => {
    const response = await api.get("/stagiaire/contacts/formateurs");
    return response.data;
  },

  getPoleRelation: async () => {
    const response = await api.get("/stagiaire/contacts/pole-relation");
    return response.data;
  },

  getContacts: async () => {
    const response = await api.get("/stagiaire/contacts");
    return response.data;
  },
};

// Stagiaire API
export const stagiaireAPI = {
  getFormations: () => api.get("/stagiaire/formations"),
  getFormationById: (formationId: string) =>
    api.get(`/formations/${formationId}`),
  getProgressById: (formationId: string) =>
    api.get(`/stagiaire/progress/${formationId}`),
  getCatalogueFormations: (stagiaireId: number) =>
    api.get(`/catalogueFormations/stagiaire/${stagiaireId}`),
};

export const catalogueFormationApi = {
  getCatalogueFormationById: (catFormationId: number) =>
    api.get(`/catalogueFormations/formations/${catFormationId}`),

  getFormationByStagiaireId: (stagiaireId: number) =>
    api.get(`stagiaire/${stagiaireId}/formations`),

  getAllCatalogueFormation: (page = 1) => {
    return api.get(`catalogueFormations/formations?page=${page}`);
  },
};

export const formationApi = {
  getFormations: () => api.get("formation/listFormation"),
};
// Export all services
export default api;
