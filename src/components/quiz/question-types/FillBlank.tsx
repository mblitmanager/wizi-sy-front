import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';
import { cn } from "@/lib/utils";

interface FillBlankProps {
  question: QuizQuestion;
  onAnswer: (answer: Record<string, string>) => void;
  showFeedback?: boolean;
}

export function FillBlank({ question, onAnswer, showFeedback = false }: FillBlankProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Parse question text to identify blank fields
  const parseQuestionText = () => {
    const regex = /{(.*?)}/g;
    const blanks = [];
    let match;
    
    while ((match = regex.exec(question.text)) !== null) {
      blanks.push(match[1]);
    }
    
    return blanks;
  };

  const blanks = parseQuestionText();

  // Initialize answers from any existing selected answers
  useEffect(() => {
    if (question.selectedAnswers && typeof question.selectedAnswers === 'object' && !Array.isArray(question.selectedAnswers)) {
      const initialAnswers: Record<string, string> = {};
      const selectedAnswers = question.selectedAnswers as Record<string, string>;
      
      Object.keys(selectedAnswers).forEach(key => {
        initialAnswers[key] = selectedAnswers[key];
      });
      
      setAnswers(initialAnswers);
    }
  }, [question.selectedAnswers]);

  const handleChange = (blankId: string, value: string) => {
    const newAnswers = { ...answers, [blankId]: value };
    setAnswers(newAnswers);
    onAnswer({
      ...newAnswers,
      questionType: question.type // Ajoute le type de question dans la réponse
    });
  };

  const isCorrectAnswer = (blankId: string, userAnswer: string) => {
    if (!showFeedback) return undefined;
    const correctAnswer = question.reponses?.find(a => a.text === blankId)?.text;
    return userAnswer?.toLowerCase().trim() === correctAnswer?.toLowerCase().trim();
  };

  const getCorrectAnswer = (blankId: string) => {
    return question.reponses?.find(a => a.text === blankId)?.text || '';
  };

  // Replace blanks in question text with input fields
  const renderQuestionWithInputs = () => {
    let parts = question.text.split(/({.*?})/g);
    
    return parts.map((part, index) => {
      if (part.match(/^{.*}$/)) {
        const blankId = part.substring(1, part.length - 1);
        const userAnswer = answers[blankId] || '';
        const isCorrect = isCorrectAnswer(blankId, userAnswer);
        
        return (
          <div key={index} className="inline-flex items-center gap-2">
            <Input
              value={userAnswer}
              onChange={(e) => handleChange(blankId, e.target.value)}
              disabled={showFeedback}
              className={cn(
                "w-32",
                showFeedback && isCorrect && "bg-green-50 border-green-200",
                showFeedback && !isCorrect && userAnswer && "bg-red-50 border-red-200"
              )}
            />
            {showFeedback && userAnswer && (
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
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <div className="space-y-4">
          <div className="text-xl font-semibold mb-4">
            {renderQuestionWithInputs()}
          </div>

          {showFeedback && (
            <div className="space-y-2">
              {blanks.map(blankId => {
                const userAnswer = answers[blankId];
                const isCorrect = isCorrectAnswer(blankId, userAnswer || '');
                
                if (!isCorrect && userAnswer) {
                  return (
                    <div key={blankId} className="text-sm text-red-600">
                      Pour {blankId}, la réponse correcte était: <strong>{getCorrectAnswer(blankId)}</strong>
                    </div>
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
}
