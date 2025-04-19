import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { quizService } from '../../services/quizService';

interface OrderingProps {
  question: Question;
  onAnswer: (answer: number[]) => void;
  isAnswerChecked: boolean;
  selectedAnswer: number[] | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const Ordering: React.FC<OrderingProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await quizService.getQuizAnswers(question.id);
        const answers = response.map((answer: Answer) => ({
          ...answer,
          position: answer.position?.toString() || null
        }));
        setResponses(answers);
        // Initialiser l'ordre avec les indices des réponses
        setOrder(answers.map((_, index) => index));
      } catch (error) {
        console.error('Error fetching answers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [question.id]);

  useEffect(() => {
    if (selectedAnswer) {
      setOrder(selectedAnswer);
    }
  }, [selectedAnswer]);

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  if (!responses || responses.length === 0) {
    return <div className="text-center text-red-500">Aucune réponse disponible pour cette question.</div>;
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (isAnswerChecked) return;

    const newOrder = [...order];
    const currentIndex = newOrder.indexOf(index);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
      setOrder(newOrder);
      onAnswer(newOrder);
    }
  };

  return (
    <BaseQuestion
      question={question}
      onAnswer={onAnswer}
      isAnswerChecked={isAnswerChecked}
      selectedAnswer={selectedAnswer}
      showHint={showHint}
      timeRemaining={timeRemaining}
    >
      <div className="space-y-2">
        {order.map((responseIndex, index) => (
          <div
            key={responses[responseIndex].id}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
            <span className="flex-1">{responses[responseIndex].text}</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleMove(responseIndex, 'up')}
                disabled={isAnswerChecked || index === 0}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                title="Déplacer vers le haut"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleMove(responseIndex, 'down')}
                disabled={isAnswerChecked || index === order.length - 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                title="Déplacer vers le bas"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </BaseQuestion>
  );
};

export default Ordering; 