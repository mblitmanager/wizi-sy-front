import { api } from '@/services/api';
import { Quiz, Question, QuizResult } from '@/types/quiz';

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export const QuizService = {
  getQuizCategories: async (): Promise<Quiz[]> => {
    try {
      const response = await api.get<ApiResponse<Quiz[]>>('/quiz/categories');
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching quiz categories:', error);
      return [];
    }
  },

  getQuizById: async (id: string): Promise<Quiz | null> => {
    try {
      const response = await api.get<ApiResponse<Quiz>>(`/quiz/${id}`);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return null;
    }
  },

  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    try {
      const response = await api.get<ApiResponse<Question[]>>(`/quiz/${quizId}/questions`);
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  },

  getQuiz: async (level: string, count: number, category: string): Promise<Quiz | null> => {
    try {
      const response = await api.get<ApiResponse<Quiz>>(`/quiz/random`, {
        params: { level, count, category }
      });
      return response.data?.data || null;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return null;
    }
  },

  submitQuiz: async (quizId: string, answers: Record<string, string>): Promise<QuizResult | null> => {
    try {
      const response = await api.post<ApiResponse<QuizResult>>(`/quiz/${quizId}/submit`, { answers });
      return response.data?.data || null;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      return null;
    }
  }
};

// Export nommé pour maintenir la compatibilité avec les imports existants
export const quizService = QuizService; 
