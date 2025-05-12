
import React from 'react';
import { Timer, Trophy, HelpCircle, History, BarChart, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser } from '@/context/UserContext';
import { useQuery } from '@tanstack/react-query';
import { sponsorshipService } from '@/services/sponsorshipService';

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
  const { user } = useUser();
  const { data: sponsorshipStats } = useQuery({
    queryKey: ['sponsorship', 'stats'],
    queryFn: () => sponsorshipService.getStats(),
    staleTime: 60000,
  });
  
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

  // Get user information
  const userName = user?.stagiaire?.prenom || 'Joueur';
  const userPoints = user?.stagiaire?.points || 0;
  const referralsCount = sponsorshipStats?.totalReferrals || 0;

  return (
    <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-4 mb-6 shadow-md">
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'}`}>
        {/* User info */}
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="bg-blue-600 text-white p-1.5 rounded-full">
            <User className="h-4 w-4" />
          </div>
          <span className="font-medium text-blue-700">{userName}</span>
          <div className="flex items-center ml-2">
            <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{userPoints} pts</span>
          </div>
          <div className="flex items-center ml-2">
            <Users className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-sm font-medium">{referralsCount}</span>
          </div>
        </div>
        
        {/* Quiz timer */}
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
          <Timer className="h-5 w-5 text-blue-500" />
          <span className="font-mono font-bold text-gray-700">
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </span>
        </div>
        
        {/* Quiz info */}
        <div className="flex items-center gap-3">
          <Badge className={`${getLevelBadgeClass()} animate-pulse`}>
            {niveau}
          </Badge>
          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{points} points</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-blue-50 transition-colors"
            onClick={onToggleHint}
          >
            <HelpCircle className="h-5 w-5 text-blue-500" />
            <span className={isMobile ? "hidden" : "ml-2"}>Indice</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-blue-50 transition-colors"
            onClick={onToggleHistory}
          >
            <History className="h-5 w-5 text-blue-500" />
            <span className={isMobile ? "hidden" : "ml-2"}>Historique</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-blue-50 transition-colors"
            onClick={onToggleStats}
          >
            <BarChart className="h-5 w-5 text-blue-500" />
            <span className={isMobile ? "hidden" : "ml-2"}>Statistiques</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
