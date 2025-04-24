import axios from 'axios';
import { Quiz, Category, Question, QuizResult } from '@/types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Créer une instance d'axios avec les configurations par défaut
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const quizApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/quiz/categories');
    return response.data;
  },

  getQuizzesByCategory: async (category: string): Promise<Quiz[]> => {
    const response = await api.get<Quiz[]>(`/quiz/category/${category}`);
    return response.data;
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await api.get<Quiz>(`/quiz/${id}`);
    return response.data;
  },

  submitQuizResult: async (quizId: string, result: {
    answers: Record<string, string[]>;
    timeSpent: number;
  }): Promise<QuizResult> => {
    console.log('API Request:', {
      url: `/quiz/${quizId}/result`,
      method: 'POST',
      data: result
    });
    
    const response = await api.post<QuizResult>(`/quiz/${quizId}/result`, result);
    return response.data;
  }
}; 