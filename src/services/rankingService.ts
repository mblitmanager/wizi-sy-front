
import { api } from './api';
import { UserProgress } from '@/types/quiz';

export interface RankingEntry {
  id: number;
  stagiaire_id?: number;
  stagiaire_name?: string;
  name?: string;
  score?: number;
  points?: number;
  position?: number;
  image_url?: string;
}

export interface UserRankingStats {
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
  highestScore: number;
  completionRate: number;
  rank: number;
}

export const rankingService = {
  getGlobalRanking: async (): Promise<RankingEntry[]> => {
    const response = await api.get<RankingEntry[]>('/quiz/classement/global');
    return response.data;
  },

  getQuizRanking: async (quizId: string): Promise<RankingEntry[]> => {
    const response = await api.get<RankingEntry[]>(`/quiz/${quizId}/classement`);
    return response.data;
  },

  getUserRankingStats: async (): Promise<UserRankingStats> => {
    const response = await api.get<UserRankingStats>('/quiz/classement/user-stats');
    return response.data;
  },
  
  getUserProgress: async (): Promise<UserProgress> => {
    const response = await api.get<UserProgress>('/stagiaire/progress');
    return response.data;
  },
  
  getRewards: async (): Promise<any> => {
    const response = await api.get('/stagiaire/rewards');
    return response.data;
  }
}; 
