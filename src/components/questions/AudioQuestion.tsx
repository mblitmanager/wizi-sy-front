import React, { useState, useRef, useEffect } from 'react';
import { Question, Response } from '@/types/quiz';
import { Play, Pause, Volume2 } from 'lucide-react';
import { questionService } from '@/services/api';

interface AudioQuestionProps {
  question: Question;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked: boolean;
  selectedAnswer: string | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const AudioQuestion: React.FC<AudioQuestionProps> = ({
  question,
  onAnswerSelect,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSelect = (responseId: string) => {
    if (!isAnswerChecked) {
      onAnswerSelect(question.id, responseId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">{question.text}</div>
      {question.media_url && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          <div className="flex-1">
            <audio
              ref={audioRef}
              src={question.media_url}
              onEnded={() => setIsPlaying(false)}
              className="w-full"
            />
          </div>
          <Volume2 className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <div className="space-y-2">
        {responses.map((response) => (
          <button
            key={response.id}
            onClick={() => handleSelect(response.id)}
            disabled={isAnswerChecked}
            className={`w-full p-4 text-left rounded-lg border transition-colors ${
              selectedAnswer === response.id
                ? 'bg-primary/10 border-primary'
                : 'bg-white hover:bg-muted/50'
            } ${isAnswerChecked && response.is_correct ? 'bg-green-100 border-green-500' : ''}`}
          >
            {response.text}
          </button>
        ))}
      </div>
      {isAnswerChecked && (
        <div className="mt-4 p-4 rounded-lg bg-muted">
          <div className="font-medium">Réponse correcte:</div>
          <div>{responses.find(r => r.is_correct)?.text}</div>
        </div>
      )}
    </div>
  );
};

export default AudioQuestion; 