
import React from 'react';

interface AudioFeedbackProps {
  isCorrect: boolean | undefined;
  correctAnswerText?: string;
}

export const AudioFeedback: React.FC<AudioFeedbackProps> = ({
  isCorrect,
  correctAnswerText
}) => {
  if (isCorrect === undefined) return null;
  
  return (
    <div className="mt-4 text-sm">
      {isCorrect ? (
        <p className="text-green-600 font-medium">Bonne réponse !</p>
      ) : (
        <p className="text-red-600 font-medium">
          Réponse incorrecte. La bonne réponse était : {correctAnswerText || "Non spécifiée"}
        </p>
      )}
    </div>
  );
};
