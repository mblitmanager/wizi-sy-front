
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Question as QuizQuestion } from '@/types/quiz';
import { cn } from "@/lib/utils";
import { Check, X } from 'lucide-react';

interface TrueFalseProps {
  question: QuizQuestion;
  onAnswer: (answers: string[]) => void;
  showFeedback?: boolean;
}

export const TrueFalse: React.FC<TrueFalseProps> = ({
  question,
  onAnswer,
  showFeedback = false
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const options = [
    { id: 'true', text: 'Vrai' },
    { id: 'false', text: 'Faux' }
  ];

  // Initialize from existing answers if available
  useEffect(() => {
    if (question.selectedAnswers && Array.isArray(question.selectedAnswers) && question.selectedAnswers.length) {
      setSelectedValue(question.selectedAnswers[0]);
    }
  }, [question.selectedAnswers]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onAnswer([value]); // Pass as array to match expected format
  };

  const getCorrectAnswer = () => {
    const correctAnswer = question.reponses?.find(answer => answer.isCorrect || answer.is_correct === 1);
    return correctAnswer?.text.toLowerCase() === 'vrai' ? 'true' : 'false';
  };

  const isAnswerCorrect = () => {
    return selectedValue === getCorrectAnswer();
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <RadioGroup
          value={selectedValue || ''}
          onValueChange={handleChange}
          disabled={showFeedback}
        >
          <div className="space-y-3">
            {options.map((option) => {
              const isCorrect = showFeedback && option.id === getCorrectAnswer();
              const isIncorrect = showFeedback && selectedValue === option.id && option.id !== getCorrectAnswer();
              
              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent transition-colors",
                    selectedValue === option.id && !showFeedback && "bg-accent",
                    isCorrect && "bg-green-50 border-green-200",
                    isIncorrect && "bg-red-50 border-red-200"
                  )}
                >
                  <RadioGroupItem 
                    value={option.id} 
                    id={`${question.id}-${option.id}`}
                    disabled={showFeedback}
                  />
                  <Label 
                    htmlFor={`${question.id}-${option.id}`}
                    className="flex-grow cursor-pointer text-base"
                  >
                    {option.text}
                  </Label>
                  {showFeedback && selectedValue === option.id && (
                    isAnswerCorrect() ? 
                      <Check className="h-5 w-5 text-green-600" /> : 
                      <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
              );
            })}
          </div>
        </RadioGroup>

        {showFeedback && selectedValue && (
          <div className="mt-4 text-sm">
            {isAnswerCorrect() ? (
              <p className="text-green-600 font-medium">Bonne réponse !</p>
            ) : (
              <p className="text-red-600 font-medium">
                Réponse incorrecte. La bonne réponse était : {getCorrectAnswer() === 'true' ? 'Vrai' : 'Faux'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
