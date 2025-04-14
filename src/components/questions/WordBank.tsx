import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { Answer } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical } from 'lucide-react';
import { getReponsesByQuestion } from '../../api';

interface WordBankProps {
  question: Question;
  onAnswer: (answer: { [key: string]: string[] }) => void;
  isAnswerChecked: boolean;
  selectedAnswer: { [key: string]: string[] } | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const WordBank: React.FC<WordBankProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWords, setSelectedWords] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const data = await getReponsesByQuestion(question.id);
        setResponses(data.map(r => ({
          ...r,
          question_id: question.id,
          is_correct: true
        })) as Answer[]);
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
      setLoading(false);
    };
    fetchResponses();
  }, [question.id]);

  useEffect(() => {
    if (selectedAnswer) {
      setSelectedWords(selectedAnswer);
    } else {
      setSelectedWords({});
    }
  }, [selectedAnswer]);

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  if (!responses || responses.length === 0) {
    return <div className="text-center text-red-500">Aucune réponse disponible pour cette question.</div>;
  }

  const handleWordSelect = (word: string, group: string) => {
    if (isAnswerChecked) return;

    const newSelectedWords = { ...selectedWords };
    if (!newSelectedWords[group]) {
      newSelectedWords[group] = [];
    }

    if (newSelectedWords[group].includes(word)) {
      newSelectedWords[group] = newSelectedWords[group].filter(w => w !== word);
    } else {
      newSelectedWords[group].push(word);
    }

    setSelectedWords(newSelectedWords);
    onAnswer(newSelectedWords);
  };

  const groupedResponses = responses.reduce((groups: { [key: string]: Answer[] }, response) => {
    const group = response.bank_group || 'default';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(response);
    return groups;
  }, {});

  return (
    <BaseQuestion
      question={question}
      onAnswer={onAnswer}
      isAnswerChecked={isAnswerChecked}
      selectedAnswer={selectedAnswer}
      showHint={showHint}
      timeRemaining={timeRemaining}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedResponses).map(([group, words]) => (
          <div key={group} className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">{group}</h3>
            <div className="space-y-2">
              {words.map((word) => (
                <div
                  key={word.id}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedWords[group]?.includes(word.text) ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleWordSelect(word.text, group)}
                >
                  {word.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BaseQuestion>
  );
};

export default WordBank; 