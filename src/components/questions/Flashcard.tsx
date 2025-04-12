import React, { useState } from 'react';
import { Question } from '../../types';
import BaseQuestion from './BaseQuestion';
import { RotateCw } from 'lucide-react';

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
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(selectedAnswer);

  const handleFlip = () => {
    if (!isAnswerChecked) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!isAnswerChecked) {
      setUserAnswer(isCorrect);
      onAnswer(isCorrect);
    }
  };

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
      
      <div className="mt-6 perspective-1000">
        <div
          className={`relative w-full h-64 transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of the card */}
          <div
            className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col items-center justify-center ${
              isAnswerChecked
                ? userAnswer === question.correct_answer
                  ? 'bg-green-50 border-2 border-green-500'
                  : 'bg-red-50 border-2 border-red-500'
                : 'bg-white border-2 border-gray-200'
            }`}
          >
            <div className="text-center">
              <h3 className="text-xl font-medium mb-4">Question</h3>
              <p className="text-gray-700">{question.text}</p>
            </div>
            {!isAnswerChecked && (
              <button
                onClick={handleFlip}
                className="absolute bottom-4 right-4 p-2 rounded-full hover:bg-gray-100"
              >
                <RotateCw className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Back of the card */}
          <div
            className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col items-center justify-center rotate-y-180 ${
              isAnswerChecked
                ? userAnswer === question.correct_answer
                  ? 'bg-green-50 border-2 border-green-500'
                  : 'bg-red-50 border-2 border-red-500'
                : 'bg-white border-2 border-gray-200'
            }`}
          >
            <div className="text-center">
              <h3 className="text-xl font-medium mb-4">Réponse</h3>
              <p className="text-gray-700">{question.options?.[0]}</p>
            </div>
            {!isAnswerChecked && (
              <div className="absolute bottom-4 flex space-x-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className={`px-4 py-2 rounded-lg ${
                    userAnswer === true
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Je connais
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className={`px-4 py-2 rounded-lg ${
                    userAnswer === false
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Je ne connais pas
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAnswerChecked && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Explication:</h3>
          <p className="text-blue-700">{question.explication}</p>
        </div>
      )}
    </>
  );
};

export default Flashcard; 