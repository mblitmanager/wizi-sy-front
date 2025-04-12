import React, { useState } from 'react';
import { Question } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface OrderingProps {
  question: Question;
  onAnswer: (answer: number[]) => void;
  isAnswerChecked: boolean;
  selectedAnswer: number[] | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const Ordering: React.FC<OrderingProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [order, setOrder] = useState<number[]>(selectedAnswer || question.options?.map((_, i) => i) || []);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isAnswerChecked) return;
    
    const newOrder = [...order];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
      setOrder(newOrder);
      onAnswer(newOrder);
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
      
      <div className="mt-6 space-y-4">
        {order.map((itemIndex, index) => (
          <div
            key={index}
            className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
              isAnswerChecked
                ? itemIndex === (question.correct_answer as number[])[index]
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-gray-500 font-medium">{index + 1}.</span>
              <span>{question.options?.[itemIndex]}</span>
            </div>
            
            {!isAnswerChecked && (
              <div className="ml-auto flex space-x-2">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === order.length - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAnswerChecked && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Correct Order:</h3>
          {(question.correct_answer as number[]).map((correctIndex, index) => (
            <div key={index} className="text-blue-700">
              {index + 1}. {question.options?.[correctIndex]}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Ordering; 