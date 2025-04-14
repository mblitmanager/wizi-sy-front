import React, { useEffect, useState } from 'react';
import { Question, Answer } from '../../types';
import BaseQuestion from './BaseQuestion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { getReponsesByQuestion } from '../../api';

interface MultipleChoiceProps {
  question: Question;
  onAnswer: (answer: number) => void;
  isAnswerChecked: boolean;
  selectedAnswer: number | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
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

  // Ajoutez cet useEffect pour afficher la réponse sélectionnée
  useEffect(() => {
    if (selectedAnswer !== null) {
      const selectedReponse = reponses[selectedAnswer];
      if (selectedReponse) {
        console.log('Réponse sélectionnée:', {
          id: selectedReponse.id,
          text: selectedReponse.text,
          isCorrect: selectedReponse.is_correct
        });
      }
    }
  }, [selectedAnswer, reponses]);

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  if (!reponses || reponses.length === 0) {
    return <div className="text-center text-red-500">Aucune réponse disponible pour cette question.</div>;
  }

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
        {reponses.map((reponse, index) => (
          <button
            key={reponse.id}
            onClick={() => {
              if (!isAnswerChecked) {
                onAnswer(index);
                // Alternative: afficher directement ici au moment du clic
                console.log('Réponse cliquée:', {
                  id: reponse.id,
                  text: reponse.text,
                  isCorrect: reponse.is_correct
                });
              }
            }}
            disabled={isAnswerChecked}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedAnswer === index
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
                reponse.isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : selectedAnswer === index ? (
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
export default MultipleChoice; 