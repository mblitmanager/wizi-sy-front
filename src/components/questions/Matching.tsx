import React, { useState } from 'react';
import { Question } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical } from 'lucide-react';

interface MatchingProps {
  question: Question;
  onAnswer: (answer: number[]) => void;
  isAnswerChecked: boolean;
  selectedAnswer: number[] | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const Matching: React.FC<MatchingProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [matches, setMatches] = useState<number[]>(selectedAnswer || question.options?.map((_, i) => i) || []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (isAnswerChecked) return;

    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newMatches = [...matches];
    [newMatches[sourceIndex], newMatches[targetIndex]] = [newMatches[targetIndex], newMatches[sourceIndex]];
    setMatches(newMatches);
    onAnswer(newMatches);
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
        {matches.map((matchIndex, index) => (
          <div
            key={index}
            draggable={!isAnswerChecked}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-move ${
              isAnswerChecked
                ? matchIndex === (question.correct_answer as number[])[index]
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <GripVertical className="h-5 w-5 text-gray-400 mr-3" />
            <div className="flex-1">
              <div className="font-medium">{question.options?.[index]}</div>
              <div className="text-gray-600">{question.options?.[matchIndex]}</div>
            </div>
          </div>
        ))}
      </div>

      {isAnswerChecked && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Correct Matches:</h3>
          {(question.correct_answer as number[]).map((correctIndex, index) => (
            <div key={index} className="text-blue-700">
              {question.options?.[index]} → {question.options?.[correctIndex]}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Matching; 