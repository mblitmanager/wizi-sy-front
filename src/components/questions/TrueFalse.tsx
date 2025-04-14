import React, { useEffect, useState } from 'react';
import { Question, Answer } from '../../types';
import BaseQuestion from './BaseQuestion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { getReponsesByQuestion } from '../../api';

interface TrueFalseProps {
  question: Question;
  onAnswer: (answer: boolean) => void;
  isAnswerChecked: boolean;
  selectedAnswer: boolean | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const TrueFalse: React.FC<TrueFalseProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [reponses, setReponses] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReponses = async () => {
      try {
        setLoading(true);
        const fetchedReponses = await getReponsesByQuestion(question.id);
        setReponses(fetchedReponses);
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReponses();
  }, [question.id]);

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  if (!reponses || reponses.length === 0) {
    return <div className="text-center text-red-500">Aucune réponse disponible pour cette question.</div>;
  }

  const correctAnswer = reponses.find(r => r.is_correct)?.text === 'true';

  return (
    <>
      <BaseQuestion
        question={question}
        onAnswer={onAnswer}
        isAnswerChecked={isAnswerChecked}
        selectedAnswer={selectedAnswer}
        showHint={showHint}
        timeRemaining={timeRemaining}
      />
      
      <div className="space-y-3">
        {['true', 'false'].map((value) => (
          <button
            key={value}
            onClick={() => !isAnswerChecked && onAnswer(value === 'true')}
            disabled={isAnswerChecked}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedAnswer === (value === 'true')
                ? isAnswerChecked
                  ? selectedAnswer === correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-blue-500 bg-blue-50'
                : isAnswerChecked && value === (correctAnswer ? 'true' : 'false')
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-left">{value === 'true' ? 'Vrai' : 'Faux'}</span>
              {isAnswerChecked && (
                value === (correctAnswer ? 'true' : 'false') ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : selectedAnswer === (value === 'true') ? (
                  <XCircle className="h-6 w-6 text-red-500" />
                ) : null
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

export default TrueFalse; 