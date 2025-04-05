import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/axios';

export function useQuizStats(userId: string) {
  return useQuery({
    queryKey: ['quizStats', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/stats/quiz/${userId}`);
      return data;
    }
  });
}

export function useComparisonStats(userId: string) {
  return useQuery({
    queryKey: ['comparisonStats', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/stats/compare/${userId}`);
      return data;
    }
  });
}

export function useGlobalStats() {
  return useQuery({
    queryKey: ['globalStats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/stats/global');
      return data;
    }
  });
}