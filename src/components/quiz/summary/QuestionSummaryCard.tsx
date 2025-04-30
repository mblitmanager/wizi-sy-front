
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Question } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { formatAnswer, formatCorrectAnswer } from './summaryHelpers';

interface QuestionSummaryCardProps {
  question: Question;
  index: number;
  userAnswer: any;
  isCorrect: boolean;
}

export const QuestionSummaryCard: React.FC<QuestionSummaryCardProps> = ({
  question,
  index,
  userAnswer,
  isCorrect
}) => {
  return (
    <Card className={cn(
      "border-l-4",
      isCorrect ? "border-l-green-500" : "border-l-red-500"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )}
          <CardTitle className="text-base md:text-lg">
            Question {index + 1}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-base md:text-lg font-medium">{question.text}</p>
        
        {question.media_url && (
          <div className="flex justify-center my-4">
            {question.type === 'question audio' ? (
              <div className="w-full max-w-md">
                <audio controls className="w-full">
                  <source 
                    src={question.media_url.startsWith('http') ? 
                      question.media_url : 
                      `${import.meta.env.VITE_API_URL}/${question.media_url}`} 
                    type="audio/mpeg" 
                  />
                  Votre navigateur ne supporte pas l'élément audio.
                </audio>
              </div>
            ) : (
              <img
                src={question.media_url.startsWith('http') ? 
                  question.media_url : 
                  `${import.meta.env.VITE_API_URL}/${question.media_url}`}
                alt="Question media"
                className="max-w-full h-auto rounded"
              />
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Votre réponse :
          </p>
          <div className={cn(
            "p-3 rounded-lg text-sm md:text-base",
            isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          )}>
            {userAnswer ? formatAnswer(question, userAnswer) : "Aucune réponse"}
          </div>
        </div>

        {!isCorrect && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Bonne réponse :
            </p>
            <div className="p-3 rounded-lg bg-green-50 text-green-800 text-sm md:text-base">
              {formatCorrectAnswer(question)}
            </div>
          </div>
        )}
        
        {question.explication && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Explication :
            </p>
            <Alert className="p-3 bg-blue-50 text-blue-800 text-sm md:text-base border-blue-200">
              {question.explication}
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
