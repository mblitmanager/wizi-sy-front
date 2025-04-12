import React from 'react';
import { Question } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { CheckCircle2, XCircle } from 'lucide-react';

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
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => !isAnswerChecked && onAnswer(index)}
            disabled={isAnswerChecked}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedAnswer === index
                ? isAnswerChecked
                  ? index === question.correct_answer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-blue-500 bg-blue-50'
                : isAnswerChecked && index === question.correct_answer
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-left">{option}</span>
              {isAnswerChecked && (
                index === question.correct_answer ? (
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