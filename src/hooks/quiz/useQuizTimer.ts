import { useState, useEffect } from 'react';
// useQuizTimer.ts
export const useQuizTimer = (initialTime: number = 30 * 60) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timeSpent, setTimeSpent] = useState(0); // C'est votre temps total cumulé
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer: number | null = null;
    
    if (timeLeft > 0 && !isPaused) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTimeSpent(prev => prev + 1); // Toujours incrémenter le temps total
      }, 1000);
    }
    
    return () => {
      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, [timeLeft, isPaused]);

  // Fonction pour réinitialiser les deux pour un nouveau quiz
  const reset = () => {
    setTimeLeft(initialTime);
    setTimeSpent(0);
    setIsPaused(false);
  };
  
  // NOUVELLE FONCTION : Réinitialiser seulement le temps restant pour la question
  const resetTimeLeft = () => {
    setTimeLeft(initialTime); // Réinitialiser le temps imparti pour la question
    // Laissez timeSpent tel quel pour qu'il continue d'accumuler
  }

  return {
    timeLeft,
    timeSpent, // Ce sera maintenant le temps total
    isPaused,
    setIsPaused,
    setTimeLeft,
    reset,
    resetTimeLeft // Exposer la nouvelle fonction
  };
};
