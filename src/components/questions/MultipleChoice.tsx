import React, { useState, useEffect } from 'react';
import { Question, Response } from '@/types/quiz';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { questionService } from '@/services/api';
import { Label } from '@/components/ui/label';

interface MultipleChoiceProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked?: boolean;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isAnswerChecked = false
}) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

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

  useEffect(() => {
    if (question.media_url) {
      setMediaUrl(question.media_url);
    }
  }, [question.media_url]);

  const handleSelect = (responseId: string) => {
    onAnswerSelect(question.id, responseId);
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">{question.text}</div>
      {mediaUrl && (
        <div className="my-4">
          <img src={mediaUrl} alt="Question media" className="max-w-full h-auto rounded-lg" />
        </div>
      )}
      <RadioGroup value={selectedAnswer || ''} onValueChange={handleSelect}>
        <div className="space-y-2">
          {responses.map((response) => (
            <div key={response.id} className="flex items-center space-x-2">
              <RadioGroupItem value={response.id} id={response.id} />
              <Label htmlFor={response.id}>{response.text}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
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

export default MultipleChoice;
