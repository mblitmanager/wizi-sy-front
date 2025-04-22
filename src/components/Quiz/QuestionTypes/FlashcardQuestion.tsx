import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';
import { RotateCw } from 'lucide-react';

interface FlashcardQuestionProps {
  question: Question;
  isAnswerSubmitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const FlashcardQuestion: React.FC<FlashcardQuestionProps> = ({
  question,
  isAnswerSubmitted,
  onAnswer,
}) => {
  const [showBack, setShowBack] = useState(false);

  const handleFlip = () => {
    if (!showBack) {
      // Lorsqu'on voit la réponse pour la première fois, on considère que c'est une réponse correcte
      onAnswer('flashcard', true);
    }
    setShowBack(!showBack);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div 
          className={`min-h-[200px] p-6 border rounded-lg transition-all duration-500 transform ${
            showBack ? 'bg-gray-50' : 'bg-white'
          }`}
          style={{
            transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            {showBack ? (
              <p className="text-lg">{question.flashcard?.back}</p>
            ) : (
              <p className="text-lg">{question.text}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleFlip}
          disabled={isAnswerSubmitted}
        >
          <RotateCw className="h-4 w-4" />
          {showBack ? 'Voir la question' : 'Voir la réponse'}
        </Button>
      </div>

      {isAnswerSubmitted && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Vous avez vu la réponse
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardQuestion; 