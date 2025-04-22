import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';
import { GripVertical } from 'lucide-react';

interface MatchingQuestionProps {
  question: Question;
  isAnswerSubmitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  isAnswerSubmitted,
  onAnswer,
}) => {
  const [matches, setMatches] = useState<Record<string, string>>({});

  // Séparer les éléments à associer et leurs correspondances
  const { items, pairs } = React.useMemo(() => {
    const items: typeof question.answers = [];
    const pairs: typeof question.answers = [];

    question.answers?.forEach(answer => {
      if (answer.matchPair) {
        pairs.push(answer);
      } else {
        items.push(answer);
      }
    });

    return { items, pairs };
  }, [question.answers]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDrop = (e: React.DragEvent, pairId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    setMatches(prev => ({
      ...prev,
      [itemId]: pairId
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const submitAnswer = () => {
    if (isAnswerSubmitted) return;

    // Valider chaque correspondance
    Object.entries(matches).forEach(([itemId, pairId]) => {
      const item = items.find(i => i.id === itemId);
      const isCorrect = item?.matchPair === pairId;
      onAnswer(itemId, isCorrect);
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Éléments à associer :</h4>
          {items.map(item => (
            <div
              key={item.id}
              draggable={!isAnswerSubmitted}
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                isAnswerSubmitted
                  ? matches[item.id] && item.matchPair === matches[item.id]
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <GripVertical className="h-6 w-6 text-gray-400 mr-4" />
              <span className="flex-1">{item.text}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Correspondances :</h4>
          {pairs.map(pair => (
            <div
              key={pair.id}
              onDrop={(e) => handleDrop(e, pair.id)}
              onDragOver={handleDragOver}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isAnswerSubmitted
                  ? Object.entries(matches).find(([_, p]) => p === pair.id)?.[0] === pair.matchPair
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {pair.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          className="w-full max-w-md"
          onClick={submitAnswer}
          disabled={isAnswerSubmitted || Object.keys(matches).length !== items.length}
        >
          Valider les correspondances
        </Button>
      </div>

      {isAnswerSubmitted && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {Object.entries(matches).map(([itemId, pairId]) => {
              const item = items.find(i => i.id === itemId);
              const pair = pairs.find(p => p.id === pairId);
              const isCorrect = item?.matchPair === pairId;
              return `${item?.text} → ${pair?.text} (${isCorrect ? 'Correct' : 'Incorrect'})`;
            }).join('\n')}
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchingQuestion; 