import React, { useState, useRef } from 'react';
import { Question } from '../../types';
import BaseQuestion from './BaseQuestion';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  isAnswerChecked: boolean;
  selectedAnswer: string | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const AudioQuestion: React.FC<AudioQuestionProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>(selectedAnswer || '');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (!isAnswerChecked) {
      setUserAnswer(answer);
      onAnswer(answer);
    }
  };

  return (
    <>
      <BaseQuestion
        question={question}
        onAnswer={onAnswer}
        isAnswerChecked={isAnswerChecked}
        selectedAnswer={selectedAnswer}
        showHint={showHint}
        timeRemaining={timeRemaining}
      />
      
      <div className="mt-6">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={isAnswerChecked}
            className={`p-3 rounded-full ${
              isAnswerChecked
                ? 'bg-gray-100 text-gray-400'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          <Volume2 className="h-6 w-6 text-gray-400" />
        </div>

        <audio
          ref={audioRef}
          src={question.media_url}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        <div className="space-y-4">
          {question.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={isAnswerChecked}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                isAnswerChecked
                  ? option === question.correct_answer
                    ? 'border-green-500 bg-green-50'
                    : userAnswer === option
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                  : userAnswer === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {isAnswerChecked && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Explication:</h3>
            <p className="text-blue-700">{question.explication}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AudioQuestion; 