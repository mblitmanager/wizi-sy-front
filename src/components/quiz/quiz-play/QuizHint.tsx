
import React from 'react';

interface QuizHintProps {
  hint: string | undefined;
  visible: boolean;
}

export function QuizHint({ hint, visible }: QuizHintProps) {
  if (!visible || !hint) return null;
  
  return (
    <div className="my-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900">
      <strong>Astuce :</strong> {hint}
    </div>
  );
}
