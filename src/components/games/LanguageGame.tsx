import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Volume2 } from 'lucide-react';

interface Word {
  id: string;
  original: string;
  translation: string;
  audio?: string;
}

interface LanguageGameProps {
  words: Word[];
  onComplete: (score: number) => void;
}

function LanguageGame({ words, onComplete }: LanguageGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentWord = words[currentIndex];
  const options = React.useMemo(() => {
    const incorrect = words
      .filter(w => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.translation);
    
    return [...incorrect, currentWord.translation]
      .sort(() => Math.random() - 0.5);
  }, [currentIndex, words, currentWord]);

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer);
    const isCorrect = answer === currentWord.translation;
    
    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
        onComplete(score);
      }
    }, 1000);
  };

  const playAudio = () => {
    if (currentWord.audio) {
      new Audio(currentWord.audio).play();
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      {!showResult ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>

          {/* Word Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                {currentIndex + 1} / {words.length}
              </span>
              {currentWord.audio && (
                <button
                  onClick={playAudio}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Volume2 className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-8">{currentWord.original}</h2>
            
            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedOption !== null}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedOption === option
                      ? option === currentWord.translation
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Résultat Final</h2>
          <p className="text-4xl font-bold text-blue-600 mb-6">
            {score} / {words.length}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageGame;
