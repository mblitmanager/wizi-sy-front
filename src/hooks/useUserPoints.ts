import { useState, useEffect } from 'react';

interface UserPointsData {
    totalPoints: number;
    accessibleLevels: string[];
}

/**
 * Hook pour récupérer les points de l'utilisateur et les niveaux accessibles
 * 
 * @returns {object} - { totalPoints, accessibleLevels, loading, error }
 * 
 * @example
 * const { totalPoints, accessibleLevels, loading } = useUserPoints();
 * 
 * if (accessibleLevels.includes('expert')) {
 *   // Afficher tous les quiz
 * }
 */
export function useUserPoints() {
    const [data, setData] = useState<UserPointsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserPoints = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me/points`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des points');
                }

                const pointsData = await response.json();
                setData(pointsData);
            } catch (err) {
                console.error('Error fetching user points:', err);
                setError(err instanceof Error ? err.message : 'Erreur inconnue');
            } finally {
                setLoading(false);
            }
        };

        fetchUserPoints();
    }, []);

    return {
        totalPoints: data?.totalPoints ?? 0,
        accessibleLevels: data?.accessibleLevels ?? ['debutant'],
        loading,
        error,
    };
}

/**
 * Filtre les quiz selon les niveaux accessibles
 * 
 * @param {Array} quizzes - Liste des quiz
 * @param {Array} accessibleLevels - Niveaux accessibles
 * @returns {Array} - Quiz filtrés
 * 
 * @example
 * const filteredQuiz = filterQuizByLevel(allQuiz, ['debutant', 'intermediaire']);
 */
export function filterQuizByLevel<T extends { niveau?: string }>(
    quizzes: T[],
    accessibleLevels: string[]
): T[] {
    return quizzes.filter((quiz) => {
        const quizLevel = quiz.niveau?.toLowerCase();
        return accessibleLevels.includes(quizLevel || 'debutant');
    });
}

/**
 * Détermine le prochain niveau à débloquer et les points nécessaires
 * 
 * @param {number} totalPoints - Points totaux de l'utilisateur
 * @returns {object} - { nextLevel, pointsNeeded }
 */
export function getNextLevelInfo(totalPoints: number): {
    nextLevel: string | null;
    pointsNeeded: number;
} {
    if (totalPoints < 50) {
        return {
            nextLevel: 'Intermédiaire',
            pointsNeeded: 50 - totalPoints,
        };
    } else if (totalPoints < 100) {
        return {
            nextLevel: 'Expert',
            pointsNeeded: 100 - totalPoints,
        };
    } else {
        return {
            nextLevel: null,
            pointsNeeded: 0,
        };
    }
}
