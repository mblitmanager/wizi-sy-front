
import apiClient from '@/lib/api-client';
import type { QuizHistory, QuizStats } from '@/types/quiz';

export class QuizStatsService {
  async getQuizHistory(): Promise<QuizHistory[]> {
    try {
      const response = await apiClient.get('/quiz/history');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      return [];
    }
  }

  async getQuizStats(): Promise<QuizStats> {
    try {
      const response = await apiClient.get('/quiz/stats');
      return response.data.data || { 
        totalQuizzes: 0, 
        totalScore: 0, 
        averageScore: 0, 
        completedQuizzes: 0, 
        totalPoints: 0, 
        averageTimeSpent: 0 
      };
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      return { 
        totalQuizzes: 0, 
        totalScore: 0, 
        averageScore: 0, 
        completedQuizzes: 0, 
        totalPoints: 0, 
        averageTimeSpent: 0 
      };
    }
  }

  async getQuizStatistics(quizId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/quiz/${quizId}/statistics`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching quiz statistics:', error);
      return null;
    }
  }
}

export const quizStatsService = new QuizStatsService();
