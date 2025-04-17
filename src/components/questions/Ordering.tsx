import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../../types';
import BaseQuestion from './BaseQuestion';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { getReponsesByQuestion } from '../../api';

interface OrderingProps {
  question: Question;
  onAnswer: (answer: number[]) => void;
  isAnswerChecked: boolean;
  selectedAnswer: number[] | null;
  showHint?: boolean;
  timeRemaining?: number;
}

interface OrderingAnswer extends Answer {
  position?: number;
}

const Ordering: React.FC<OrderingProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<OrderingAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const fetchedResponses = await getReponsesByQuestion(question.id);
        setResponses(fetchedResponses);
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [question.id]);

  useEffect(() => {
    if (selectedAnswer) {
      setOrder(selectedAnswer);
    } else if (responses.length > 0) {
      // Initialiser avec les indices dans un ordre aléatoire
      const indices = responses.map((_, index) => index);
      setOrder(indices.sort(() => Math.random() - 0.5));
    }
  }, [selectedAnswer, responses]);

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  if (!responses || responses.length === 0) {
    return <div className="text-center text-red-500">Aucune réponse disponible pour cette question.</div>;
  }

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (isAnswerChecked) return;
    const newOrder = [...order];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setOrder(newOrder);
    onAnswer(newOrder);
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      handleMove(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < order.length - 1) {
      handleMove(index, index + 1);
    }
  };

  // Obtenir l'ordre correct basé sur le champ position
  const correctOrder = [...responses]
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map(r => responses.findIndex(resp => resp.id === r.id));

  return (
    <BaseQuestion
      question={question}
      onAnswer={onAnswer}
      isAnswerChecked={isAnswerChecked}
      selectedAnswer={selectedAnswer}
      showHint={showHint}
      timeRemaining={timeRemaining}
    >
      <div className="space-y-4">
        {order.map((index, position) => (
          <div
            key={responses[index].id}
            className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
              isAnswerChecked
                ? correctOrder[position] === index
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <GripVertical className="h-6 w-6 text-gray-400 mr-4" />
            <span className="flex-1">{responses[index].text}</span>
            {!isAnswerChecked && (
              <div className="flex space-x-2">
                <button
                  onClick={() => moveUp(position)}
                  disabled={position === 0}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  title="Déplacer vers le haut"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
                <button
                  onClick={() => moveDown(position)}
                  disabled={position === order.length - 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  title="Déplacer vers le bas"
                >
                  <ArrowDown className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAnswerChecked && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Ordre correct :</h3>
          {correctOrder.map((index, position) => (
            <div key={position} className="text-blue-700">
              {position + 1}. {responses[index].text}
            </div>
          ))}
        </div>
      )}
    </BaseQuestion>
  );
};

export default Ordering; 