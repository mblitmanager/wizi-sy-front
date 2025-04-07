import React from 'react';

function QuizList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Quiz disponibles</h1>
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Liste des quiz à venir</h2>
          <p className="mt-2 text-gray-600">Revenez plus tard pour voir les quiz disponibles.</p>
        </div>
      </div>
    </div>
  );
}

export default QuizList;