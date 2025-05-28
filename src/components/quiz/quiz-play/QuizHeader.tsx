import React from 'react';
import { Timer, Trophy, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuizHeaderProps {
  title: string;
  timeLeft: number | null;
  niveau: string;
  points: number;
  onToggleHint: () => void;
  onToggleHistory: () => void;
  onToggleStats: () => void;
}

export function QuizHeader({
  title,
  timeLeft,
  niveau,
  points,
  onToggleHint,
  onToggleHistory,
  onToggleStats,
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
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleHint}
            className="h-8 w-8"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleHistory}
            className="h-8 w-8"
          >
            <Trophy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleStats}
            className="h-8 w-8"
          >
            <Timer className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {timeLeft !== null && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {formatTime(timeLeft)}
          </Badge>
        )}
        <Badge variant="outline" className="flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          {points} points
        </Badge>
        <Badge variant="outline">{niveau}</Badge>
      </div>
    </div>
  );
}
