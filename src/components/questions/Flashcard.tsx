import React, { useState, useEffect } from 'react';
import { Question, Response } from '@/types/quiz';
import BaseQuestion from './BaseQuestion';
import { RotateCw } from 'lucide-react';
import { questionService } from '@/services/api';

interface FlashcardProps {
  question: Question;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked: boolean;
  selectedAnswer: boolean | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const Flashcard: React.FC<FlashcardProps> = ({
  question,
  onAnswerSelect,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const fetchedResponses = await questionService.getQuestionResponses(question.id);
        setResponses(fetchedResponses as Response[]);
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    };
    fetchResponses();
  }, [question.id]);

  const handleFlip = () => {
    if (!isAnswerChecked) {
      setIsFlipped(!isFlipped);
      onAnswerSelect(question.id, (!isFlipped).toString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">{question.text}</div>
      <div
        className={`relative p-6 bg-white rounded-lg shadow cursor-pointer transition-transform duration-500 transform ${
          isFlipped ? 'scale-[-1]' : ''
        }`}
        onClick={handleFlip}
      >
        <div className={`transition-opacity duration-500 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center">{responses[0]?.text}</div>
        </div>
        <div
          className={`absolute inset-0 p-6 bg-white rounded-lg transform scale-x-[-1] transition-opacity duration-500 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-center">{responses[1]?.text}</div>
        </div>
      </div>
      <button
        onClick={handleFlip}
        disabled={isAnswerChecked}
        className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <RotateCw className="h-4 w-4" />
        <span>Retourner</span>
      </button>
    </div>
  );
};

export default Flashcard; 