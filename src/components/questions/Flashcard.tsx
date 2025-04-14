import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { Answer } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { RotateCw } from 'lucide-react';
import { getReponsesByQuestion } from '../../api';

interface FlashcardProps {
  question: Question;
  onAnswer: (answer: boolean) => void;
  isAnswerChecked: boolean;
  selectedAnswer: boolean | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const Flashcard: React.FC<FlashcardProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const fetchedResponses = await getReponsesByQuestion(question.id);
        setResponses(fetchedResponses.map(r => ({
          ...r,
          question_id: question.id,
          is_correct: true
        })) as Answer[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [question.id]);

  useEffect(() => {
    if (selectedAnswer !== null) {
      setIsFlipped(selectedAnswer);
    }
  }, [selectedAnswer]);

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  if (!responses || responses.length === 0) {
    return <div className="text-center text-red-500">Aucune réponse disponible pour cette question.</div>;
  }

  const frontContent = responses[0]?.text;
  const backContent = responses[0]?.flashcard_back;

  const handleFlip = () => {
    if (!isAnswerChecked) {
      const newFlipped = !isFlipped;
      setIsFlipped(newFlipped);
      onAnswer(newFlipped);
    }
  };

  return (
    <BaseQuestion
      question={question}
      onAnswer={onAnswer}
      isAnswerChecked={isAnswerChecked}
      selectedAnswer={selectedAnswer}
      showHint={showHint}
      timeRemaining={timeRemaining}
    >
      <div
        className={`relative w-full aspect-[3/2] cursor-pointer perspective-1000`}
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Face avant */}
          <div
            className={`absolute w-full h-full backface-hidden bg-white rounded-xl border-2 p-6 flex items-center justify-center text-center ${
              !isFlipped ? 'border-blue-500' : ''
            }`}
          >
            <div className="text-xl font-medium">{frontContent}</div>
          </div>

          {/* Face arrière */}
          <div
            className={`absolute w-full h-full backface-hidden bg-white rounded-xl border-2 p-6 flex items-center justify-center text-center rotate-y-180 ${
              isFlipped ? 'border-green-500' : ''
            }`}
          >
            <div className="text-xl font-medium">{backContent}</div>
          </div>
        </div>

        {!isAnswerChecked && (
          <button
            className="absolute bottom-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleFlip();
            }}
            title="Retourner la carte"
          >
            <RotateCw className="h-6 w-6" />
          </button>
        )}
      </div>
    </BaseQuestion>
  );
};

export default Flashcard; 