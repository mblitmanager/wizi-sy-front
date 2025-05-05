
import { api } from './api';
import { UserProgress } from '@/types/quiz';

export interface RankingEntry {
  id?: number;
  prenom: string;
  points: number;
  completed_quizzes: number;
  average_score: number;
}

export interface ProgressData {
    total: {
        points: number;
        completed_quizzes: number;
        average_score: number;
    };
    by_category: {
        [key: string]: {
            completed: number;
            total: number;
            average_score: number;
        };
    };
}

export const rankingService = {
    // Classement global
    async getGlobalRanking(): Promise<RankingEntry[]> {
        try {
            const response = await api.get('/quiz/classement/global');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching global ranking:', error);
            return [];
        }
    },

    // Classement par formation
    async getFormationRanking(formationId: number): Promise<RankingEntry[]> {
        try {
            const response = await api.get(`/stagiaire/ranking/formation/${formationId}`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching formation ranking:', error);
            return [];
        }
    },

    // Progression de l'utilisateur
    async getUserProgress(): Promise<ProgressData> {
        try {
            const response = await api.get('/stagiaire/progress');
            
            // Map the response to our expected format
            const data = response.data.progress || {};
            
            // Convertir les données de progression par catégorie dans le format attendu
            const categoryProgress: Record<string, { completed: number; total: number; average_score: number }> = {};
            
            if (data.categoryProgress) {
                Object.entries(data.categoryProgress).forEach(([key, value]) => {
                    const categoryData = value as any; // Type assertion
                    categoryProgress[key] = {
                        completed: categoryData.completed_quizzes || 0,
                        total: categoryData.total_quizzes || 10,
                        average_score: categoryData.average_score || 0
                    };
                });
            }
            
            return {
                total: {
                    points: data.total_points || 0,
                    completed_quizzes: data.completed_quizzes || 0,
                    average_score: data.average_score || 0
                },
                by_category: categoryProgress
            };
        } catch (error) {
            console.error('Error fetching user progress:', error);
            // Retourner une structure par défaut en cas d'erreur
            return {
                total: {
                    points: 0,
                    completed_quizzes: 0,
                    average_score: 0
                },
                by_category: {}
            };
        }
    }
};
