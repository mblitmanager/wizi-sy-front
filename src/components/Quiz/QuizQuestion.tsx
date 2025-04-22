import React, { useState } from 'react';
import { Question } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import QuestionRenderer from './QuestionTypes/QuestionRenderer';

interface QuizQuestionProps {
  question: Question;
  totalQuestions: number;
  currentQuestion: number;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
}) => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const handleAnswer = (answerId: string, isCorrect: boolean) => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    onAnswer(answerId, isCorrect);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <Progress value={(currentQuestion / totalQuestions) * 100} className="mb-4" />
          <p className="text-sm text-gray-500">
            Question {currentQuestion} sur {totalQuestions}
          </p>
        </div>

        <QuestionRenderer
          question={question}
          isAnswerSubmitted={isAnswerSubmitted}
          onAnswer={handleAnswer}
        />
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
