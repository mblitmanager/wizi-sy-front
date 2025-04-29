
import apiClient from '@/lib/api-client';
import type { QuizHistory, QuizStats } from '@/types/quiz';

export class QuizStatsService {
  async getQuizHistory(): Promise<QuizHistory[]> {
    try {
      const response = await apiClient.get('/quiz/history');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      throw new Error('Failed to fetch quiz history');
    }
  }

  async getQuizStats(): Promise<QuizStats> {
    try {
      const response = await apiClient.get('/quiz/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      throw new Error('Failed to fetch quiz stats');
    }
  }

  async getQuizStatistics(quizId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/quiz/${quizId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz statistics:', error);
      throw new Error('Failed to fetch quiz statistics');
    }
  }
}

export const quizStatsService = new QuizStatsService();
