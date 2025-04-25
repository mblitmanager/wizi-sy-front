import { Card } from "@/components/ui/card";
import type { Question } from "@/types/quiz";
import { CheckCircle2, XCircle, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AudioQuestionProps {
  question: Question;
  onAnswer: (value: string) => void;
}

export function AudioQuestion({ question, onAnswer }: AudioQuestionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

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

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowFeedback(true);
    onAnswer(answerId);
  };

  const getAnswerStatus = (answerId: string) => {
    if (!showFeedback) return null;
    const answer = question.answers?.find(a => a.id === answerId);
    if (!answer) return null;
    return answer.isCorrect ? 'correct' : 'incorrect';
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium leading-relaxed">
        {question.text}
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
            <div className={`
              absolute inset-0 rounded-full
              ${isPlaying ? 'animate-pulse' : ''}
            `} />
            <button
              onClick={handlePlayPause}
              className={`
                w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center
                hover:bg-primary/90 transition-all duration-300
                ${isPlaying ? 'scale-105' : ''}
              `}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <label htmlFor="volume" className="sr-only">Volume</label>
              <input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-32"
                aria-label="Volume control"
                aria-valuetext={`${Math.round(volume * 100)}%`}
              />
              <span className="text-sm text-muted-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={question.audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </Card>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Sélectionnez votre réponse :
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {question.answers?.map((answer) => {
            const status = getAnswerStatus(answer.id);
            const isSelected = selectedAnswer === answer.id;

            return (
              <Card
                key={answer.id}
                className={`
                  p-4 cursor-pointer transition-all duration-300
                  ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:bg-gray-50'}
                  ${status === 'correct' ? 'bg-green-50 border-green-500' : ''}
                  ${status === 'incorrect' ? 'bg-red-50 border-red-500' : ''}
                  ${isSelected ? 'scale-105' : ''}
                `}
                onClick={() => handleAnswerSelect(answer.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleAnswerSelect(answer.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${status === 'correct' ? 'bg-green-100 text-green-600' : ''}
                    ${status === 'incorrect' ? 'bg-red-100 text-red-600' : ''}
                    ${!status && isSelected ? 'bg-primary/10 text-primary' : ''}
                    ${!status && !isSelected ? 'bg-gray-100 text-gray-500' : ''}
                  `}>
                    {status === 'correct' ? (
                      <CheckCircle2 className="h-5 w-5 animate-bounce-once" />
                    ) : status === 'incorrect' ? (
                      <XCircle className="h-5 w-5 animate-shake" />
                    ) : (
                      <span className="font-medium">{answer.text[0]}</span>
                    )}
                  </div>
                  <span className="flex-1">{answer.text}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {showFeedback && (
        <div className="text-center text-sm text-muted-foreground">
          {selectedAnswer && question.answers?.find(a => a.id === selectedAnswer)?.isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Bonne réponse !</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>Essayez encore !</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
