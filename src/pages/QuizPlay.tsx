import React from 'react';
import { useParams } from 'react-router-dom';

function QuizPlay() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Quiz #{id}</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-600">Le contenu du quiz sera affiché ici.</p>
      </div>
    </div>
  );
}

export default QuizPlay;