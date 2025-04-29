import axios from 'axios';
import { UserProgress, LeaderboardEntry } from '@/types/quiz';

const API_URL = import.meta.env.VITE_API_URL;

export interface RankingEntry {
    id: number;
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
            points: number;
            completed_quizzes: number;
            average_score: number;
        };
    };
}

export const rankingService = {
    // Classement global
    async getGlobalRanking(): Promise<RankingEntry[]> {
        try {
            const response = await axios.get(`${API_URL}/ranking/global`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching global ranking:', error);
            throw error;
        }
    },

    // Classement par formation
    async getFormationRanking(formationId: number): Promise<RankingEntry[]> {
        try {
            const response = await axios.get(`${API_URL}/ranking/formation/${formationId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching formation ranking:', error);
            throw error;
        }
    },

    // Progression de l'utilisateur
    async getUserProgress(stagiaireId: number): Promise<ProgressData> {
        try {
            const response = await axios.get(`${API_URL}/progress/${stagiaireId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user progress:', error);
            throw error;
        }
    },

    // Récompenses de l'utilisateur
    getUserRewards: async (): Promise<{
        points: number;
        completed_quizzes: number;
        completed_challenges: number;
    }> => {
        const response = await axios.get('/stagiaire/rewards', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Statistiques de l'utilisateur
    getUserStats: async (): Promise<{
        global_ranking: number;
        category_rankings: Record<string, number>;
        performance_comparison: {
            average_score: number;
            total_points: number;
            quizzes_completed: number;
        };
    }> => {
        const response = await axios.get('/stagiaire/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Mise à jour de la progression
    updateProgress: async (data: {
        quizId: string;
        score: number;
        timeSpent: number;
        correctAnswers: number;
        totalQuestions: number;
    }): Promise<void> => {
        await axios.post('/stagiaire/progress/update', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
}; 