
import React, { useState } from 'react';
import { Question } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical } from 'lucide-react';

interface ClassificationProps {
  question: Question;
  onAnswer: (answer: { [key: string]: number[] }) => void;
  isAnswerChecked: boolean;
  selectedAnswer: { [key: string]: number[] } | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const Classification: React.FC<ClassificationProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [categories, setCategories] = useState<{ [key: string]: number[] }>(
    selectedAnswer || question.categories?.reduce((acc, cat) => ({ ...acc, [cat]: [] }), {}) || {}
  );

  const handleDragStart = (e: React.DragEvent, itemIndex: number) => {
    e.dataTransfer.setData('text/plain', itemIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (isAnswerChecked) return;

    const itemIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newCategories = { ...categories };
    
    // Remove item from previous category if it exists
    Object.keys(newCategories).forEach(cat => {
      newCategories[cat] = newCategories[cat].filter(i => i !== itemIndex);
    });
    
    // Add item to new category
    newCategories[category] = [...newCategories[category], itemIndex];
    setCategories(newCategories);
    onAnswer(newCategories);
  };

  // Convert correct_answer to appropriate type if needed
  const getCorrectAnswers = (): { [key: string]: number[] } => {
    if (typeof question.correct_answer === 'object' && question.correct_answer !== null && !Array.isArray(question.correct_answer)) {
      // This is a record/object type, check if it matches our needed structure
      // We need to ensure it's a Record<string, number[]>
      const result: { [key: string]: number[] } = {};
      
      for (const [key, value] of Object.entries(question.correct_answer)) {
        if (Array.isArray(value)) {
          // Type assertion to tell TypeScript this is a number[]
          result[key] = value as number[];
        } else {
          // If it's not an array, create a single-item array
          result[key] = [typeof value === 'number' ? value : 0];
        }
      }
      
      return result;
    }
    
    // Fallback empty object if correct_answer is not in expected format
    return {};
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
        {question.categories?.map((category, catIndex) => (
          <div
            key={catIndex}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category)}
            className={`p-4 rounded-xl border-2 min-h-[200px] ${
              isAnswerChecked ? 'border-gray-200' : 'border-dashed border-gray-300 hover:border-blue-300'
            }`}
          >
            <h3 className="font-medium text-lg mb-4">{category}</h3>
            <div className="space-y-2">
              {categories[category]?.map((itemIndex) => (
                <div
                  key={itemIndex}
                  draggable={!isAnswerChecked}
                  onDragStart={(e) => handleDragStart(e, itemIndex)}
                  className={`flex items-center p-3 rounded-lg border ${
                    isAnswerChecked
                      ? getCorrectAnswers()[category]?.includes(itemIndex)
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{question.options?.[itemIndex]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isAnswerChecked && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Correct Classification:</h3>
          {Object.entries(getCorrectAnswers()).map(([category, items]) => (
            <div key={category} className="mb-2">
              <h4 className="font-medium text-blue-700">{category}:</h4>
              <div className="ml-4">
                {items.map(itemIndex => (
                  <div key={itemIndex} className="text-blue-600">
                    {question.options?.[itemIndex]}
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

export default Classification;
