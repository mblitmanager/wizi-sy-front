import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Check, X } from 'lucide-react';
import LanguageGame from '../../components/games/LanguageGame';

function LanguageLearning() {
  const [gameStarted, setGameStarted] = useState(false);

  const demoWords = [
    {
      id: '1',
      original: 'Hello',
      translation: 'Bonjour',
      audio: 'https://example.com/audio/bonjour.mp3'
    },
    {
      id: '2',
      original: 'Thank you',
      translation: 'Merci',
      audio: 'https://example.com/audio/merci.mp3'
    },
    {
      id: '3',
      original: 'Goodbye',
      translation: 'Au revoir',
      audio: 'https://example.com/audio/aurevoir.mp3'
    }
  ];

  const handleComplete = (score: number) => {
    console.log('Score final:', score);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Apprentissage des langues</h1>

      {!gameStarted ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Prêt à commencer ?</h2>
          <p className="text-gray-600 mb-6">
            Apprenez de nouveaux mots de manière interactive et amusante !
          </p>
          <button
            onClick={() => setGameStarted(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Commencer
          </button>
        </div>
      ) : (
        <LanguageGame words={demoWords} onComplete={handleComplete} />
      )}
    </div>
  );
}

export default LanguageLearning;