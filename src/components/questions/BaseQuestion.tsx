import React from 'react';
import { Question } from '../../types/quiz';

interface BaseQuestionProps {
  question: Question;
  onAnswer: (answer: unknown) => void;
  isAnswerChecked: boolean;
  selectedAnswer: unknown;
  showHint?: boolean;
  timeRemaining?: number;
  children?: React.ReactNode;
}

const BaseQuestion: React.FC<BaseQuestionProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining,
  children
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* En-tête de la question */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">{question.text}</h2>
          {question.points && (
            <p className="text-sm text-gray-600 mt-1">{question.points} points</p>
          )}
        </div>
        {timeRemaining !== undefined && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Temps restant</p>
            <p className="text-lg font-bold text-blue-600">{timeRemaining}s</p>
          </div>
        )}
      </div>

      {/* Media */}
      {question.media_url && (
        <div className="mb-4">
          {question.type === 'question audio' ? (
            <audio controls className="w-full">
              <source src={question.media_url} type="audio/mpeg" />
              Votre navigateur ne supporte pas l'élément audio.
            </audio>
          ) : (
            <img
              src={question.media_url}
              alt="Question media"
              className="w-full h-auto rounded-lg"
            />
          )}
        </div>
      )}

      {/* Contenu de la question */}
      {children}

      {/* Astuce */}
      {showHint && question.astuce && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Astuce :</span> {question.astuce}
          </p>
        </div>
      )}

      {/* Explication (après réponse) */}
      {isAnswerChecked && question.explication && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Explication :</span> {question.explication}
          </p>
        </div>
      )}
    </div>
  );
};

export default BaseQuestion; 