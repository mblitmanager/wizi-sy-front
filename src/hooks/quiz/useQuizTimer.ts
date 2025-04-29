
import { useState, useEffect } from 'react';

export const useQuizTimer = (initialTime: number = 30 * 60) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTimeSpent(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused]);

  return {
    timeLeft,
    timeSpent,
    isPaused,
    setIsPaused
  };
};
