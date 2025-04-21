import React, { useEffect, useState } from 'react';
import { Question, Response } from '@/types/quiz';
import BaseQuestion from './BaseQuestion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { questionService } from '@/services/api';

interface TrueFalseProps {
  question: Question;
  selectedAnswer: string;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked: boolean;
  showHint?: boolean;
  timeRemaining?: number;
}

const TrueFalse: React.FC<TrueFalseProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isAnswerChecked,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const fetchedResponses = await questionService.getQuestionResponses(question.id);
        setResponses(fetchedResponses as Response[]);
      } catch (error) {
        console.error('Failed to fetch responses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [question.id]);

  // Ajoutez cet useEffect pour afficher la réponse sélectionnée
  useEffect(() => {
    if (selectedAnswer !== null) {
      const selectedReponse = responses[selectedAnswer];
      if (selectedReponse) {
        console.log('Réponse sélectionnée:', {
          id: selectedReponse.id,
          text: selectedReponse.text,
          isCorrect: selectedReponse.is_correct
        });
      }
    }
  }, [selectedAnswer, responses]);

  const handleSelect = (answerId: string) => {
    onAnswerSelect(question.id, answerId);
  };

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  if (!responses || responses.length === 0) {
    return <div className="text-center text-red-500">Aucune réponse disponible pour cette question.</div>;
  }

  return (
    <>
      <BaseQuestion
        question={question}
        onAnswerSelect={handleSelect}
        isAnswerChecked={isAnswerChecked}
        selectedAnswer={selectedAnswer}
        showHint={showHint}
        timeRemaining={timeRemaining}
      >
        <div className="space-y-3">
          {responses.map((reponse, index) => (
            <button
              key={reponse.id}
              onClick={() => {
                if (!isAnswerChecked) {
                  handleSelect(index.toString());
                }
              }}
              disabled={isAnswerChecked}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedAnswer === index.toString()
                  ? isAnswerChecked
                    ? reponse.is_correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : isAnswerChecked && reponse.is_correct
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-left">{reponse.text}</span>
                {isAnswerChecked && (
                  reponse.is_correct ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : selectedAnswer === index.toString() ? (
                    <XCircle className="h-6 w-6 text-red-500" />
                  ) : null
                )}
              </div>
            </button>
          ))}
        </div>
      </BaseQuestion>
    </>
  );
};
export default TrueFalse; 