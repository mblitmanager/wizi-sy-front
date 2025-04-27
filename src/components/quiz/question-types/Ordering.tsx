import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';

interface OrderingProps {
  question: QuizQuestion;
  onAnswer: (answers: string[]) => void;
  showFeedback?: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StyledListItem = styled(ListItem)<{ isDragging: boolean }>(({ theme, isDragging }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: isDragging ? theme.palette.action.hover : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: theme.transitions.create(['background-color', 'box-shadow']),
  ...(isDragging && {
    boxShadow: theme.shadows[3],
  }),
}));

export const Ordering: React.FC<OrderingProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [orderedAnswers, setOrderedAnswers] = useState(question.reponses || []);

  useEffect(() => {
    // Mélanger les réponses au chargement initial
    if (!showFeedback) {
      const shuffled = [...(question.reponses || [])].sort(() => Math.random() - 0.5);
      setOrderedAnswers(shuffled);
    }
  }, [question.reponses, showFeedback]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(orderedAnswers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedAnswers(items);
    onAnswer(items.map(item => item.id));
  };

  const isCorrectPosition = (answer: { id: string; position?: number }, index: number) => {
    if (!showFeedback) return undefined;
    return answer.position === index + 1;
  };

  return (
    <StyledPaper>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="answers">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ padding: 0 }}
            >
              {orderedAnswers.map((answer, index) => {
                const isCorrect = isCorrectPosition(answer, index);
                return (
                  <Draggable
                    key={answer.id}
                    draggableId={answer.id}
                    index={index}
                    isDragDisabled={showFeedback}
                  >
                    {(provided, snapshot) => (
                      <StyledListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        isDragging={snapshot.isDragging}
                      >
                        <ListItemIcon
                          {...provided.dragHandleProps}
                          sx={{ cursor: showFeedback ? 'default' : 'grab' }}
                        >
                          <GripVertical size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary={answer.text}
                          sx={{
                            '& .MuiListItemText-primary': {
                              color: showFeedback
                                ? isCorrect
                                  ? 'success.main'
                                  : 'error.main'
                                : 'text.primary',
                            },
                          }}
                        />
                        {showFeedback && (
                          <Box display="flex" alignItems="center" ml={2}>
                            {isCorrect ? (
                              <Check color="green" size={20} />
                            ) : (
                              <X color="red" size={20} />
                            )}
                          </Box>
                        )}
                      </StyledListItem>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      {showFeedback && (
        <Box mt={2}>
          {!orderedAnswers.every((answer, index) => isCorrectPosition(answer, index)) && (
            <Box sx={{ color: 'error.main', mt: 2 }}>
              L'ordre correct était :
              {(question.reponses || [])
                .slice()
                .sort((a, b) => (a.position || 0) - (b.position || 0))
                .map((answer, index) => (
                  <Box key={answer.id} sx={{ ml: 2, mt: 1 }}>
                    {index + 1}. {answer.text}
                  </Box>
                ))}
            </Box>
          )}
        </Box>
      )}
    </StyledPaper>
  );
};
