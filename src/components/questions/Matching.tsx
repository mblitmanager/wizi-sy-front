import React, { useState, useEffect } from 'react';
import { Question, Response } from '@/types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical } from 'lucide-react';
import { questionService } from '@/services/api';

interface MatchingProps {
  question: Question;
  selectedAnswer: string[] | null;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked: boolean;
  showHint?: boolean;
  timeRemaining?: number;
}

const Matching: React.FC<MatchingProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isAnswerChecked,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<string[]>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const fetchedResponses = await questionService.getQuestionResponses(question.id);
        setResponses(fetchedResponses as Response[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [question.id]);

  useEffect(() => {
    if (selectedAnswer && Array.isArray(selectedAnswer)) {
      setMatches(selectedAnswer);
    } else if (responses.length > 0) {
      // Initialiser avec les indices dans un ordre aléatoire
      const indices = responses.map((_, index) => index.toString());
      setMatches(indices.sort(() => Math.random() - 0.5));
    } else {
      // S'assurer que matches est toujours un tableau
      setMatches([]);
    }
  }, [selectedAnswer, responses]);

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  if (!responses || responses.length === 0) {
    return <div className="text-center text-red-500">Aucune réponse disponible pour cette question.</div>;
  }

  // Séparer les éléments et leurs correspondances
  // Assuming first half are items and second half are pairs
  const halfLength = Math.floor(responses.length / 2);
  const items = responses.slice(0, halfLength);
  const pairs = responses.slice(halfLength);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newMatches = [...matches];
    [newMatches[sourceIndex], newMatches[targetIndex]] = [newMatches[targetIndex], newMatches[sourceIndex]];
    setMatches(newMatches);
    onAnswerSelect(question.id, pairs[parseInt(newMatches[targetIndex])]?.id || '');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isMatchCorrect = (itemIndex: number, pairIndex: number) => {
    // For matching questions, we assume the correct match is at the same index
    return itemIndex === pairIndex;
  };

  return (
    <BaseQuestion
      question={question}
      onAnswerSelect={onAnswerSelect}
      isAnswerChecked={isAnswerChecked}
      selectedAnswer={selectedAnswer}
      showHint={showHint}
      timeRemaining={timeRemaining}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable={!isAnswerChecked}
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                isAnswerChecked
                  ? isMatchCorrect(index, parseInt(matches[index]))
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
          {matches.map((matchIndex, index) => (
            <div
              key={pairs[parseInt(matchIndex)]?.id || matchIndex}
              draggable={!isAnswerChecked}
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                isAnswerChecked
                  ? isMatchCorrect(index, parseInt(matchIndex))
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <GripVertical className="h-6 w-6 text-gray-400 mr-4" />
              <span className="flex-1">{pairs[parseInt(matchIndex)]?.text}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseQuestion>
  );
};

export default Matching; 