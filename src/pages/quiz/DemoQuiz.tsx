import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import QuizGame from '../../components/quiz/QuizGame';
import type { Question } from '../../types';

function DemoQuiz() {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  const demoQuestions: Question[] = [
    {
      id: 'demo1',
      text: 'Quelle est la capitale de la France ?',
      type: 'single',
      options: ['Londres', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris'
    },
    {
      id: 'demo2',
      text: 'Quels sont les langages de programmation web les plus populaires ?',
      type: 'multiple',
      options: ['JavaScript', 'Python', 'Java', 'PHP'],
      correctAnswer: ['JavaScript', 'PHP']
    }
  ];

  const handleComplete = (score: number) => {
    setIsCompleted(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quiz de démonstration</h1>
        <div className="flex items-center text-sm text-gray-600">
          <Lock className="w-4 h-4 mr-2" />
          Version démo
        </div>
      </div>

      {!isCompleted ? (
        <QuizGame
          questions={demoQuestions}
          timeLimit={300}
          onComplete={handleComplete}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Félicitations !</h2>
          <p className="text-gray-600 mb-6">
            Vous avez terminé le quiz de démonstration. Inscrivez-vous pour accéder à tous les quiz !
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            S'inscrire maintenant
          </button>
        </div>
      )}
    </div>
  );
}

export default DemoQuiz;