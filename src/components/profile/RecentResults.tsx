
import React from 'react';
import { QuizResult } from '@/types/quiz';
import { CirclePlus, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface RecentResultsProps {
  results: QuizResult[];
  isLoading: boolean;
  showAll?: boolean;
}

export const RecentResults: React.FC<RecentResultsProps> = ({ 
  results, 
  isLoading,
  showAll = false 
}) => {
  // Limiter les résultats si on ne veut pas tout afficher
  const displayResults = showAll ? results : results.slice(0, 5);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full h-16 bg-gray-100 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 mb-4 font-roboto">Aucun résultat de quiz disponible.</p>
        <Link to="/quiz" className="text-blue-500 hover:text-blue-700 font-nunito inline-flex items-center">
          <CirclePlus className="h-4 w-4 mr-1" />
          Commencer un quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayResults.map((result) => {
        // Use appropriate property name depending on what's available
        const resultId = result.id || `quiz-result-${Math.random()}`;
        const quizName = result.quiz_name || result.quizTitle || 'Quiz';
        const correctAnswers = result.correct_answers || result.correctAnswers || 0;
        const totalQuestions = result.total_questions || result.totalQuestions || 0;
        
        // Date de complétion avec fallback
        const completedAt = result.completed_at 
          ? format(new Date(result.completed_at), 'PPP', { locale: fr })
          : 'Date inconnue';

        return (
          <Card key={resultId} className="w-full p-3 border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h4 className="font-medium text-sm font-nunito truncate pr-3">{quizName}</h4>
                <div className="text-xs text-gray-500 font-roboto">{completedAt}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium font-nunito flex items-center">
                  <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                  {result.score}%
                </div>
                <div className="text-xs text-gray-500 font-roboto">
                  {correctAnswers}/{totalQuestions} correct
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {!showAll && results.length > 5 && (
        <Link to="/profile?tab=results" className="text-blue-500 hover:text-blue-700 font-nunito text-sm flex justify-center mt-3">
          Voir tous les résultats ({results.length})
        </Link>
      )}
    </div>
  );
};
