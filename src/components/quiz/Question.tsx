import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { MultipleChoice } from './question-types/MultipleChoice';
import { TrueFalse } from './question-types/TrueFalse';
import { FillBlank } from './question-types/FillBlank';
import { Ordering } from './question-types/Ordering';
import { WordBank } from './question-types/WordBank';
import { Matching } from './question-types/Matching';
import { Flashcard } from './question-types/FlashCard';
import { AudioQuestion } from './question-types/AudioQuestion';
import { Question as QuizQuestion, QuestionType } from '@/types/quiz';

interface Answer {
  id: number;
  text: string;
  is_correct: number | null;
  position: number | null;
  match_pair: string | null;
  bank_group: string | null;
  flashcard_back: string | null;
  question_id: number;
}

export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  type: string;
  explication: string;
  points: string;
  astuce: string;
  media_url: string | null;
  reponse_correct: string | null;
  reponses: Answer[];
}

interface QuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: any) => void;
  showFeedback?: boolean;
}

export const Question: React.FC<QuestionProps> = ({ question, onAnswer, showFeedback = false }) => {
  const renderQuestion = () => {
    switch (question.type) {
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
          <Box>
            <Typography color="error">
              Type de question non pris en charge: {question.type}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, sm: 3 },
        mb: 3,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      <Box mb={3}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            wordBreak: 'break-word'
          }}
        >
          {question.text}
        </Typography>
        {question.media_url && (
          <Box 
            mb={2}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1
              }
            }}
          >
            {question.type === 'question audio' ? (
              <Box sx={{ width: '100%', maxWidth: '400px' }}>
                <audio controls style={{ width: '100%' }}>
                  <source src={question.media_url} type="audio/mpeg" />
                  Votre navigateur ne supporte pas l'élément audio.
                </audio>
              </Box>
            ) : (
              <img
                src={question.media_url}
                alt="Question media"
              />
            )}
          </Box>
        )}
      </Box>
      {renderQuestion()}
      {showFeedback && question.explication && (
        <Box 
          mt={3} 
          p={2} 
          bgcolor="info.light" 
          borderRadius={1}
          sx={{
            '& .MuiTypography-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        >
          <Typography variant="body2" color="info.contrastText">
            <strong>Explication:</strong> {question.explication}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}; 