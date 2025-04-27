
import { Timer } from "lucide-react";
import { useEffect } from "react";

interface QuizTimerProps {
  timeSpent: number;
  setTimeSpent: (time: number) => void;
  isActive?: boolean;
}

export function QuizTimer({ timeSpent, setTimeSpent, isActive = true }: QuizTimerProps) {
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, setTimeSpent]);

  return (
    <div className="flex items-center gap-2">
      <Timer className="h-5 w-5 text-primary" />
      <span className="font-medium">
        {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
      </span>
    </div>
  );
}
