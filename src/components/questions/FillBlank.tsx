import React, { useState } from 'react';
import { Question } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FillBlankProps {
  question: Question;
  onAnswer: (answer: string) => void;
  isAnswerChecked: boolean;
  selectedAnswer: string | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const FillBlank: React.FC<FillBlankProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [inputValue, setInputValue] = useState(selectedAnswer || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnswerChecked) {
      onAnswer(inputValue);
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
      
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAnswerChecked}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              isAnswerChecked
                ? inputValue.toLowerCase() === (question.correct_answer as string).toLowerCase()
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }`}
            placeholder="Type your answer here..."
          />
          {isAnswerChecked && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {inputValue.toLowerCase() === (question.correct_answer as string).toLowerCase() ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
          )}
        </div>
        {isAnswerChecked && inputValue.toLowerCase() !== (question.correct_answer as string).toLowerCase() && (
          <p className="mt-2 text-sm text-gray-600">
            Correct answer: <span className="font-medium">{question.correct_answer}</span>
          </p>
        )}
      </form>
    </>
  );
};

export default FillBlank; 