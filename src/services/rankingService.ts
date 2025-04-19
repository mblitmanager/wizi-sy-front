import { api } from './api';

export const rankingService = {
  getRankings: () => api.get("/stagiaire/ranking/global"),
  getTrainingRankings: (trainingId: string) => api.get(`/stagiaire/ranking/formation/${trainingId}`),
  getRewards: () => api.get("/stagiaire/rewards"),
}; 