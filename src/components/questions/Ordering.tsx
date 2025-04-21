import React, { useState, useEffect } from 'react';
import { Question, Response } from '@/types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { questionService } from '@/services/api';

interface OrderingProps {
  question: Question;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked: boolean;
  selectedAnswer: string[] | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const Ordering: React.FC<OrderingProps> = ({
  question,
  onAnswerSelect,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const fetchedResponses = await questionService.getQuestionResponses(question.id);
        const responses = fetchedResponses as Response[];
        setResponses(responses);
        setOrder(responses.map(r => r.id));
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    };
    fetchResponses();
  }, [question.id]);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (isAnswerChecked) return;

    const newOrder = [...order];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
      setOrder(newOrder);
      onAnswerSelect(question.id, JSON.stringify(newOrder));
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">{question.text}</div>
      <div className="space-y-2">
        {order.map((id, index) => {
          const response = responses.find(r => r.id === id);
          if (!response) return null;
          return (
            <div key={id} className="flex items-center gap-2 p-2 bg-white rounded-lg shadow">
              <div className="flex gap-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={isAnswerChecked || index === 0}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  title="Déplacer vers le haut"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={isAnswerChecked || index === order.length - 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  title="Déplacer vers le bas"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">{response.text}</div>
            </div>
          );
        })}
      </div>
      {isAnswerChecked && (
        <div className="mt-4 p-4 rounded-lg bg-muted">
          <div className="font-medium">Ordre correct:</div>
          <div className="space-y-2">
            {responses
              .sort((a, b) => (a.is_correct ? -1 : b.is_correct ? 1 : 0))
              .map((response) => (
                <div key={response.id} className="flex items-center gap-2">
                  <div className="flex-1">{response.text}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordering; 