import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';

interface FillInTheBlankQuestionProps {
  question: Question;
  isAnswerSubmitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const FillInTheBlankQuestion: React.FC<FillInTheBlankQuestionProps> = ({
  question,
  isAnswerSubmitted,
  onAnswer,
}) => {
  const [userAnswer, setUserAnswer] = useState('');

  const handleSubmit = () => {
    if (isAnswerSubmitted || !userAnswer.trim()) return;
    
    const correctAnswer = question.answers?.find(a => a.isCorrect);
    if (correctAnswer) {
      const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.text.toLowerCase().trim();
      onAnswer(correctAnswer.id, isCorrect);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Entrez votre réponse"
          disabled={isAnswerSubmitted}
          className="flex-1"
        />
        <Button
          onClick={handleSubmit}
          disabled={isAnswerSubmitted || !userAnswer.trim()}
        >
          Valider
        </Button>
      </div>
      {isAnswerSubmitted && (
        <div className="p-4 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">
            {question.answers?.find(a => a.isCorrect)?.text}
          </p>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlankQuestion; 