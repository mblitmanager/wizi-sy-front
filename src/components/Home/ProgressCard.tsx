
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UserProgress } from '@/types';

interface ProgressCardProps {
  progress: UserProgress;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
  // Create default values in case properties are undefined
  const quizzesCompleted = progress?.quizzes_completed || 0;
  const totalPoints = progress?.total_points || 0;
  const averageScore = progress?.average_score || 0;
  
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 font-montserrat">Votre Progression</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Quiz Complétés</h3>
          <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
            <span>{quizzesCompleted} terminés</span>
          </div>
          <Progress value={quizzesCompleted > 0 ? 100 : 0} className="h-2" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Points Gagnés</h3>
          <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
            <span>{totalPoints} points</span>
          </div>
          <Progress value={totalPoints > 0 ? 100 : 0} className="h-2" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-1">Score Moyen</h3>
          <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
            <span>{averageScore}%</span>
          </div>
          <Progress value={averageScore} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
