
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Question as QuizQuestion } from '@/types/quiz';
import { AudioPlayer } from './AudioPlayer';
import { AudioAnswerOptions } from './AudioAnswerOptions';
import { AudioFeedback } from './AudioFeedback';

interface AudioQuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  showFeedback?: boolean;
}

export const AudioQuestion: React.FC<AudioQuestionProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [audioError, setAudioError] = useState(false);
  
  // Format audio URL properly
  const getAudioUrl = () => {
    const audioUrl = question.audioUrl || question.media_url;
    if (!audioUrl) return '';
    
    // Si l'URL est déjà absolue, la retourner telle quelle
    if (audioUrl.startsWith('http')) {
      return audioUrl;
    }
    
    // Sinon, préfixer avec l'URL de l'API
    return `${import.meta.env.VITE_API_URL}/${audioUrl}`;
  };
  
  // Initialiser la réponse sélectionnée si elle existe déjà
  useEffect(() => {
    if (question.selectedAnswers) {
      if (Array.isArray(question.selectedAnswers) && question.selectedAnswers.length > 0) {
        setSelectedAnswer(question.selectedAnswers[0]);
      } else if (typeof question.selectedAnswers === 'string') {
        setSelectedAnswer(question.selectedAnswers);
      }
    }
  }, [question.selectedAnswers]);

  useEffect(() => {
    // Reset error state when component mounts or question changes
    setAudioError(false);
  }, [question]);

  const handleAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
    onAnswer(answerId);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <div className="space-y-6">
          <AudioPlayer 
            audioUrl={getAudioUrl()} 
            onError={() => setAudioError(true)}
          />

          <AudioAnswerOptions 
            answers={question.answers || []}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleAnswer}
            showFeedback={showFeedback}
            correctAnswers={question.correctAnswers}
          />

          {showFeedback && selectedAnswer && (
            <AudioFeedback 
              isCorrect={question.correctAnswers?.includes(Number(selectedAnswer)) || 
                         question.answers?.find(a => a.id === selectedAnswer)?.isCorrect === true ||
                         question.answers?.find(a => a.id === selectedAnswer)?.is_correct === 1}
              correctAnswerText={
                question.correctAnswers && question.correctAnswers.length > 0 
                  ? question.answers?.find(a => String(a.id) === String(question.correctAnswers?.[0]))?.text
                  : question.answers?.find(a => a.isCorrect || a.is_correct === 1)?.text
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
