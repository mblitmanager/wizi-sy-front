import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Play, Pause, Volume2, VolumeX, Check, X, AlertTriangle } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioQuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: { id: string, text: string }) => void;
  showFeedback?: boolean;
}

export const AudioQuestion: React.FC<AudioQuestionProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Reset error state when component mounts or question changes
    setAudioError(false);
  }, [question]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio playback error:", error);
            setAudioError(true);
            setIsPlaying(false);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    const volumeValue = newValue[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleAnswer = (answerId: string) => {
    const answerText = question.answers?.find((a) => a.id === answerId)?.text || "";
    setSelectedAnswer(answerId);
    onAnswer(selectedAnswer ? [selectedAnswer] : []); // Send only the text of the selected answer
  };

  const isCorrectAnswer = (answerId: string) => {
    if (!showFeedback) return undefined;
    const answer = question.answers?.find(a => a.id === answerId);
    return answer?.isCorrect || answer?.is_correct === 1;
  };

  // Generate proper audio URL
  const audioUrl = question.audioUrl || question.media_url;

  // Déterminer l'URL complète utilisée
  const fullAudioUrl =
    typeof question.audioUrl === 'string' && question.audioUrl.startsWith('http')
      ? question.audioUrl
      : question.audioUrl
        ? `${import.meta.env.VITE_API_URL_MEDIA}/storage/${String(question.audioUrl)}`
        : '';

  // Debug : afficher l'URL complète de l'audio
  console.log('[DEBUG][AudioQuestion.tsx] fullAudioUrl:', fullAudioUrl);

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <div className="space-y-6">
          {audioUrl && (
            <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handlePlayPause}
                  disabled={audioError}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <audio
                  ref={audioRef}
                  src={fullAudioUrl}
                  onEnded={() => setIsPlaying(false)}
                  onError={() => {
                    setAudioError(true);
                    setIsPlaying(false);
                  }}
                />
              </div>

              <div className="flex-1 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleMuteToggle}
                  disabled={audioError}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    disabled={audioError}
                  />
                </div>
              </div>
            </div>
          )}

          {audioError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Impossible de charger le fichier audio. Veuillez continuer avec le test en lisant les options.
              </AlertDescription>
            </Alert>
          )}

          <RadioGroup 
            value={selectedAnswer || ''} 
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {question.answers?.map((answer) => {
              const isSelected = selectedAnswer === answer.id;
              const isCorrect = isCorrectAnswer(answer.id);
              const showCorrectIndicator = showFeedback && (isSelected || isCorrect);

              return (
                <div 
                  key={answer.id} 
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent transition-colors",
                    isSelected && !showFeedback && "bg-accent",
                    showFeedback && isSelected && isCorrect && "bg-green-50 border-green-200",
                    showFeedback && isSelected && !isCorrect && "bg-red-50 border-red-200",
                    showFeedback && !isSelected && isCorrect && "bg-green-50 border-green-200"
                  )}
                >
                  <RadioGroupItem 
                    value={answer.id} 
                    id={`audio-answer-${answer.id}`} 
                    disabled={showFeedback}
                  />
                  <Label 
                    htmlFor={`audio-answer-${answer.id}`}
                    className="flex-grow cursor-pointer text-base"
                  >
                    {answer.text}
                  </Label>
                  {showCorrectIndicator && (
                    <span className="flex items-center">
                      {isCorrect ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </span>
                  )}
                </div>
              );
            })}
          </RadioGroup>

          {showFeedback && selectedAnswer && (
            <div className="mt-4 text-sm">
              {isCorrectAnswer(selectedAnswer) ? (
                <p className="text-green-600 font-medium">Bonne réponse !</p>
              ) : (
                <p className="text-red-600 font-medium">
                  Réponse incorrecte. La bonne réponse était : {question.answers?.find(a => a.isCorrect || a.is_correct === 1)?.text}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
