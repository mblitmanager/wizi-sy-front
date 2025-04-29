import { api } from './api';
import { UserProgress, LeaderboardEntry } from '@/types/quiz';

export const progressService = {
  getUserProgress: async (): Promise<UserProgress> => {
    const response = await api.get<UserProgress>('/stagiaire/progress');
    return response.data;
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get<LeaderboardEntry[]>('/quiz/classement/global');
    return response.data;
  },
}; 