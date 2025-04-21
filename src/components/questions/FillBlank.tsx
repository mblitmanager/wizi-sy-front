import { useState, useEffect } from 'react';
import { Question, Response } from '@/types/quiz';
import { questionService } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FillBlankProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked?: boolean;
}

const FillBlank: React.FC<FillBlankProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isAnswerChecked = false
}) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const fetchedResponses = await questionService.getQuestionResponses(question.id);
        setResponses(fetchedResponses as Response[]);
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    };
    fetchResponses();
  }, [question.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAnswerSelect(question.id, inputValue.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">{question.text}</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Entrez votre réponse..."
          className="w-full"
        />
        <Button type="submit" disabled={!inputValue.trim()}>
          Valider
        </Button>
      </form>
      {isAnswerChecked && (
        <div className="mt-4 p-4 rounded-lg bg-muted">
          <div className="font-medium">Réponse correcte:</div>
          <div>
            {responses.find(r => r.is_correct)?.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default FillBlank; 