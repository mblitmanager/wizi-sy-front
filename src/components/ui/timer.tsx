import React, { useEffect, useState } from 'react';
import { Progress } from './progress';

interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, onTimeUp }) => {
  const [remainingTime, setRemainingTime] = useState(timeLeft);

  useEffect(() => {
    setRemainingTime(timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    if (remainingTime <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Temps restant</span>
        <span className="font-medium">{formatTime(remainingTime)}</span>
      </div>
      <Progress 
        value={(remainingTime / timeLeft) * 100} 
        className="h-2"
      />
    </div>
  );
}; 