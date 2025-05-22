
import React from 'react';
import { Timer, Trophy, HelpCircle, History, BarChart } from 'lucide-react';
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
  points,
  onToggleHint,
  onToggleHistory,
  onToggleStats
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
    <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-between items-center'} mb-6`}>
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5" />
        <span className="font-mono">
          {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge className={getLevelBadgeClass()}>
          {niveau}
        </Badge>
        <div className="flex items-center gap-1">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">2 points</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleHint}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleHistory}
        >
          <History className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleStats}
        >
          <BarChart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
