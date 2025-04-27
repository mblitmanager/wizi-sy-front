import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';

interface FillBlankProps {
  question: QuizQuestion;
  onAnswer: (answers: Record<string, string>) => void;
  showFeedback?: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
}));

const FeedbackIcon = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
}));

export const FillBlank: React.FC<FillBlankProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionParts, setQuestionParts] = useState<(string | { group: string })[]>([]);

  useEffect(() => {
    // Parse the question text to identify blanks
    const parts = parseQuestionText(question.text);
    setQuestionParts(parts);

    // Initialize answers object with empty strings
    const initialAnswers: Record<string, string> = {};
    question.blanks?.forEach(blank => {
      if (blank.bankGroup) {
        initialAnswers[blank.bankGroup] = '';
      }
    });
    setAnswers(initialAnswers);
  }, [question]);

  const parseQuestionText = (text: string): (string | { group: string })[] => {
    const parts: (string | { group: string })[] = [];
    const regex = /\{([^}]+)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push({ group: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const handleAnswerChange = (group: string, value: string) => {
    const newAnswers = { ...answers, [group]: value };
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const isCorrectAnswer = (group: string) => {
    if (!showFeedback) return undefined;
    const correctAnswer = question.blanks?.find(b => b.bankGroup === group);
    return correctAnswer && answers[group].toLowerCase() === correctAnswer.text.toLowerCase();
  };

  return (
    <StyledPaper>
      <Box>
        {questionParts.map((part, index) => {
          if (typeof part === 'string') {
            return <Typography key={index} component="span">{part}</Typography>;
          } else {
            const isCorrect = isCorrectAnswer(part.group);
            return (
              <Box key={index} component="span" display="inline-flex" alignItems="center">
                <StyledTextField
                  variant="outlined"
                  size="small"
                  value={answers[part.group] || ''}
                  onChange={(e) => handleAnswerChange(part.group, e.target.value)}
                  disabled={showFeedback}
                  error={showFeedback && !isCorrect}
                  sx={{
                    width: '150px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: showFeedback
                          ? isCorrect
                            ? 'success.main'
                            : 'error.main'
                          : 'inherit',
                      },
                    },
                  }}
                />
                {showFeedback && (
                  <FeedbackIcon>
                    {isCorrect ? (
                      <Check color="green" size={20} />
                    ) : (
                      <X color="red" size={20} />
                    )}
                  </FeedbackIcon>
                )}
              </Box>
            );
          }
        })}
      </Box>
      {showFeedback && (
        <Box mt={2}>
          {question.blanks?.map((blank, index) => (
            blank.bankGroup && !isCorrectAnswer(blank.bankGroup) && (
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
