import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioQuestionProps {
  question: Question;
  isAnswerSubmitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const AudioQuestion: React.FC<AudioQuestionProps> = ({
  question,
  isAnswerSubmitted,
  onAnswer,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAnswer = (answerId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answerId);
    const isCorrect = question.answers?.find(a => a.id === answerId)?.isCorrect;
    if (isCorrect !== undefined) {
      onAnswer(answerId, isCorrect);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <audio
          ref={audioRef}
          src={question.audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
          className="h-12 w-12"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Volume2 className="h-6 w-6 text-gray-500" />
      </div>

      <div className="space-y-4">
        {question.answers?.map((answer) => (
          <Button
            key={answer.id}
            variant={selectedAnswer === answer.id ? 'default' : 'outline'}
            className={`w-full ${
              isAnswerSubmitted
                ? answer.isCorrect
                  ? 'bg-green-100 border-green-500'
                  : selectedAnswer === answer.id
                  ? 'bg-red-100 border-red-500'
                  : ''
                : ''
            }`}
            onClick={() => handleAnswer(answer.id)}
            disabled={isAnswerSubmitted}
          >
            {answer.text}
          </Button>
        ))}
      </div>

      {isAnswerSubmitted && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {selectedAnswer && question.answers?.find(a => a.id === selectedAnswer)?.isCorrect
              ? "Bonne réponse !"
              : "Mauvaise réponse. La bonne réponse était :"}
          </p>
          {!question.answers?.find(a => a.id === selectedAnswer)?.isCorrect && (
            <p className="mt-2 font-medium">
              {question.answers?.find(a => a.isCorrect)?.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioQuestion; 