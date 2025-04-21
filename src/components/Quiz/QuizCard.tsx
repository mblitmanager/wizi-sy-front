import React from 'react';
import { Link } from 'react-router-dom';
import { Quiz } from '@/types';
import { Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type QuizType = Quiz;

interface QuizCardProps {
  quiz: QuizType;
  categoryColor: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, categoryColor }) => {
  const getLevelBadge = () => {
    switch (quiz.niveau) {
      case 'débutant':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Débutant</Badge>;
      case 'intermédiaire':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Intermédiaire</Badge>;
      case 'avancé':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Avancé</Badge>;
      case 'super':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Super Quiz</Badge>;
      default:
        return null;
    }
  };

  const questionCount = quiz.questions.length;
  const title = quiz.titre;
  const description = quiz.description;

  return (
    <Link to={`/quiz/${quiz.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform hover:shadow-md hover:translate-y-[-2px] w-full h-full flex flex-col">
        <div className="h-2" style={{ backgroundColor: categoryColor }}></div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {getLevelBadge()}
          </div>
          <p className="text-sm text-gray-600 mt-2 mb-3">{description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{questionCount * 30} sec</span>
            </div>
            <div className="flex items-center">
              <Award className="h-3 w-3 mr-1" />
              <span>{quiz.nb_points_total} points</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;
