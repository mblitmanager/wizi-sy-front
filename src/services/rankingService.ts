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
            const data = response.data || {};
            
            // Convertir les données de progression par catégorie dans le format attendu
            const categoryProgress: Record<string, { completed: number; total: number; average_score: number }> = {};
            // Si les données de progression par catégorie existent, les traiter, sinon laisser vide
            // if (data.categoryProgress && typeof data.categoryProgress === 'object') {
            //     Object.entries(data.categoryProgress).forEach(([key, value]) => {
            //         const categoryData: { completed_quizzes?: number; total_quizzes?: number; average_score?: number } = value || {};
            //         categoryProgress[key] = {
            //             completed: categoryData.completed_quizzes || 0,
            //             total: categoryData.total_quizzes || 0,
            //             average_score: categoryData.average_score || 0
            //         };
            //     });
            // }
            console.log('ProgressData ATO:', data);
            console.log('CategoryProgress ATO:', categoryProgress);
            return {
                total: {
                    points: data.totalPoints || 0,
                    completed_quizzes: data.completedQuizzes || 0,
                    average_score: data.averageScore || 0,
                    level: data.level || 1
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
