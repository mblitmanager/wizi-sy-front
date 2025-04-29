import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface RearrangementQuestionProps {
  question: Question;
  isAnswerSubmitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const RearrangementQuestion: React.FC<RearrangementQuestionProps> = ({
  question,
  isAnswerSubmitted,
  onAnswer,
}) => {
  const [rearrangedAnswers, setRearrangedAnswers] = useState<string[]>([]);

  // Initialiser l'ordre aléatoire au chargement
  React.useEffect(() => {
    if (question.answers) {
      const answers = question.answers.map(a => a.id);
      setRearrangedAnswers(answers.sort(() => Math.random() - 0.5));
    }
  }, [question.answers]);

  const moveAnswer = (index: number, direction: 'up' | 'down') => {
    if (isAnswerSubmitted) return;
    
    const newAnswers = [...rearrangedAnswers];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newAnswers.length) return;
    
    [newAnswers[index], newAnswers[newIndex]] = [newAnswers[newIndex], newAnswers[index]];
    setRearrangedAnswers(newAnswers);
  };

  const submitAnswer = () => {
    if (isAnswerSubmitted) return;

    const isCorrectOrder = rearrangedAnswers.every((answerId, index) => {
      return question.answers?.[index]?.id === answerId;
    });

    onAnswer('rearrangement', isCorrectOrder);
  };

  return (
    <div className="space-y-4">
      {rearrangedAnswers.map((answerId, index) => {
        const answer = question.answers?.find(a => a.id === answerId);
        if (!answer) return null;

        return (
          <div key={answerId} className="flex items-center space-x-2">
            <div className="flex-1 p-4 border rounded-lg">
              {answer.text}
            </div>
            <div className="flex flex-col">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveAnswer(index, 'up')}
                disabled={index === 0 || isAnswerSubmitted}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveAnswer(index, 'down')}
                disabled={index === rearrangedAnswers.length - 1 || isAnswerSubmitted}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
      <Button
        className="w-full mt-4"
        onClick={submitAnswer}
        disabled={isAnswerSubmitted}
      >
        Valider l'ordre
      </Button>
      {isAnswerSubmitted && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {question.answers?.map((a, index) => `${index + 1}. ${a.text}`).join('\n')}
          </p>
        </div>
      )}
    </div>
  );
};

export default RearrangementQuestion; 