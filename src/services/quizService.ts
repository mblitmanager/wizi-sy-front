import { api } from './api';

export interface QuizData {
  questions: Question[];
  duration: number;
  level: string;
  mode: string;
  category?: string;
}

export interface Question {
  id: number;
  text: string;
  image?: string;
  type: 'single' | 'multiple';
  answers: Answer[];
  category: string;
  difficulty: number;
}

export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizResult {
  score: number;
  maxStreak: number;
  level: string;
  mode: string;
  category?: string;
  questionsAnswered: number;
  timeSpent: number;
}

export const quizService = {
  async getQuiz(
    level: string, 
    questionCount: number,
    category?: string
  ): Promise<QuizData> {
    const response = await api.get(`/api/quizzes/random`, {
      params: {
        level,
        count: questionCount,
        category
      }
    });
    return response.data;
  },

  async submitQuiz(quizId: string, answers: number[]): Promise<{ score: number }> {
    const response = await api.post(`/api/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },

  async saveQuizResult(result: QuizResult): Promise<void> {
    await api.post('/api/quizzes/results', result);
  },

  async getQuizHistory(): Promise<QuizData[]> {
    const response = await api.get('/api/quizzes/history');
    return response.data;
  },

  async getQuizRanking(): Promise<{ userId: string; score: number; rank: number }[]> {
    const response = await api.get('/api/quizzes/ranking');
    return response.data;
  },

  async getQuizCategories(): Promise<string[]> {
    const response = await api.get('/api/quizzes/categories');
    return response.data;
  },

  async getQuizByCategory(category: string): Promise<QuizData[]> {
    const response = await api.get(`/api/quizzes/category/${category}`);
    return response.data;
  },

  async getQuizStats(): Promise<{
    totalQuizzes: number;
    averageScore: number;
    bestStreak: number;
    categories: Record<string, number>;
  }> {
    const response = await api.get('/api/quizzes/stats');
    return response.data;
  },

  async getQuizRecommendations(): Promise<QuizData[]> {
    const response = await api.get('/api/quizzes/recommendations');
    return response.data;
  },

  async getQuizChallenges(): Promise<{
    daily: QuizData;
    weekly: QuizData;
    monthly: QuizData;
  }> {
    const response = await api.get('/api/quizzes/challenges');
    return response.data;
  }
}; 