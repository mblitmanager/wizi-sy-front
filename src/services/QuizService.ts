import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
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
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion si non authentifié
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  quizCount: number;
  colorClass: string;
}

export interface Quiz {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  categorieId: string;
  niveau: string;
  questions: Question[];
  points: number;
}

export interface Question {
  id: string;
  text: string;
  type: string;
  answers?: Answer[];
  blanks?: Blank[];
  wordbank?: WordBankItem[];
  flashcard?: Flashcard;
  matching?: MatchingItem[];
  audioUrl?: string;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Blank {
  id: string;
  text: string;
  bankGroup: string;
}

export interface WordBankItem {
  id: string;
  text: string;
  isCorrect: boolean;
  bankGroup: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface MatchingItem {
  id: string;
  text: string;
  matchPair: string;
}

export interface QuizSubmission {
  quizId: number;
  answers: {
    questionId: number;
    answer: string;
  }[];
}

export interface QuizHistory {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface QuizStats {
  total_quizzes: number;
  completed_quizzes: number;
  average_score: number;
  total_points: number;
  points_earned: number;
}

class QuizService {
  async getCategories() {
    try {
      const response = await api.get('/quiz/categories');
      return (response.data || []) as Category[];
    } catch (error) {
      console.error('Error fetching quiz categories:', error);
      return [] as Category[];
    }
  }

  async getQuizzesByCategory(categoryId: string) {
    try {
      const response = await api.get(`/quiz/category/${categoryId}`);
      return (response.data || []) as Quiz[];
    } catch (error) {
      console.error('Error fetching quizzes by category:', error);
      return [] as Quiz[];
    }
  }

  async getQuizHistory() {
    try {
      const response = await api.get('/quiz/history');
      return response.data.data as QuizHistory[];
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      throw new Error('Failed to fetch quiz history');
    }
  }

  async getQuizStats() {
    try {
      const response = await api.get('/quiz/stats');
      return response.data.data as QuizStats;
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      throw new Error('Failed to fetch quiz stats');
    }
  }

  async getQuizById(quizId: string) {
    try {
      const response = await api.get(`/quiz/${quizId}`);
      const quizData = response.data;
      return {
        id: quizData.id,
        titre: quizData.titre,
        description: quizData.description,
        categorie: quizData.categorie,
        categorieId: quizData.categorieId,
        niveau: quizData.niveau,
        questions: quizData.questions || [],
        points: quizData.points || 0
      } as Quiz;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  async getQuizQuestions(quizId: number) {
    try {
      const response = await api.get(`/quiz/${quizId}/questions`);
      return response.data.data as Question[];
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw new Error('Failed to fetch quiz questions');
    }
  }

  async submitQuiz(quizId: string, answers: Record<string, string[]>, timeSpent: number) {
    try {
      const response = await api.post(`/quiz/${quizId}/submit`, {
        answers,
        timeSpent
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  async submitQuizResult(quizId: number, result: any) {
    try {
      const response = await api.post(`/quiz/${quizId}/result`, result);
      return response.data.data;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      throw new Error('Failed to submit quiz result');
    }
  }

  async getStagiaireQuizzes() {
    try {
      const response = await api.get('/stagiaire/quizzes');
      return (response.data.data || []) as Quiz[];
    } catch (error) {
      console.error('Error fetching stagiaire quizzes:', error);
      return [] as Quiz[];
    }
  }
}

export const quizService = new QuizService(); 