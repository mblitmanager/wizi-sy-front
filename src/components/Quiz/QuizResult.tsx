
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Award, Clock, Star, BarChart2, Home, Redo } from 'lucide-react';

interface QuizResultProps {
  result: QuizResult;
  onRetry: () => void;
}

const QuizResultComponent: React.FC<QuizResultProps> = ({ result, onRetry }) => {
  const navigate = useNavigate();
  const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  
  const getScoreMessage = () => {
    if (scorePercentage >= 90) return "Excellent !";
    if (scorePercentage >= 70) return "Très bien !";
    if (scorePercentage >= 50) return "Bien joué !";
    return "Continuez vos efforts !";
  };

  const getScoreColor = () => {
    if (scorePercentage >= 90) return "text-green-500";
    if (scorePercentage >= 70) return "text-blue-500";
    if (scorePercentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Résultats du Quiz</h2>
        <p className={`text-3xl font-bold mt-2 ${getScoreColor()} font-nunito`}>
          {getScoreMessage()}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold mb-2 text-blue-600 font-nunito">{scorePercentage}%</div>
          <div className="text-sm text-gray-600 font-roboto">
            {result.correctAnswers} sur {result.totalQuestions} questions correctes
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div 
              className="bg-blue-600 h-4 rounded-full" 
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
          <Award className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <div className="text-sm text-gray-600 font-roboto">Points gagnés</div>
            <div className="text-lg font-semibold font-nunito">{result.score}</div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg flex items-center">
          <Clock className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <div className="text-sm text-gray-600 font-roboto">Temps écoulé</div>
            <div className="text-lg font-semibold font-nunito">
              {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <Button onClick={onRetry} className="flex items-center justify-center font-nunito">
          <Redo className="h-4 w-4 mr-2" />
          Réessayer le quiz
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/leaderboard')}
          className="flex items-center justify-center font-nunito"
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Voir le classement
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center justify-center font-nunito"
        >
          <Home className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default QuizResultComponent;
