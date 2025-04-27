import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';

interface TrueFalseProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  showFeedback?: boolean;
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const TrueFalse: React.FC<TrueFalseProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    onAnswer(answerId);
  };

  const isCorrectAnswer = (answer: { id: string; isCorrect?: boolean }) => {
    if (!showFeedback) return false;
    return answer.isCorrect;
  };

  return (
    <List>
      {question.answers?.map((answer) => (
        <StyledListItem key={answer.id} disablePadding>
          <ListItemButton
            onClick={() => handleAnswerSelect(answer.id)}
            selected={selectedAnswer === answer.id}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon>
              <Radio
                edge="start"
                checked={selectedAnswer === answer.id}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={answer.text} />
            {showFeedback && (
              <Box display="flex" alignItems="center">
                {isCorrectAnswer(answer) ? (
                  <Check color="green" size={20} />
                ) : (
                  selectedAnswer === answer.id && <X color="red" size={20} />
                )}
              </Box>
            )}
          </ListItemButton>
        </StyledListItem>
      ))}
    </List>
  );
};
