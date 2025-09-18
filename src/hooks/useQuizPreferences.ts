import { useState, useEffect, useCallback } from 'react';

export type QuizViewMode = 'adventure' | 'list';

const QUIZ_PREFERENCES_KEY = 'quiz_view_preference';

/**
 * Hook pour gérer les préférences de vue des quiz
 * Stocke et récupère la préférence utilisateur entre vue aventure et vue liste
 */
export function useQuizPreferences() {
  const [viewMode, setViewMode] = useState<QuizViewMode>('adventure');
  const [isLoading, setIsLoading] = useState(true);

  // Charger la préférence depuis localStorage au montage
  useEffect(() => {
    const loadPreference = () => {
      try {
        const savedPreference = localStorage.getItem(QUIZ_PREFERENCES_KEY);
        if (savedPreference === 'list') {
          setViewMode('list');
        } else {
          // Par défaut: vue aventure
          setViewMode('adventure');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences quiz:', error);
        setViewMode('adventure');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreference();
  }, []);

  // Sauvegarder la préférence dans localStorage
  const savePreference = useCallback((mode: QuizViewMode) => {
    try {
      localStorage.setItem(QUIZ_PREFERENCES_KEY, mode);
      setViewMode(mode);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences quiz:', error);
    }
  }, []);

  // Basculer entre les modes et sauvegarder
  const toggleViewMode = useCallback(() => {
    const newMode = viewMode === 'adventure' ? 'list' : 'adventure';
    savePreference(newMode);
  }, [viewMode, savePreference]);

  // Vérifier si l'utilisateur préfère la vue aventure
  const prefersAdventure = useCallback(() => {
    return viewMode === 'adventure';
  }, [viewMode]);

  // Vérifier si l'utilisateur préfère la vue liste
  const prefersList = useCallback(() => {
    return viewMode === 'list';
  }, [viewMode]);

  return {
    viewMode,
    isLoading,
    savePreference,
    toggleViewMode,
    prefersAdventure,
    prefersList,
  };
}
