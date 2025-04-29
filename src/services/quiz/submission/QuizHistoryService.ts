
import apiClient from '@/lib/api-client';
import type { QuizHistory, QuizStats, QuizResult } from '@/types/quiz';

export class QuizHistoryService {
  async getQuizHistory(): Promise<QuizHistory[]> {
    try {
      const response = await apiClient.get('/quiz/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      throw new Error('Failed to fetch quiz history');
    }
  }

  async getQuizStats(): Promise<QuizStats> {
    try {
      const response = await apiClient.get('/quiz/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      throw new Error('Failed to fetch quiz stats');
    }
  }
  
  async getQuizResult(quizId: string): Promise<QuizResult> {
    const response = await apiClient.get(`/quiz/${quizId}/result`);
    return response.data;
  }
}

export const quizHistoryService = new QuizHistoryService();
