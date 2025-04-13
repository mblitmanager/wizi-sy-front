import axios from 'axios';
import { User, Quiz, Category, QuizResult, UserProgress, LeaderboardEntry, Question, Answer } from '../types';
import { decodeToken } from '@/utils/tokenUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    const { token, user } = response.data;
    
    if (!token || !user) {
      throw new Error('Token ou utilisateur non reçu');
    }

    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return user;
  },

  register: async (username: string, email: string, password: string): Promise<User> => {
    const response = await api.post<{ token: string; user: User }>('/register', {
      username,
      email,
      password,
    });
    const { token, user } = response.data;
    
    if (!token || !user) {
      throw new Error('Token ou utilisateur non reçu');
    }

    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return user;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  refreshToken: async (): Promise<string> => {
    const response = await api.post<{ token: string }>('/refresh-token');
    const { token } = response.data;
    
    if (!token) {
      throw new Error('Token non reçu');
    }

    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return token;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: User; stagiaire?: any }>('/me');
    if (!response.data.user) {
      throw new Error('Utilisateur non trouvé');
    }
    return response.data.user;
  },
};

// Quiz API
export const quizAPI = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/formation/categories');
    return response.data;
  },
  
  getQuizzesByCategory: async (categoryId: string): Promise<Quiz[]> => {
    const response = await api.get<Quiz[]>(`/formations/categories/${categoryId}`);
    return response.data;
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    const response = await api.get<Quiz>(`/quizzes/${quizId}`);
    return response.data;
  },

  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    const response = await api.get<Question[]>(`/quizzes/${quizId}/questions`);
    return response.data;
  },

  getQuestionById: async (questionId: string): Promise<Question> => {
    const response = await api.get<Question>(`/questions/${questionId}`);
    return response.data;
  },

  getResponsesByQuestion: async (questionId: string): Promise<Answer[]> => {
    const response = await api.get<Answer[]>(`/questions/${questionId}/reponses`);
    return response.data;
  },

  submitQuizResult: async (result: Omit<QuizResult, 'id' | 'completedAt'>): Promise<QuizResult> => {
    const response = await api.post<QuizResult>(`/quizzes/${result.quizId}/submit`, result);
    return response.data;
  },
};

// User progress API
export const progressAPI = {
  getUserProgress: async (userId: string): Promise<UserProgress> => {
    const response = await api.get<UserProgress>(`/stagiaire/formations`);
    return response.data;
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get<LeaderboardEntry[]>('/stagiaire/ranking/global');
    return response.data;
  },

  getUserStats: async (userId: string): Promise<any> => {
    const response = await api.get<any>(`/stagiaire/progress`);
    return response.data;
  },
};

// Export mockAPI for fallback or development purposes
export { mockAPI } from './mockAPI';
