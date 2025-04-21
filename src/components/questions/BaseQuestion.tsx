import React from 'react';
import { Question } from '../../types/quiz';
import { Progress } from '@/components/ui/progress';

interface BaseQuestionProps {
  question: Question;
  children: React.ReactNode;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked?: boolean;
  selectedAnswer?: unknown;
  showHint?: boolean;
  timeRemaining?: number;
}

const BaseQuestion: React.FC<BaseQuestionProps> = ({
  question,
  children,
  onAnswerSelect,
  isAnswerChecked = false,
  selectedAnswer,
  showHint = false,
  timeRemaining
}) => {
  return (
    <div className="space-y-4">
      {children}
      {showHint && question.astuce && (
        <div className="mt-4 p-4 rounded-lg bg-muted">
          <div className="font-medium">Indice:</div>
          <div>{question.astuce}</div>
        </div>
      )}
      {timeRemaining !== undefined && (
        <div className="mt-4">
          <div className="text-sm text-muted-foreground">Temps restant: {timeRemaining}s</div>
          <Progress value={(timeRemaining / 60) * 100} className="mt-2" />
        </div>
      )}
    </div>
  );
};

export default BaseQuestion; 