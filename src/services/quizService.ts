import { api } from './api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

export interface Question {
  id: string;
  title: string;
  content: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  responses: Response[];
}

export interface Response {
  id: string;
  content: string;
  isCorrect: boolean;
  questionId: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  quizzes: Quiz[];
}

export const QuizService = {
  getQuizCategories: async (): Promise<QuizCategory[]> => {
    try {
      const response = await api.get<ApiResponse<QuizCategory[]>>('/quiz/categories');
      const formations = response.data?.data || [];
      return Array.isArray(formations) ? formations.map((formation) => ({
        id: formation.id,
        name: formation.name,
        description: formation.description,
        icon: formation.icon,
        quizzes: formation.quizzes || []
      })) : [];
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

  submitQuiz: async (quizId: string, answers: Record<string, string>): Promise<any> => {
    try {
      const response = await api.post<ApiResponse<any>>(`/quiz/${quizId}/submit`, { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }
};

// Export nommé pour maintenir la compatibilité avec les imports existants
export const quizService = QuizService; 
