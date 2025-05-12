
import React from 'react';
import { Check, X } from 'lucide-react';

interface Option {
  id: string;
  text: string;
}

interface TrueFalseProps {
  question: {
    id: string;
    texte: string;
    options?: Option[];
    reponses?: string[] | Option[];
    bonne_reponse?: string;
    correctAnswers?: string[];
  };
  selectedOptions: string[];
  onSelectOption: (optionId: string) => void;
  showFeedback?: boolean;
}

export const TrueFalse = ({
  question,
  selectedOptions,
  onSelectOption,
  showFeedback = false
}: TrueFalseProps) => {
  // Use options if available, or create from reponses if needed
  const options = question.options || [];
  
  // Format the options properly
  const formattedOptions: Option[] = options.length > 0 
    ? options 
    : (question.reponses as string[] | Option[])?.map((item, index) => {
        if (typeof item === 'string') {
          return { id: `option-${index}`, text: item };
        }
        return item;
      }) || [
        { id: 'true', text: 'Vrai' },
        { id: 'false', text: 'Faux' }
      ];
  
  // Determine if an option is correct based on the question structure
  const isCorrectOption = (optionId: string) => {
    if (!showFeedback) return false;
    
    if (question.correctAnswers) {
      return question.correctAnswers.includes(optionId);
    }
    
    if (question.bonne_reponse) {
      return optionId === question.bonne_reponse;
    }
    
    return false;
  };
  
  // Check if selected option is incorrect
  const isIncorrectOption = (optionId: string) => {
    if (!showFeedback) return false;
    return selectedOptions.includes(optionId) && !isCorrectOption(optionId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{question.texte}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                p-4 rounded-lg border-2 transition-colors flex justify-between items-center
                ${isSelected ? 'border-primary' : 'border-gray-200'}
                ${isCorrect ? 'bg-green-50 border-green-500' : ''}
                ${isIncorrect ? 'bg-red-50 border-red-500' : ''}
                ${!showFeedback && !isSelected ? 'hover:bg-gray-50' : ''}
              `}
            >
              <span className="text-lg font-medium">{option.text}</span>
              
              {showFeedback && isCorrect && (
                <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              )}
              
              {showFeedback && isIncorrect && (
                <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <X className="h-5 w-5 text-red-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
