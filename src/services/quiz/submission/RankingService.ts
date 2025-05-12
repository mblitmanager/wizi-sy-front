
import apiClient from '@/lib/api-client';
import type { QuizHistory, QuizStats } from '@/types/quiz';

export class RankingService {
  async updateClassement(quizId: string, stagiaireId: string, correctAnswers: number): Promise<any> {
    // Award 2 points per correct answer
    const points = correctAnswers * 2;
    
    const response = await apiClient.post(`/api/quiz/${quizId}/classement`, {
      stagiaire_id: stagiaireId,
      points: points,
      correct_answers: correctAnswers
    });
    return response.data;
  }

  async getClassement(quizId: string): Promise<any> {
    try {
      // Fixed the API endpoint path
      const response = await apiClient.get(`/api/quiz/${quizId}/classement`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz ranking:', error);
      throw new Error('Failed to fetch quiz ranking');
    }
  }

  async getGlobalClassement(): Promise<any> {
    const response = await apiClient.get('/api/quiz/classement/global');
    return response.data;
  }
}

export const rankingService = new RankingService();
