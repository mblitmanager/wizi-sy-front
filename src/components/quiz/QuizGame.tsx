import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';
import type { Question } from '../../types';

interface QuizGameProps {
  questions: Question[];
  timeLimit?: number; // in seconds
  onComplete: (score: number, answers: Record<string, string[]>) => void;
}

function QuizGame({ questions, timeLimit = 0, onComplete }: QuizGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (timeLimit > 0 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLimit, timeLeft]);

  const handleAnswer = (questionId: string, selectedAnswers: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswers
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const score = questions.reduce((acc, question) => {
      const userAnswers = answers[question.id] || [];
      const isCorrect = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.every(a => userAnswers.includes(a)) &&
          userAnswers.length === question.correctAnswer.length
        : userAnswers[0] === question.correctAnswer;
      return isCorrect ? acc + 1 : acc;
    }, 0);
    onComplete(score, answers);
  };

  const currentQuestion = questions[currentIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          Question {currentIndex + 1} sur {questions.length}
        </div>
        {timeLimit > 0 && (
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>

        {currentQuestion.media && (
          <div className="mb-6">
            {currentQuestion.media.type === 'image' ? (
              <img
                src={currentQuestion.media.url}
                alt="Question"
                className="max-w-full rounded-lg"
              />
            ) : (
              <video
                src={currentQuestion.media.url}
                controls
                className="max-w-full rounded-lg"
              />
            )}
          </div>
        )}

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                const isMultiple = Array.isArray(currentQuestion.correctAnswer);
                const currentAnswers = answers[currentQuestion.id] || [];
                
                if (isMultiple) {
                  const newAnswers = currentAnswers.includes(option)
                    ? currentAnswers.filter(a => a !== option)
                    : [...currentAnswers, option];
                  handleAnswer(currentQuestion.id, newAnswers);
                } else {
                  handleAnswer(currentQuestion.id, [option]);
                }
              }}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                (answers[currentQuestion.id] || []).includes(option)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentIndex(i => i - 1)}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-gray-600 disabled:opacity-50"
          >
            Précédent
          </button>
          
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(i => i + 1)}
              disabled={!answers[currentQuestion.id]}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !answers[currentQuestion.id]}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Terminer
            </button>
          )}
        </div>
      </div>

      {currentQuestion.explanation && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <p className="text-sm text-yellow-800">{currentQuestion.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizGame;
