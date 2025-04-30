
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MultipleChoice } from './question-types/MultipleChoice';
import { TrueFalse } from './question-types/TrueFalse';
import { FillBlank } from './question-types/FillBlank';
import { Ordering } from './question-types/Ordering';
import { WordBank } from './question-types/WordBank';
import { Matching } from './question-types/Matching';
import { Flashcard } from './question-types/FlashCard';
import { AudioQuestion } from './question-types/audio/AudioQuestion';
import { Question as QuizQuestion } from '@/types/quiz';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface QuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: any) => void;
  showFeedback?: boolean;
}

export const Question: React.FC<QuestionProps> = ({ question, onAnswer, showFeedback = false }) => {
  // Format media URL
  const getMediaUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL}/${url.replace(/^\/+/, '')}`;
  };

  // Normalize question type for consistency
  const questionType = question.type ? question.type.toLowerCase() : '';
  
  const normalizedType = 
    questionType.includes('multiple') || questionType === 'choix multiples' ? 'choix multiples' :
    questionType.includes('true') || questionType.includes('vrai') ? 'vrai/faux' :
    questionType.includes('fill') || questionType.includes('remplir') ? 'remplir le champ vide' :
    questionType.includes('order') || questionType === 'rearrangement' ? 'rearrangement' :
    questionType.includes('match') || questionType === 'correspondance' ? 'correspondance' :
    questionType.includes('flash') || questionType === 'carte flash' ? 'carte flash' :
    questionType.includes('word') || questionType.includes('bank') || questionType === 'banque de mots' ? 'banque de mots' :
    questionType.includes('audio') || questionType === 'question audio' ? 'question audio' :
    question.type || 'choix multiples';

  const renderQuestion = () => {
    switch (normalizedType) {
      case 'choix multiples':
        return (
          <MultipleChoice
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case 'vrai/faux':
        return (
          <TrueFalse
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case 'remplir le champ vide':
        return (
          <FillBlank
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case 'rearrangement':
        return (
          <Ordering
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case 'banque de mots':
        return (
          <WordBank
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case 'correspondance':
        return (
          <Matching
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case 'carte flash':
        return (
          <Flashcard
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case 'question audio':
        return (
          <AudioQuestion
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      default:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Type de question non supporté</AlertTitle>
            <AlertDescription>
              Type de question non pris en charge: {question.type}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold mb-4">{question.text}</h3>
          {question.media_url && normalizedType !== 'question audio' && (
            <div className="flex justify-center mb-4">
              <img
                src={getMediaUrl(question.media_url)}
                alt="Question media"
                className="max-w-full h-auto rounded"
              />
            </div>
          )}
        </div>
        
        {renderQuestion()}
        
        {showFeedback && question.explication && (
          <Alert className="mt-4 bg-blue-50">
            <div className="font-medium">
              <strong>Explication:</strong> {question.explication}
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
