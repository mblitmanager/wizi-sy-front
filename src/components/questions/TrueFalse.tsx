import React from 'react';
import { Question } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';

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
      
      <div className="grid grid-cols-2 gap-4">
        {[true, false].map((value) => (
          <button
            key={value ? 'true' : 'false'}
            onClick={() => !isAnswerChecked && onAnswer(value)}
            disabled={isAnswerChecked}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedAnswer === value
                ? isAnswerChecked
                  ? value === question.correct_answer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : 'border-blue-500 bg-blue-50 text-blue-700'
                : isAnswerChecked && value === question.correct_answer
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-blue-300 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="text-lg font-medium">
                {value ? 'Vrai' : 'Faux'}
              </span>
              {isAnswerChecked && (
                value === question.correct_answer ? (
                  <svg className="w-6 h-6 ml-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : selectedAnswer === value ? (
                  <svg className="w-6 h-6 ml-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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