import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';

interface WordBankProps {
  question: QuizQuestion;
  onAnswer: (answers: Record<string, string>) => void;
  showFeedback?: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StyledChip = styled(Chip)<{ isSelected?: boolean; isCorrect?: boolean }>(
  ({ theme, isSelected, isCorrect }) => ({
    margin: theme.spacing(0.5),
    cursor: isSelected ? 'default' : 'pointer',
    backgroundColor: isSelected
      ? isCorrect
        ? theme.palette.success.light
        : theme.palette.error.light
      : theme.palette.background.paper,
    '&:hover': {
      backgroundColor: isSelected
        ? undefined
        : theme.palette.action.hover,
    },
  })
);

export const WordBank: React.FC<WordBankProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [selectedWords, setSelectedWords] = useState<Record<string, string>>({});
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  useEffect(() => {
    // Initialiser les mots disponibles
    const words = question.answers?.map(answer => answer.text) || [];
    setAvailableWords(words.sort(() => Math.random() - 0.5));
    
    // Initialiser les réponses vides
    const initialAnswers: Record<string, string> = {};
    question.blanks?.forEach(blank => {
      if (blank.bankGroup) {
        initialAnswers[blank.bankGroup] = '';
      }
    });
    setSelectedWords(initialAnswers);
  }, [question]);

  const handleWordSelect = (word: string, group: string) => {
    if (showFeedback) return;

    const newSelectedWords = { ...selectedWords };
    newSelectedWords[group] = word;
    setSelectedWords(newSelectedWords);
    onAnswer(newSelectedWords);
  };

  const isCorrectAnswer = (group: string, word: string) => {
    if (!showFeedback) return undefined;
    const correctAnswer = question.blanks?.find(b => b.bankGroup === group);
    return correctAnswer && word.toLowerCase() === correctAnswer.text.toLowerCase();
  };

  const isWordUsed = (word: string) => {
    return Object.values(selectedWords).includes(word);
  };

  return (
    <StyledPaper>
      <Box>
        {question.blanks?.map((blank, index) => (
          <Box key={index} mb={2}>
            <Typography variant="body1" component="span">
              {blank.bankGroup}:
            </Typography>
            <Box display="inline-flex" alignItems="center" ml={1}>
              {selectedWords[blank.bankGroup || ''] ? (
                <StyledChip
                  label={selectedWords[blank.bankGroup || '']}
                  onDelete={showFeedback ? undefined : () => {
                    const newSelectedWords = { ...selectedWords };
                    delete newSelectedWords[blank.bankGroup || ''];
                    setSelectedWords(newSelectedWords);
                    onAnswer(newSelectedWords);
                  }}
                  isSelected={true}
                  isCorrect={showFeedback ? isCorrectAnswer(blank.bankGroup || '', selectedWords[blank.bankGroup || '']) : undefined}
                />
              ) : (
                <Typography variant="body1" color="textSecondary">
                  Sélectionnez un mot
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <Box mt={3}>
        <Typography variant="subtitle2" gutterBottom>
          Mots disponibles:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {availableWords.map((word, index) => (
            <StyledChip
              key={index}
              label={word}
              onClick={() => {
                const emptyGroup = question.blanks?.find(
                  blank => !selectedWords[blank.bankGroup || '']
                );
                if (emptyGroup) {
                  handleWordSelect(word, emptyGroup.bankGroup || '');
                }
              }}
              disabled={isWordUsed(word) || showFeedback}
            />
          ))}
        </Stack>
      </Box>

      {showFeedback && (
        <Box mt={2}>
          {question.blanks?.map((blank, index) => (
            blank.bankGroup && !isCorrectAnswer(blank.bankGroup, selectedWords[blank.bankGroup]) && (
              <Typography key={index} color="error" variant="body2">
                La réponse correcte pour {blank.bankGroup} était : {blank.text}
              </Typography>
            )
          ))}
        </Box>
      )}
    </StyledPaper>
  );
};
