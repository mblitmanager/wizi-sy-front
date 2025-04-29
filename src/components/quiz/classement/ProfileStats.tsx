import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle, Clock } from 'lucide-react';
import { QuizStats } from '@/types/quiz';

interface ProfileStatsProps {
  stats: QuizStats;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const averageScore = stats?.averageScore ? Math.round(stats.averageScore) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h4 className="text-sm font-medium">Statistiques du Profil</h4>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">Score Moyen</div>
        <div className="text-2xl font-bold">{averageScore}%</div>
        <Progress value={averageScore} className="h-2 mt-2" />
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>{stats?.completedQuizzes || 0} Quiz Complétés</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{stats?.averageTimeSpent ? Math.floor(stats.averageTimeSpent / 60) : 0} minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
