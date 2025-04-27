import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';

interface MultipleChoiceProps {
  question: QuizQuestion;
  onAnswer: (answer: string[]) => void;
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

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleAnswerSelect = (answerId: string) => {
    const newAnswers = selectedAnswers.includes(answerId)
      ? selectedAnswers.filter(id => id !== answerId)
      : [...selectedAnswers, answerId];
    
    setSelectedAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const isCorrectAnswer = (answer: { id: string; isCorrect?: boolean }) => {
    if (!showFeedback) return false;
    return answer.isCorrect;
  };

  const isSelectedAnswer = (answerId: string) => {
    return selectedAnswers.includes(answerId);
  };

  return (
    <List>
      {question.answers?.map((answer) => (
        <StyledListItem key={answer.id} disablePadding>
          <ListItemButton
            onClick={() => handleAnswerSelect(answer.id)}
            selected={isSelectedAnswer(answer.id)}
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
              <Checkbox
                edge="start"
                checked={isSelectedAnswer(answer.id)}
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
                  isSelectedAnswer(answer.id) && <X color="red" size={20} />
                )}
              </Box>
            )}
          </ListItemButton>
        </StyledListItem>
      ))}
    </List>
  );
};
