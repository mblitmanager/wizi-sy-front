import React, { useState } from 'react';
import { Question } from '../../types';
import BaseQuestion from './BaseQuestion';
import { GripVertical } from 'lucide-react';

interface WordBankProps {
  question: Question;
  onAnswer: (answer: { [key: string]: string[] }) => void;
  isAnswerChecked: boolean;
  selectedAnswer: { [key: string]: string[] } | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const WordBank: React.FC<WordBankProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [groups, setGroups] = useState<{ [key: string]: string[] }>(
    selectedAnswer || question.options?.reduce((acc, opt) => ({ ...acc, [opt]: [] }), {}) || {}
  );

  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData('text/plain', word);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, group: string) => {
    e.preventDefault();
    if (isAnswerChecked) return;

    const word = e.dataTransfer.getData('text/plain');
    const newGroups = { ...groups };
    
    // Remove word from previous group if it exists
    Object.keys(newGroups).forEach(g => {
      newGroups[g] = newGroups[g].filter(w => w !== word);
    });
    
    // Add word to new group
    newGroups[group] = [...newGroups[group], word];
    setGroups(newGroups);
    onAnswer(newGroups);
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
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groups).map(([group, words]) => (
          <div
            key={group}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, group)}
            className={`p-4 rounded-xl border-2 min-h-[200px] ${
              isAnswerChecked ? 'border-gray-200' : 'border-dashed border-gray-300 hover:border-blue-300'
            }`}
          >
            <h3 className="font-medium text-lg mb-4">{group}</h3>
            <div className="space-y-2">
              {words.map((word) => (
                <div
                  key={word}
                  draggable={!isAnswerChecked}
                  onDragStart={(e) => handleDragStart(e, word)}
                  className={`flex items-center p-3 rounded-lg border ${
                    isAnswerChecked
                      ? (question.correct_answer as { [key: string]: string[] })[group]?.includes(word)
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{word}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isAnswerChecked && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Correct Groups:</h3>
          {Object.entries(question.correct_answer as { [key: string]: string[] }).map(([group, words]) => (
            <div key={group} className="mb-2">
              <h4 className="font-medium text-blue-700">{group}:</h4>
              <div className="ml-4">
                {words.map(word => (
                  <div key={word} className="text-blue-600">
                    {word}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WordBank; 