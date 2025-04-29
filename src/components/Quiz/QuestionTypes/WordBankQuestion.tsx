import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';

interface WordBankQuestionProps {
  question: Question;
  isAnswerSubmitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const WordBankQuestion: React.FC<WordBankQuestionProps> = ({
  question,
  isAnswerSubmitted,
  onAnswer,
}) => {
  const [selectedWords, setSelectedWords] = useState<Record<string, string>>({});

  // Grouper les mots par bank_group
  const wordsByGroup = React.useMemo(() => {
    const groups: Record<string, typeof question.answers> = {};
    question.answers?.forEach(answer => {
      const group = answer.bankGroup || 'default';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(answer);
    });
    return groups;
  }, [question.answers]);

  const handleWordSelect = (wordId: string, group: string) => {
    if (isAnswerSubmitted) return;
    setSelectedWords(prev => ({
      ...prev,
      [group]: wordId
    }));
  };

  const submitAnswer = () => {
    if (isAnswerSubmitted) return;

    // Valider chaque sélection
    Object.entries(selectedWords).forEach(([group, wordId]) => {
      const word = question.answers?.find(w => w.id === wordId);
      if (word) {
        onAnswer(wordId, word.isCorrect ?? true);
      }
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(wordsByGroup).map(([group, words]) => (
        <div key={group} className="space-y-4">
          {group !== 'default' && (
            <h4 className="font-medium text-gray-700">{group}</h4>
          )}
          <div className="grid grid-cols-2 gap-2">
            {words.map(word => (
              <Button
                key={word.id}
                variant={selectedWords[group] === word.id ? 'default' : 'outline'}
                className={`w-full ${
                  isAnswerSubmitted
                    ? word.isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : ''
                }`}
                onClick={() => handleWordSelect(word.id, group)}
                disabled={isAnswerSubmitted}
              >
                {word.text}
              </Button>
            ))}
          </div>
        </div>
      ))}
      <Button
        className="w-full mt-4"
        onClick={submitAnswer}
        disabled={isAnswerSubmitted || Object.keys(selectedWords).length === 0}
      >
        Valider les sélections
      </Button>
      {isAnswerSubmitted && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {Object.entries(selectedWords).map(([group, wordId]) => {
              const word = question.answers?.find(w => w.id === wordId);
              return `${group}: ${word?.text} (${word?.isCorrect ? 'Correct' : 'Incorrect'})`;
            }).join('\n')}
          </p>
        </div>
      )}
    </div>
  );
};

export default WordBankQuestion; 