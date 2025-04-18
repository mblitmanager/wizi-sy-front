import axios from 'axios';
import { User, Quiz, Category, QuizResult, UserProgress, LeaderboardEntry, Question, Formation } from '../types';
import { Answer } from '../types/quiz';

const API_URL = process.env.VITE_API_URL || 'https://wizi-learn.com/public/api';

// Log the current API URL to help with debugging
console.log('Using API URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: process.env.NODE_ENV === 'production'
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    if (error.response?.status === 401) {
      console.log('Unauthorized access detected, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
  },
};

// Quiz services
export const quizService = {
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/quiz/categories');
    return response.data;
  },
  
  getQuizzesByCategory: async (categoryId: string): Promise<Quiz[]> => {
    const response = await api.get(`/formations/categories/${categoryId}`);
    return response.data;
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    const response = await api.get(`/quiz/${quizId}/questions`);
    return response.data;
  },

  getReponsesByQuestion: async (questionId: string): Promise<Answer[]> => {
    const response = await api.get(`/questions/${questionId}/reponses`);
    return response.data.map((answer: Answer) => ({
      ...answer,
      is_correct: answer.is_correct
    }));
  },

  submitQuiz: async (quizId: string, answers: Record<string, string>, score: number, timeSpent: number): Promise<QuizResult> => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers, score, timeSpent });
    return response.data;
  },
};

// Progress services
export const progressService = {
  getUserProgress: async (): Promise<UserProgress> => {
    const response = await api.get('/stagiaire/progress');
    return response.data;
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get('/stagiaire/ranking/global');
    return response.data;
  },
};

// Formation services
export const formationService = {
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/formation/categories');
    return response.data;
  },

  getFormationsByStagiaire: async (): Promise<{ data: Formation[] }> => {
    const meResponse = await api.get('/me');
    const meData = meResponse.data;
    const response = await api.get(`/stagiaire/${meData.stagiaire.id}/formations`);
    return response.data;
  },
  
  getFormationsByCategory: async (categoryId: string): Promise<Formation[]> => {
    const response = await api.get(`/formations/categories/${categoryId}`);
    return response.data;
  },
  
  getFormationById: async (formationId: string): Promise<Formation> => {
    const response = await api.get(`/formations/${formationId}`);
    return response.data;
  }
};

// User services
export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
};

// Training services
export const trainingService = {
  getTrainings: () => api.get('/trainings'),
  getTraining: (id: string) => api.get(`/trainings/${id}`),
  getFormationsByCategory: (categoryId: string) => api.get(`/formations/categories/${categoryId}`),
};

// Ranking services
export const rankingService = {
  getRankings: () => api.get('/stagiaire/ranking/global'),
  getTrainingRankings: (trainingId: string) => api.get(`/stagiaire/ranking/formation/${trainingId}`),
  getRewards: () => api.get('/stagiaire/rewards'),
};

// Media services
export const mediaService = {
  getMedia: () => api.get('/media'),
  getMediaItem: (id: string) => api.get(`/media/${id}`),
};

// Sponsorship services
export const sponsorshipService = {
  getLink: () => api.get('/stagiaire/parrainage/link'),
  getReferrals: () => api.get('/stagiaire/parrainage/filleuls'),
  getStats: () => api.get('/stagiaire/parrainage/stats'),
};

// Calendar services
export const calendarService = {
  getCalendar: () => api.get('/calendar'),
  getEvents: () => api.get('/calendar/events'),
};

// Contacts services
export const contactService = {
  getCommerciaux: async () => {
    const response = await api.get('/stagiaire/contacts/commerciaux');
    return response.data;
  },
  
  getFormateurs: async () => {
    const response = await api.get('/stagiaire/contacts/formateurs');
    return response.data;
  },
  
  getPoleRelation: async () => {
    const response = await api.get('/stagiaire/contacts/pole-relation');
    return response.data;
  },
  
  getContacts: async () => {
    const response = await api.get('/stagiaire/contacts');
    return response.data;
  }
};

// Stagiaire services
export const stagiaireService = {
  getFormations: () => api.get('/stagiaire/formations'),
  getFormationById: (formationId: string) => api.get(`/formations/${formationId}`),
  getProgressById: (formationId: string) => api.get(`/stagiaire/progress/${formationId}`),
};

// Export all services
export default api;
