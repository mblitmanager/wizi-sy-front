import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';
import { cn } from "@/lib/utils";

interface TrueFalseProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  showFeedback?: boolean;
}

export const TrueFalse: React.FC<TrueFalseProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Initialize from current answer if available
  useEffect(() => {
    const currentAnswer = question.selectedAnswers;
    if (currentAnswer) {
      if (Array.isArray(currentAnswer) && currentAnswer.length > 0) {
        setSelectedAnswer(currentAnswer[0]);
      } else if (typeof currentAnswer === 'string') {
        setSelectedAnswer(currentAnswer);
      }
    }
  }, [question.selectedAnswers]);

  const handleAnswerSelect = (value: string) => {
    if (showFeedback) return;
    setSelectedAnswer(value);
    onAnswer(value);
  };

  const isCorrectAnswer = (answerText: string) => {
    if (!showFeedback) return undefined;
    const answer = question.reponses?.find(a => a.text === answerText);
    return answer?.isCorrect || answer?.is_correct === 1;
  };

  const getCorrectAnswer = () => {
    return question.reponses?.find(a => a.isCorrect || a.is_correct === 1)?.text || '';
  };

  // Sort responses to ensure consistent order (True/Yes first, then False/No)
  const sortedResponses = question.reponses?.sort((a, b) => {
    const aText = a.text.toLowerCase();
    const bText = b.text.toLowerCase();
    if (aText === 'oui' || aText === 'vrai' || aText === 'true' || aText === 'yes') return -1;
    if (bText === 'oui' || bText === 'vrai' || bText === 'true' || bText === 'yes') return 1;
    return 0;
  });

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <div className="space-y-3">
          {sortedResponses?.map((answer) => {
            const isSelected = selectedAnswer === answer.text;
            const isCorrect = isCorrectAnswer(answer.text);
            const showCorrectIndicator = showFeedback && (isSelected || isCorrect);

            return (
              <div 
                key={answer.text} 
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent transition-colors",
                  isSelected && !showFeedback && "bg-accent",
                  showFeedback && isSelected && isCorrect && "bg-green-50 border-green-200",
                  showFeedback && isSelected && !isCorrect && "bg-red-50 border-red-200",
                  showFeedback && !isSelected && isCorrect && "bg-green-50 border-green-200"
                )}
              >
                <Checkbox
                  id={`answer-${answer.text}`}
                  checked={isSelected}
                  onCheckedChange={() => handleAnswerSelect(answer.text)}
                  disabled={showFeedback}
                />
                <Label 
                  htmlFor={`answer-${answer.text}`}
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
        </div>

        {showFeedback && (
          <div className="mt-4 text-sm text-muted-foreground">
            {isCorrectAnswer(selectedAnswer || '') ? (
              <p className="text-green-600 font-medium">Bonne réponse !</p>
            ) : (
              <p className="text-red-600 font-medium">
                Réponse incorrecte. La bonne réponse était : {getCorrectAnswer()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
