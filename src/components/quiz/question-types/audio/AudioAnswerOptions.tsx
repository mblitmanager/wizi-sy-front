
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface AnswerOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  is_correct?: number | null;
}

interface AudioAnswerOptionsProps {
  answers: AnswerOption[];
  selectedAnswer: string | null;
  onSelectAnswer: (answerId: string) => void;
  showFeedback: boolean;
  correctAnswers?: string[];
}

export const AudioAnswerOptions: React.FC<AudioAnswerOptionsProps> = ({
  answers,
  selectedAnswer,
  onSelectAnswer,
  showFeedback,
  correctAnswers
}) => {
  const isCorrectAnswer = (answerId: string) => {
    if (!showFeedback) return undefined;
    
    // Vérifier si la question a une liste de correctAnswers
    if (correctAnswers && correctAnswers.length > 0) {
      const correctIds = correctAnswers.map(id => String(id));
      return correctIds.includes(answerId);
    }
    
    // Sinon, utiliser l'attribut isCorrect ou is_correct des réponses
    const answer = answers?.find(a => a.id === answerId);
    return answer?.isCorrect || answer?.is_correct === 1;
  };

  return (
    <RadioGroup 
      value={selectedAnswer || ''} 
      onValueChange={onSelectAnswer}
      className="space-y-3"
    >
      {answers?.map((answer) => {
        const isSelected = selectedAnswer === answer.id;
        const isCorrect = isCorrectAnswer(answer.id);
        const showCorrectIndicator = showFeedback && (isSelected || isCorrect);

        return (
          <div 
            key={answer.id} 
            className={cn(
              "flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent transition-colors",
              isSelected && !showFeedback && "bg-accent",
              showFeedback && isSelected && isCorrect && "bg-green-50 border-green-200",
              showFeedback && isSelected && !isCorrect && "bg-red-50 border-red-200",
              showFeedback && !isSelected && isCorrect && "bg-green-50 border-green-200"
            )}
          >
            <RadioGroupItem 
              value={answer.id} 
              id={`audio-answer-${answer.id}`} 
              disabled={showFeedback}
            />
            <Label 
              htmlFor={`audio-answer-${answer.id}`}
              className="flex-grow cursor-pointer text-base"
            >
              {answer.text}
            </Label>
            {showCorrectIndicator && (
              <span className="flex items-center">
                {isCorrect ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
              </span>
            )}
          </div>
        );
      })}
    </RadioGroup>
  );
};
