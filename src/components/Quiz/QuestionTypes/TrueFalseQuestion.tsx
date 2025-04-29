import React from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';

interface TrueFalseQuestionProps {
  question: Question;
  isAnswerSubmitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {question.answers?.map((answer) => (
          <Button
            key={answer.id}
            variant={isAnswerSubmitted ? (answer.isCorrect ? 'default' : 'outline') : 'outline'}
            className={`h-24 text-lg ${
              isAnswerSubmitted
                ? answer.isCorrect
                  ? 'bg-green-100 border-green-500'
                  : 'bg-red-100 border-red-500'
                : ''
            }`}
            onClick={() => handleAnswer(answer.id)}
            disabled={isAnswerSubmitted}
          >
            {answer.text}
          </Button>
        ))}
      </div>
      {isAnswerSubmitted && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {question.answers?.find(a => a.isCorrect)?.text}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrueFalseQuestion; 