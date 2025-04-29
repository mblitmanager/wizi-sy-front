import React from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';

interface MultipleChoiceQuestionProps {
  question: Question;
  isAnswerSubmitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  isAnswerSubmitted,
  onAnswer,
}) => {
  const handleAnswer = (answerId: string) => {
    if (isAnswerSubmitted) return;
    const isCorrect = question.answers?.find(a => a.id === answerId)?.isCorrect;
    if (isCorrect !== undefined) {
      onAnswer(answerId, isCorrect);
    }
  };

  return (
    <div className="space-y-4">
      {question.answers?.map((answer) => (
        <Button
          key={answer.id}
          variant={isAnswerSubmitted ? (answer.isCorrect ? 'default' : 'outline') : 'outline'}
          className="w-full justify-start text-left"
          onClick={() => handleAnswer(answer.id)}
          disabled={isAnswerSubmitted}
        >
          {answer.text}
        </Button>
      ))}
    </div>
  );
};

export default MultipleChoiceQuestion; 