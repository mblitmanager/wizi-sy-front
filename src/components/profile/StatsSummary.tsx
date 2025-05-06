
import React from 'react';
import { UserProgress } from '@/types/quiz';

interface StatsSummaryProps {
  userProgress: UserProgress | null;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ userProgress }) => {
  if (!userProgress) return null;

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold font-montserrat mb-4">Progression globale</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-muted-foreground">Quizzes complétés</p>
          <p className="text-lg font-semibold font-nunito">{userProgress.completed_quizzes || userProgress.completedQuizzes || 0}</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-muted-foreground">Points totaux</p>
          <p className="text-lg font-semibold font-nunito">{userProgress.total_points || userProgress.totalScore || 0}</p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-muted-foreground">Score moyen</p>
          <p className="text-lg font-semibold font-nunito">{userProgress.average_score || userProgress.averageScore || 0}%</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
