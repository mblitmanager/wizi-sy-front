
import apiClient from '@/lib/api-client';
import type { QuizHistory, QuizStats } from '@/types/quiz';

export class RankingService {
  async updateClassement(quizId: string, stagiaireId: string, correctAnswers: number): Promise<any> {
    // Now we pass correctAnswers instead of score, to calculate points (2 per correct answer)
    const points = correctAnswers * 2;
    
    const response = await apiClient.post(`/api/quiz/${quizId}/classement`, {
      stagiaire_id: stagiaireId,
      points: points, // 2 points per correct answer
      correct_answers: correctAnswers
    });
    return response.data;
  }

  async getClassement(quizId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/quiz/${quizId}/classement`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz ranking:', error);
      throw new Error('Failed to fetch quiz ranking');
    }
  }

  async getGlobalClassement(): Promise<any> {
    const response = await apiClient.get('/quiz/classement/global');
    return response.data;
  }
}

export const rankingService = new RankingService();
