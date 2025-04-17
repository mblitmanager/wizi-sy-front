
import React, { useState, useEffect } from 'react';
import { Question, Answer } from '@/types/quiz';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { quizAPI } from '@/api';

interface MultipleChoiceProps {
  question: Question;
  onAnswer: (answer: number) => void;
  isAnswerChecked: boolean;
  selectedAnswer: number | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining,
}) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true);
        const fetchedAnswers = await quizAPI.getReponsesByQuestion(question.id);
        setAnswers(fetchedAnswers);
      } catch (error) {
        console.error('Failed to fetch answers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [question.id]);

  const handleSelect = (answerId: string) => {
    if (isAnswerChecked) return;
    onAnswer(Number(answerId));
  };

  if (loading) {
    return <div>Chargement des réponses...</div>;
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 my-4">
      <div className="mb-4 font-medium text-gray-800 font-montserrat">
        {question.text}
      </div>
      
      {question.media && question.media.type === 'image' && (
        <div className="mb-4">
          <img 
            src={question.media.url} 
            alt="Question illustration" 
            className="max-w-full mx-auto rounded-lg" 
          />
        </div>
      )}
      
      <RadioGroup 
        value={selectedAnswer?.toString()} 
        onValueChange={handleSelect}
        disabled={isAnswerChecked}
        className="space-y-2"
      >
        {answers.map((answer) => (
          <div 
            key={answer.id}
            className={`p-3 rounded-md cursor-pointer transition-colors
              ${String(selectedAnswer) === answer.id 
                ? isAnswerChecked 
                  ? answer.is_correct === 1 
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
                : isAnswerChecked && answer.is_correct === 1
                  ? 'bg-green-50 border border-green-200'
                  : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
              }`}
          >
            <div className="flex items-start">
              <RadioGroupItem 
                value={answer.id} 
                id={`answer-${answer.id}`} 
                className="mt-0.5"
              />
              <label 
                htmlFor={`answer-${answer.id}`}
                className="ml-2 text-gray-700 cursor-pointer font-roboto"
              >
                {answer.text}
              </label>
            </div>
          </div>
        ))}
      </RadioGroup>
      
      {showHint && question.astuce && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
          <p className="text-amber-800 text-sm font-nunito">
            <strong>Indice:</strong> {question.astuce}
          </p>
        </div>
      )}
      
      {isAnswerChecked && question.explication && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-blue-800 text-sm font-nunito">
            <strong>Explication:</strong> {question.explication}
          </p>
        </div>
      )}
    </div>
  );
};

export default MultipleChoice;
