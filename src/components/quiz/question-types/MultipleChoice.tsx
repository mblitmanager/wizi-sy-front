
import React from 'react';
import { Check, X } from 'lucide-react';

interface Option {
  id: string;
  text: string;
}

interface MultipleChoiceProps {
  question: {
    id: string;
    texte: string;
    options?: Option[];
    reponses?: Option[] | string[];
    correctAnswers?: string[];
  };
  selectedOptions: string[];
  onSelectOption: (optionId: string) => void;
  showFeedback?: boolean;
}

export const MultipleChoice = ({ 
  question, 
  selectedOptions, 
  onSelectOption,
  showFeedback = false
}: MultipleChoiceProps) => {
  // Formatting options based on the available data
  const options = question.options || [];
  
  // Handle different response formats
  const formattedOptions = options.length > 0 
    ? options 
    : question.reponses?.map((item: string | Option, index: number) => {
        if (typeof item === 'string') {
          return { id: `option-${index}`, text: item };
        }
        return item;
      }) || [];
  
  // Function to check if an option is correct
  const isCorrectOption = (optionId: string) => {
    if (!showFeedback) return false;
    return question.correctAnswers?.includes(optionId) || false;
  };
  
  // Function to check if an option is incorrect
  const isIncorrectOption = (optionId: string) => {
    if (!showFeedback) return false;
    return selectedOptions.includes(optionId) && !isCorrectOption(optionId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">{question.texte}</h3>
      
      <div className="space-y-3">
        {formattedOptions.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const isCorrect = isCorrectOption(option.id);
          const isIncorrect = isIncorrectOption(option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              disabled={showFeedback}
              className={`
                w-full text-left p-4 rounded-lg border transition-colors
                ${isSelected ? 'border-primary' : 'border-gray-200'}
                ${isCorrect ? 'bg-green-50 border-green-500' : ''}
                ${isIncorrect ? 'bg-red-50 border-red-500' : ''}
                ${!showFeedback && !isSelected ? 'hover:bg-gray-50' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                <span>{option.text}</span>
                {showFeedback && isCorrect && <Check className="h-5 w-5 text-green-500" />}
                {showFeedback && isIncorrect && <X className="h-5 w-5 text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
