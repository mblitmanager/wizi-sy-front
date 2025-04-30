
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
    
    // Check if URL is absolute
    if (audioUrl.startsWith('http')) {
      return audioUrl;
    }
    
    // Make sure to use the correct API URL format
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    if (!apiBaseUrl) {
      console.error('VITE_API_URL environment variable is not defined');
    }
    
    // Return full URL with API base
    return `${apiBaseUrl}/${audioUrl.replace(/^\/+/, '')}`;
  };
  
  // Initialize selected answer if it exists already
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

  // Get answers with converted id to string if needed
  const getFormattedAnswers = () => {
    return question.answers?.map(answer => ({
      id: String(answer.id),
      text: answer.text,
      isCorrect: answer.isCorrect,
      is_correct: typeof answer.is_correct === 'number' ? answer.is_correct : null
    })) || [];
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
            answers={getFormattedAnswers()}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleAnswer}
            showFeedback={showFeedback}
            correctAnswers={question.correctAnswers?.map(String) || []}
          />

          {showFeedback && selectedAnswer && (
            <AudioFeedback 
              isCorrect={question.correctAnswers?.includes(selectedAnswer) || 
                        question.answers?.find(a => String(a.id) === selectedAnswer)?.isCorrect === true ||
                        question.answers?.find(a => String(a.id) === selectedAnswer)?.is_correct === 1}
              correctAnswerText={
                question.correctAnswers && question.correctAnswers.length > 0 
                  ? question.answers?.find(a => String(a.id) === String(question.correctAnswers?.[0]))?.text
                  : question.answers?.find(a => a.isCorrect || a.is_correct === 1)?.text
              }
            />
          )}
          
          {/* Debug info - remove in production */}
          {audioError && (
            <div className="mt-4 text-xs text-gray-500">
              <p>Audio URL: {getAudioUrl()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
