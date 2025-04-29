
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, ArrowRight } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MatchingProps {
  question: QuizQuestion;
  onAnswer: (matches: Record<string, string>) => void;
  showFeedback?: boolean;
}

export const Matching: React.FC<MatchingProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [availableOptions, setAvailableOptions] = useState<{id: string, text: string}[]>([]);

  // Initialize from existing answer if available
  useEffect(() => {
    // Extract all possible right-side options from the answers
    const rightOptions = question.answers?.map(answer => ({
      id: answer.id,
      text: answer.match_pair || ''
    })).filter(option => option.text.length > 0) || [];
    
    setAvailableOptions(rightOptions);

    // Initialize with existing answers if available
    let initialMatches: Record<string, string> = { destination: 'destination' };
    
    if (question.selectedAnswers && typeof question.selectedAnswers === 'object' && !Array.isArray(question.selectedAnswers)) {
      initialMatches = { ...question.selectedAnswers, destination: 'destination' };
    }
    
    setMatches(initialMatches);
  }, [question]);

  const handleMatchChange = (leftId: string, rightValue: string) => {
    const newMatches = { ...matches, [leftId]: rightValue };
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const isCorrectMatch = (leftId: string): boolean | undefined => {
    if (!showFeedback) return undefined;
    
    const leftItem = question.answers?.find(a => a.id === leftId);
    return leftItem && matches[leftId] === leftItem.match_pair;
  };

  const getCorrectMatch = (leftId: string): string => {
    const leftItem = question.answers?.find(a => a.id === leftId);
    return leftItem?.match_pair || '';
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <div className="space-y-4">
          {question.answers?.filter(answer => answer.text && !answer.flashcard_back).map((leftItem) => {
            const isCorrect = isCorrectMatch(leftItem.id);
            
            return (
              <div 
                key={leftItem.id}
                className={cn(
                  "p-4 border rounded-lg flex flex-col md:flex-row md:items-center gap-2",
                  showFeedback && isCorrect === true ? "bg-green-50 border-green-200" : "",
                  showFeedback && isCorrect === false ? "bg-red-50 border-red-200" : ""
                )}
              >
                <div className="font-medium flex-1">
                  {leftItem.text}
                </div>
                
                <ArrowRight className="hidden md:block h-5 w-5 text-gray-400" />
                
                <div className="flex-1">
                  <Select
                    value={matches[leftItem.id] || ''}
                    onValueChange={(value) => handleMatchChange(leftItem.id, value)}
                    disabled={showFeedback}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une correspondance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sélectionnez...</SelectItem>
                      {question.answers?.filter(a => a.match_pair).map(answer => (
                        <SelectItem key={answer.id} value={answer.match_pair || ''}>
                          {answer.match_pair}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {showFeedback && (
                  <div className="flex items-center">
                    {isCorrect ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
          
          {showFeedback && (
            <div className="mt-4 space-y-2">
              {question.answers?.filter(answer => answer.text && !answer.flashcard_back).map((leftItem) => {
                const isCorrect = isCorrectMatch(leftItem.id);
                if (!isCorrect) {
                  return (
                    <p key={leftItem.id} className="text-red-600 text-sm">
                      La correspondance correcte pour <span className="font-medium">{leftItem.text}</span> était : {getCorrectMatch(leftItem.id)}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
