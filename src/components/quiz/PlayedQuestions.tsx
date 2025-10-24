import React from 'react';

interface PlayedQuestion {
  question_id: number | string;
  selectedAnswers: Array<number | string>;
}

interface Question {
  id: number | string;
  text: string;
  reponses?: Array<{
    id: number | string;
    text: string;
    isCorrect?: boolean;
  }>;
}

export default function PlayedQuestions({
  playedQuestions,
  questions,
}: {
  playedQuestions: PlayedQuestion[];
  questions: Question[];
}) {
  if (!playedQuestions || playedQuestions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="text-gray-600">Aucune question jouée disponible</div>
        </div>
      </div>
    );
  }

  const questionMap = new Map<string | number, Question>();
  questions.forEach((q) => questionMap.set(q.id, q));

  return (
    <div className="max-w-6xl mx-auto space-y-3">
      <h3 className="text-lg font-semibold">Questions jouées ({playedQuestions.length})</h3>
      {playedQuestions.map((pq) => {
        const q = questionMap.get(pq.question_id);
        const selected = pq.selectedAnswers || [];
        const correctAnswers = (q?.reponses || []).filter((r) => r.isCorrect).map((r) => r.text);
        const selectedTexts = (q?.reponses || []).filter((r) => selected.includes(r.id)).map((r) => r.text);
        const isCorrect = correctAnswers.length > 0 && selectedTexts.some((s) => correctAnswers.includes(s));

        return (
          <div key={String(pq.question_id)} className="p-4 border rounded-md bg-white shadow-sm">
            <div className="flex items-start gap-3">
              <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isCorrect ? '✓' : '✕'}
              </div>
              <div className="flex-1">
                <div className="font-medium">{q?.text || 'Question inconnue'}</div>
                <div className="text-sm text-gray-600 mt-2">
                  <div>
                    <strong>Votre réponse :</strong> {selectedTexts.length ? selectedTexts.join(', ') : 'Aucune réponse'}
                  </div>
                  {!isCorrect && (
                    <div className="mt-1 text-green-700">
                      <strong>Bonne réponse :</strong> {correctAnswers.length ? correctAnswers.join(', ') : 'Non disponible'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
