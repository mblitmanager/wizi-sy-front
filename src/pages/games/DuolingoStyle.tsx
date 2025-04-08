import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Volume2 } from 'lucide-react';

interface Question {
  id: string;
  type: 'choice' | 'write' | 'match';
  question: string;
  correctAnswer: string;
  options?: string[];
}

function DuolingoStyle() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const questions: Question[] = [
    {
      id: '1',
      type: 'choice',
      question: 'Comment dit-on "Bonjour" en anglais ?',
      correctAnswer: 'Hello',
      options: ['Hello', 'Goodbye', 'Thank you', 'Please']
    },
    // Add more questions here
  ];

  const handleAnswer = (selectedAnswer: string) => {
    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore(score + 1);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {questions[currentQuestion].question}
          </h2>
          {questions[currentQuestion].type === 'choice' && (
            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestion].options?.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                  disabled={showFeedback}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-0 left-0 right-0 p-4 text-center text-white ${
                isCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {isCorrect ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <X className="w-6 h-6" />
                )}
                <span className="font-medium">
                  {isCorrect ? 'Correct !' : 'Incorrect !'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DuolingoStyle;
