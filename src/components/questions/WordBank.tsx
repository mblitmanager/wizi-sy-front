import React, { useState, useEffect } from 'react';
import { Question, Response } from '@/types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical } from 'lucide-react';
import { questionService } from '@/services/api';

interface WordBankProps {
  question: Question;
  selectedAnswer: string;
  onAnswerSelect: (questionId: string, answerId: string) => void;
}

const WordBank: React.FC<WordBankProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect
}) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      try {
        const data = await questionService.getQuestionResponses(question.id);
        setResponses(data as Response[]);
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
      setLoading(false);
    };
    fetchResponses();
  }, [question.id]);

  const handleSelect = (answerId: string) => {
    onAnswerSelect(question.id, answerId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <div
          key={response.id}
          onClick={() => handleSelect(response.id)}
          className={`p-3 rounded-md cursor-pointer ${
            selectedAnswer === response.id ? 'bg-blue-100' : 'hover:bg-gray-50'
          }`}
        >
          {response.text}
        </div>
      ))}
    </div>
  );
};

export default WordBank; 