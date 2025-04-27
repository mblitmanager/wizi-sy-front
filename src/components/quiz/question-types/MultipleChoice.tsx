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
  '& .MuiListItemButton-root': {
    padding: theme.spacing(1, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  '& .MuiListItemText-root': {
    margin: 0,
    '& .MuiTypography-root': {
      fontSize: theme.typography.body1.fontSize,
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(1),
    },
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
    <List sx={{ width: '100%' }}>
      {question.reponses?.map((answer) => (
        <StyledListItem key={answer.id} disablePadding>
          <ListItemButton
            onClick={() => handleAnswerSelect(answer.id.toString())}
            selected={isSelectedAnswer(answer.id.toString())}
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
                checked={isSelectedAnswer(answer.id.toString())}
                tabIndex={-1}
                disableRipple
                size="small"
              />
            </ListItemIcon>
            <ListItemText 
              primary={answer.text}
              sx={{
                '& .MuiTypography-root': {
                  wordBreak: 'break-word',
                },
              }}
            />
            {showFeedback && (
              <Box 
                display="flex" 
                alignItems="center"
                sx={{
                  ml: { xs: 1, sm: 2 },
                  '& svg': {
                    width: { xs: 16, sm: 20 },
                    height: { xs: 16, sm: 20 },
                  },
                }}
              >
                {answer.is_correct === 1 ? (
                  <Check color="green" />
                ) : (
                  isSelectedAnswer(answer.id.toString()) && <X color="red" />
                )}
              </Box>
            )}
          </ListItemButton>
        </StyledListItem>
      ))}
    </List>
  );
};
