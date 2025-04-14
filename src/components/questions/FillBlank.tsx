import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { Answer } from '../../types/quiz';
import BaseQuestion from './BaseQuestion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { getReponsesByQuestion } from '../../api';

interface FillBlankProps {
  question: Question;
  onAnswer: (answer: { [key: string]: string }) => void;
  isAnswerChecked: boolean;
  selectedAnswer: { [key: string]: string } | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const FillBlank: React.FC<FillBlankProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const fetchedResponses = await getReponsesByQuestion(question.id);
        setResponses(fetchedResponses.map(r => ({
          ...r,
          question_id: question.id,
          is_correct: true
        })) as Answer[]);
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
      setInputValues(selectedAnswer);
    } else {
      const initialValues: { [key: string]: string } = {};
      responses.forEach(r => {
        if (r.bank_group) {
          initialValues[r.bank_group] = '';
        }
      });
      setInputValues(initialValues);
    }
  }, [selectedAnswer, responses]);

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  if (!responses || responses.length === 0) {
    return <div className="text-center text-red-500">Aucune réponse disponible pour cette question.</div>;
  }

  // Grouper les réponses par bank_group
  const groupedResponses = responses.reduce((groups: { [key: string]: Answer[] }, response) => {
    const group = response.bank_group || 'default';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(response);
    return groups;
  }, {});

  const handleInputChange = (group: string, value: string) => {
    if (isAnswerChecked) return;
    
    const newInputValues = { ...inputValues, [group]: value };
    setInputValues(newInputValues);
    onAnswer(newInputValues);
  };

  const isAnswerCorrect = (group: string) => {
    const correctAnswer = responses.find(r => r.bank_group === group && r.is_correct)?.text;
    return correctAnswer && inputValues[group]?.toLowerCase() === correctAnswer.toLowerCase();
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
      <div className="space-y-4">
        {Object.entries(groupedResponses).map(([group, answers]) => (
          <div key={group} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {group === 'default' ? 'Réponse' : `Trou ${group}`}
            </label>
            <input
              type="text"
              value={inputValues[group] || ''}
              onChange={(e) => handleInputChange(group, e.target.value)}
              disabled={isAnswerChecked}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                isAnswerChecked
                  ? isAnswerCorrect(group)
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              placeholder="Entrez votre réponse..."
            />
            {isAnswerChecked && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {isAnswerCorrect(group) ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
            )}
            {isAnswerChecked && !isAnswerCorrect(group) && (
              <div className="mt-2 text-sm text-red-600">
                Réponse correcte : {answers.find(a => a.is_correct)?.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </BaseQuestion>
  );
};

export default FillBlank; 