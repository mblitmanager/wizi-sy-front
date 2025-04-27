
import { useEffect } from 'react';

interface TimerProps {
  timeSpent: number;
  setTimeSpent: (time: number) => void;
  isActive: boolean;
}

export function QuizTimer({ timeSpent, setTimeSpent, isActive }: TimerProps) {
  useEffect(() => {
    let interval: number;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setTimeSpent(timeSpent + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeSpent, setTimeSpent, isActive]);

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="text-lg font-mono">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
