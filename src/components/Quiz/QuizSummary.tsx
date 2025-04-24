import React from 'react';
import { Question } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizSummaryProps {
  questions: Question[];
  userAnswers: Record<string, string[]>;
  correctAnswers: Record<string, string[]>;
}

const QuizSummary: React.FC<QuizSummaryProps> = ({ questions, userAnswers, correctAnswers }) => {
  const getAnswerText = (questionId: string, answerId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return '';

    switch (question.type) {
      case 'choix multiples':
      case 'vrai/faux':
      case 'question audio':
        return question.answers?.find(a => a.id === answerId)?.text || '';
      case 'remplir le champ vide':
        return question.blanks?.find(b => b.id === answerId)?.text || '';
      case 'banque de mots':
        return question.wordbank?.find(w => w.id === answerId)?.text || '';
      case 'correspondance':
        return question.matching?.find(m => m.id === answerId)?.matchPair || '';
      default:
        return '';
    }
  };

  const isAnswerCorrect = (questionId: string, answerId: string) => {
    return correctAnswers[questionId]?.includes(answerId) || false;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Résumé du Quiz</h2>
      
      {questions.map((question, index) => (
        <Card key={question.id} className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {userAnswers[question.id]?.every(answerId => 
                  correctAnswers[question.id]?.includes(answerId)
                ) ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  Question {index + 1}: {question.text}
                </h3>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Votre réponse :</p>
                    <div className="mt-1 space-y-1">
                      {userAnswers[question.id]?.map(answerId => (
                        <div
                          key={answerId}
                          className={`p-2 rounded ${
                            isAnswerCorrect(question.id, answerId)
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {getAnswerText(question.id, answerId)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {!userAnswers[question.id]?.every(answerId => 
                    correctAnswers[question.id]?.includes(answerId)
                  ) && (
                    <div>
                      <p className="text-sm text-gray-600">Bonne réponse :</p>
                      <div className="mt-1 space-y-1">
                        {correctAnswers[question.id]?.map(answerId => (
                          <div
                            key={answerId}
                            className="p-2 rounded bg-green-50 text-green-700"
                          >
                            {getAnswerText(question.id, answerId)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuizSummary; 