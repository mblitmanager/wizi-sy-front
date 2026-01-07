import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Token provider for reading tokens
let tokenProvider: (() => string | null | undefined) | null = null;

export function setTokenProvider(provider: () => string | null | undefined) {
  tokenProvider = provider;
}

// Refresh token state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request interceptor - Add Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = tokenProvider
        ? tokenProvider()
        : localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Error reading auth token for API request interceptor", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token expiration and auto-refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ error?: string; message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if error is 401 and token expired
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === "token_expired" &&
      !originalRequest._retry
    ) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        // No refresh token available, logout user
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.dispatchEvent(new Event("auth:logout"));
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const response = await axios.post(`${VITE_API_URL}/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;

        // Save new access token
        localStorage.setItem("token", access_token);

        // Update authorization header for the failed request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Process all queued requests
        processQueue();

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.dispatchEvent(new Event("auth:logout"));
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

// Export services...
export const catalogueFormationApi = {
  getCatalogueFormation: async (stagiaireId: string) => {
    const response = await api.get(
      `/catalogueFormations/stagiaire/${stagiaireId}`
    );
    return response.data;
  },

  getFormationDetails: async (formationId: string) => {
    const response = await api.get(
      `/catalogueFormations/formations/${formationId}`
    );
    return response.data;
  },

  getFormationQuizzes: async (formationId: string) => {
    const response = await api.get(`/formations/${formationId}/quizzes`);
    return response.data;
  },

  getAllCatalogueFormation: async () => {
    const response = await api.get("/catalogueFormations/with-formations");
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

export const dashboardApi = {
  getHomeData: () => api.get("/stagiaire/dashboard/home"),
};

export const questionApi = {
  getQuestionById: (id: string) => api.get(`questions/questionById/${id}`),
};

export default api;
