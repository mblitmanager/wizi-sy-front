import React, { useEffect, useState } from 'react';
import { Question, Answer } from '../../types';
import BaseQuestion from './BaseQuestion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { quizAPI } from '../../api';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If the question already has options, create responses from options
        if (question.options && question.options.length > 0) {
          const formattedResponses: Answer[] = question.options.map((option, index) => ({
            id: `${question.id}-option-${index}`,
            question_id: question.id,
            text: option,
            is_correct: (question.correct_answer === index.toString() || question.correct_answer === index) ? 1 : 0
          }));
          setReponses(formattedResponses);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        const responses = await quizAPI.getResponsesByQuestion(question.id);
        console.log('Responses fetched:', responses);
        
        if (responses && responses.length > 0) {
          setReponses(responses);
        } else {
          setError('Aucune réponse disponible pour cette question.');
        }
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError('Failed to load responses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [question]);

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
    return <div className="text-center p-4">Chargement des réponses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!reponses || reponses.length === 0) {
    return <div className="text-center text-red-500 p-4">Aucune réponse disponible pour cette question.</div>;
  }

  return (
    <BaseQuestion
      question={question}
      onAnswer={onAnswer}
      isAnswerChecked={isAnswerChecked}
      selectedAnswer={selectedAnswer}
      showHint={showHint}
      timeRemaining={timeRemaining}
    >
      <div className="space-y-3">
        {reponses.map((reponse, index) => (
          <button
            key={reponse.id}
            onClick={() => {
              if (!isAnswerChecked) {
                console.log('Réponse sélectionnée:', {
                  id: reponse.id,
                  text: reponse.text,
                  isCorrect: reponse.is_correct
                });
                onAnswer(index);
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
                reponse.is_correct ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : selectedAnswer === index ? (
                  <XCircle className="h-6 w-6 text-red-500" />
                ) : null
              )}
            </div>
          </button>
        ))}
      </div>
    </BaseQuestion>
  );
};

export default MultipleChoice;
