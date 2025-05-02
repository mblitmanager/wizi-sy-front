
import { api } from './api';

// Define interfaces directly in the service file if they don't exist in types
interface UserProgress {
  completedQuizzes: number;
  totalQuizzes: number;
  completionRate: number;
  averageScore: number;
  totalScore: number;
}

interface LeaderboardEntry {
  id: number;
  stagiaire_id: number;
  stagiaire_name: string;
  score: number;
  position: number;
  image_url?: string;
}

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
