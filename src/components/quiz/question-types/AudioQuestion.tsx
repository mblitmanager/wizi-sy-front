
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useAnswerHandling } from '@/use-case/hooks/quiz/question-audio/useAnswerHandling';
import { useAudioPlayer } from '@/use-case/hooks/quiz/question-audio/useAudioPlayer';

interface Option {
  id: string;
  text: string;
}

interface AudioQuestionProps {
  question: {
    id: string;
    texte: string;
    fichier_audio: string;
    options?: Option[];
  };
  onAnswer: (answer: any) => void;
  showFeedback?: boolean;
}

export const AudioQuestion = ({ question, onAnswer, showFeedback = false }: AudioQuestionProps) => {
  const { isPlaying, togglePlay, audioRef, duration, currentTime, formatTime } = useAudioPlayer();
  const { selectedOptions, handleOptionClick, checkIsSelected } = useAnswerHandling(
    question.id, 
    onAnswer
  );

  const options = question.options || [];
  
  // If options is empty or not properly formatted, create formatted options from the question.reponses
  const formattedOptions = options.length > 0 
    ? options 
    : question.reponses?.map((text: string, index: number) => ({
        id: `option-${index}`,
        text: text
      })) || [];

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium mb-2">{question.texte}</h3>
        
        <div className="bg-white p-3 rounded-md shadow-sm flex items-center space-x-4 mb-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={togglePlay} 
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary-dark text-white"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all" 
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <Volume2 className="h-5 w-5 text-gray-400" />
        </div>
        
        <audio ref={audioRef} src={question.fichier_audio} />
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium">Sélectionnez la bonne réponse:</h4>
        {formattedOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option)}
            className={`w-full text-left p-3 rounded-md border transition-all ${
              checkIsSelected(option.id)
                ? 'bg-primary/10 border-primary'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};
