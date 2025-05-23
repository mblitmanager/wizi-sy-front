import React from 'react';
import { Timer, Trophy, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuizHeaderProps {
  timeLeft: number | null;
  niveau: string;
  points: number;
  onToggleHint: () => void;
  onToggleHistory: () => void;
  onToggleStats: () => void;
}

export function QuizHeader({
  timeLeft,
  niveau,
  titre,
  // points,
  onToggleHint,
  // onToggleHistory,
  // onToggleStats
}: QuizHeaderProps) {
  const isMobile = useIsMobile();

  // Get level badge color based on difficulty
  const getLevelBadgeClass = () => {
    const difficultyLevel = niveau ? niveau.toLowerCase() : '';

    if (difficultyLevel === 'débutant' || difficultyLevel === 'debutant') {
      return 'bg-green-500 hover:bg-green-600';
    } else if (difficultyLevel === 'intermédiaire' || difficultyLevel === 'intermediaire') {
      return 'bg-yellow-500 hover:bg-yellow-600';
    } else if (difficultyLevel === 'avancé' || difficultyLevel === 'avance') {
      return 'bg-red-500 hover:bg-red-600';
    }

    return 'bg-primary hover:bg-primary/90';
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 w-full">
      <div className="flex items-center gap-2 w-full sm:w-auto">
      <h1
        className={`text-2xl font-bold truncate ${isMobile ? 'text-center w-full' : 'text-left'}`}
        title={titre}
      >
        {titre}
      </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
      <div className="flex items-center gap-1">
        <Timer className="h-5 w-5" />
        <span className="font-mono text-base">
        {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
        </span>
      </div>
      <Badge className={getLevelBadgeClass() + ' text-xs px-2 py-1'}>
        {niveau}
      </Badge>
      {/* <div className="flex items-center gap-1">
        <Trophy className="h-4 w-4 text-yellow-500" />
      </div> */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleHint}
        className="ml-auto sm:ml-0 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 dark:hover:text-white"
      >
        <HelpCircle className="h-5 w-5 text-blue-900" />
      </Button>
      </div>
    </div>
  );
}
