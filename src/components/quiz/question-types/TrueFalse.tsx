import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';
import { cn } from "@/lib/utils";

interface TrueFalseProps {
  question: QuizQuestion;
  onAnswer: (answers: { id: string, text: string }[]) => void;
  showFeedback?: boolean;
}

export const TrueFalse: React.FC<TrueFalseProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  // Initialize from current answer if available
  useEffect(() => {
    if (question.selectedAnswers) {
      if (Array.isArray(question.selectedAnswers)) {
        setSelectedAnswers(question.selectedAnswers);
      } else if (typeof question.selectedAnswers === 'string') {
        setSelectedAnswers([question.selectedAnswers]);
      }
    }
  }, [question.selectedAnswers]);

  const handleAnswerSelect = (answerId: string) => {
    if (showFeedback) return;

    const isMultipleAnswers = question.reponses?.filter(r => r.isCorrect || r.is_correct === 1).length > 1;
    
    if (isMultipleAnswers) {
      // Toggle selection for multiple choice
      const newSelected = selectedAnswers.includes(answerId)
        ? selectedAnswers.filter(id => id !== answerId)
        : [...selectedAnswers, answerId];
      setSelectedAnswers(newSelected);
      onAnswer(newSelected.map(id => question.reponses?.find(a => a.id === id)?.text || "")); // Send only the text of selected answers
    } else {
      // Single choice - replace selection
      const answerText = question.reponses?.find((a) => a.id === answerId)?.text || "";
      setSelectedAnswers([answerId]);
      onAnswer([{ id: answerId, text: answerText }]); // Pass both id and text
    }
  };

  const isCorrectAnswer = (answerId: string) => {
    if (!showFeedback) return undefined;
    const answer = question.reponses?.find(a => a.id === answerId);
    return answer?.isCorrect || answer?.is_correct === 1;
  };

  const isSelectedAnswerCorrect = (answerId: string) => {
    if (!showFeedback) return undefined;
    const isSelected = selectedAnswers.includes(answerId);
    const isCorrect = isCorrectAnswer(answerId);
    return isSelected && isCorrect;
  };

  const isSelectedAnswerIncorrect = (answerId: string) => {
    if (!showFeedback) return undefined;
    const isSelected = selectedAnswers.includes(answerId);
    const isCorrect = isCorrectAnswer(answerId);
    return isSelected && !isCorrect;
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <div className="space-y-3">
          {question.reponses?.map((answer) => {
            const isSelected = selectedAnswers.includes(answer.id);
            const isCorrect = isCorrectAnswer(answer.id);
            const showCorrectIndicator = showFeedback && (isSelected || isCorrect);

            return (
              <div
                key={answer.id}
                className={cn(
                  "flex items-center space-x-2 rounded-lg p-4 hover:bg-accent transition-colors",
                  isSelected && !showFeedback && "bg-accent",
                  showFeedback && isSelected && isCorrect && "bg-green-50",
                  showFeedback && isSelected && !isCorrect && "bg-red-50",
                  showFeedback && !isSelected && isCorrect && "bg-green-50"
                )}
              >
                <Checkbox
                  id={`answer-${answer.id}`}
                  checked={isSelected}
                  onCheckedChange={() => handleAnswerSelect(answer.id)}
                  disabled={showFeedback}
                />
                <Label 
                  htmlFor={`answer-${answer.id}`}
                  className="flex-grow cursor-pointer text-xs md:text-sm"
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
        </div>

        {showFeedback && (
          <div className="mt-4 text-sm text-muted-foreground">
            {selectedAnswers.every(id => isCorrectAnswer(id)) ? (
              <p className="text-green-600 font-medium">Bonne réponse !</p>
            ) : (
              <p className="text-red-600 font-medium">
                Réponse incorrecte. Les bonnes réponses étaient:{" "}
                {question.reponses
                  ?.filter(a => a.isCorrect || a.is_correct === 1)
                  .map(a => a.text)
                  .join(", ")}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
