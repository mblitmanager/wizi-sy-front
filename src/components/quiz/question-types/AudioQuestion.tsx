import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Check,
  X,
  AlertTriangle,
  Music,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAudioPlayer } from "@/use-case/hooks/quiz/question-audio/useAudioPlayer";
import { useAnswerHandling } from "@/use-case/hooks/quiz/question-audio/useAnswerHandling";
import { Question as QuizQuestion } from "@/types/quiz";
interface AudioQuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: { id: string; text: string }) => void;
  showFeedback?: boolean;
}

export const AudioQuestion: React.FC<AudioQuestionProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const { audioError } = useAudioPlayer(question);
  const { selectedAnswer, handleAnswer, isCorrectAnswer } = useAnswerHandling(
    question,
    onAnswer,
    showFeedback
  );

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <div className="space-y-3">
          <div className="p-2 sm:p-2 w-full bg-white rounded-xl shadow-none flex justify-center">
            <div className="flex items-center gap-3 sm:gap-4 w-full max-w-full sm:w-80">
              <Music className="w-6 h-6 sm:w-8 sm:h-8 text-wizi-accent" />
              <audio
                key={question.audioUrl}
                controls
                className="flex-1 min-w-[150px] max-w-full min-h-[40px] rounded-md shadow-inner bg-gray-100"
              >
                <source
                  src={`${VITE_API_URL}/media/stream/${question.audioUrl}`}
                />
                Votre navigateur ne supporte pas la lecture audio.
              </audio>
            </div>
          </div>

          {audioError && (
            <Alert variant="destructive" className="text-sm">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Erreur lors du chargement de l'audio. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          )}

          <RadioGroup
            value={selectedAnswer || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {question.answers?.map((answer) => (
              <div
                key={answer.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition border-0"
              >
                <RadioGroupItem value={answer.id} />
                <Label className="flex-1 text-xs md:text-sm">
                  {answer.text}
                </Label>
                {showFeedback && isCorrectAnswer(answer.id) !== undefined && (
                  <span>
                    {isCorrectAnswer(answer.id) ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                )}
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
