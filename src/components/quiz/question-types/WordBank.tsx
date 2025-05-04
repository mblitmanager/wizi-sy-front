import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';
import { cn } from "@/lib/utils";

interface WordBankProps {
  question: QuizQuestion;
  onAnswer: (answers: string[]) => void;
  showFeedback?: boolean;
}

export const WordBank: React.FC<WordBankProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    // Initialize from existing answers if available
    if (question.selectedAnswers && Array.isArray(question.selectedAnswers)) {
      setSelectedWords(question.selectedAnswers);
    }
  }, [question.selectedAnswers]);

  const handleWordSelect = (wordId: string) => {
    if (showFeedback) return;

    let newSelectedWords: string[];

    if (selectedWords.includes(wordId)) {
      // Remove word if already selected
      newSelectedWords = selectedWords.filter(id => id !== wordId);
    } else {
      // Add word if not already selected
      newSelectedWords = [...selectedWords, wordId];
    }

    setSelectedWords(newSelectedWords);
    onAnswer(newSelectedWords.map(id => question.reponses?.find(a => a.id === id)?.text || "")); // Send only the text of selected words
  };

  const isWordCorrect = (wordId: string): boolean | null => {
    if (!showFeedback) return null;
    
    const answer = question.reponses?.find(a => a.id === wordId);
    return answer ? Boolean(answer.isCorrect || answer.is_correct) : false;
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="font-medium text-sm text-muted-foreground mb-2">
            Sélectionnez les réponses correctes:
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {question.reponses?.map((word) => {
            const isSelected = selectedWords.includes(word.id);
            const correctStatus = isWordCorrect(word.id);
            
            return (
              <Button
                key={word.id}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "transition-all flex items-center gap-2",
                  showFeedback && correctStatus === true && "bg-green-100 text-green-800 hover:bg-green-100 border-green-300",
                  showFeedback && correctStatus === false && isSelected && "bg-red-100 text-red-800 hover:bg-red-100 border-red-300",
                  !showFeedback && isSelected && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleWordSelect(word.id)}
                disabled={showFeedback}
              >
                {word.text}
                {showFeedback && isSelected && (
                  correctStatus ? 
                    <Check className="h-4 w-4 text-green-600" /> : 
                    <X className="h-4 w-4 text-red-600" />
                )}
              </Button>
            );
          })}
        </div>
        
        {showFeedback && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium">Réponses correctes:</p>
            <div className="mt-2">
              {question.reponses
                ?.filter(answer => answer.isCorrect || answer.is_correct)
                .map(answer => (
                  <span 
                    key={answer.id}
                    className={cn(
                      "inline-block mr-2 mb-2 px-3 py-1 rounded-full text-sm",
                      selectedWords.includes(answer.id) 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {answer.text}
                  </span>
                ))
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
