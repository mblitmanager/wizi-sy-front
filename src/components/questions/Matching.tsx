import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { Answer } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical } from 'lucide-react';
import { quizService } from '../../services/quizService';

interface MatchingProps {
  question: Question;
  onAnswer: (answer: number[]) => void;
  isAnswerChecked: boolean;
  selectedAnswer: number[] | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const Matching: React.FC<MatchingProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<number[]>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const fetchedResponses = await quizService.getQuizAnswers(question.id);
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
    if (selectedAnswer && Array.isArray(selectedAnswer)) {
      setMatches(selectedAnswer);
    } else if (responses.length > 0) {
      // Initialiser avec les indices dans un ordre aléatoire
      const indices = responses.map((_, index) => index);
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
  const items = responses.filter(r => !r.match_pair);
  const pairs = responses.filter(r => r.match_pair);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newMatches = [...matches];
    [newMatches[sourceIndex], newMatches[targetIndex]] = [newMatches[targetIndex], newMatches[sourceIndex]];
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isMatchCorrect = (itemIndex: number, pairIndex: number) => {
    const item = items[itemIndex];
    const pair = pairs[pairIndex];
    return item && pair && item.text === pair.match_pair;
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
                  ? isMatchCorrect(index, matches[index])
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
              key={pairs[matchIndex]?.id || matchIndex}
              draggable={!isAnswerChecked}
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                isAnswerChecked
                  ? isMatchCorrect(index, matchIndex)
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <GripVertical className="h-6 w-6 text-gray-400 mr-4" />
              <span className="flex-1">{pairs[matchIndex]?.text}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseQuestion>
  );
};

export default Matching; 