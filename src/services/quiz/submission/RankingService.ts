
import apiClient from '@/lib/api-client';

export class RankingService {
  async updateClassement(quizId: string, stagiaireId: string, score: number): Promise<any> {
    const response = await apiClient.post(`/api/quiz/${quizId}/classement`, {
      stagiaire_id: stagiaireId,
      score: score
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
