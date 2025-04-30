import React, { useState, useEffect, useCallback } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GripVertical, Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';

interface OrderingProps {
  question: QuizQuestion;
  onAnswer: (answers: string[]) => void;
  showFeedback?: boolean;
}

// Définition du type pour une réponse d'ordre
interface OrderingAnswer {
  id: string;
  text: string;
  position?: number;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: theme.transitions.create(['background-color', 'box-shadow']),
}));

const DraggingListItem = styled(StyledListItem)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  boxShadow: theme.shadows[3],
}));

export const Ordering: React.FC<OrderingProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [orderedAnswers, setOrderedAnswers] = useState<OrderingAnswer[]>([]);

  // On fige la liste initiale des réponses pour éviter les problèmes de re-render pendant le drag
  const initialReponsesRef = React.useRef(question.reponses);

  useEffect(() => {
    if (initialReponsesRef.current && initialReponsesRef.current.length > 0) {
      if (showFeedback) {
        const sorted = [...initialReponsesRef.current].sort((a, b) => 
          (a.position || 0) - (b.position || 0)
        );
        setOrderedAnswers(sorted);
      } else {
        const shuffled = [...initialReponsesRef.current].sort(() => Math.random() - 0.5);
        setOrderedAnswers(shuffled);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFeedback]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || showFeedback) return;

    const items = Array.from(orderedAnswers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedAnswers(items);
    onAnswer(items.map(item => item.text));
  }, [orderedAnswers, onAnswer, showFeedback]);

  const isCorrectPosition = (answer: { text: string; position?: number }, index: number) => {
    if (!showFeedback) return undefined;
    return answer.position === index + 1;
  };

  // Génère un droppableId stable basé uniquement sur l'id de la question
  const droppableId = React.useMemo(() => 
    `ordering-${question.id || 'default'}`,
    [question.id]
  );

  return (
    <StyledPaper>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ 
                padding: 0,
                minHeight: '100px',
                backgroundColor: snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            >
              {orderedAnswers.map((answer, index) => {
                const isCorrect = isCorrectPosition(answer, index);
                return (
                  <Draggable
                    key={answer.text}
                    draggableId={answer.text}
                    index={index}
                    isDragDisabled={showFeedback}
                  >
                    {(provided, snapshot) => {
                      const ListItemComponent = snapshot.isDragging ? DraggingListItem : StyledListItem;
                      return (
                        <ListItemComponent
                          ref={provided.innerRef}
                          {...provided.draggableProps}
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
                        </ListItemComponent>
                      );
                    }}
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
                  <Box key={answer.text} sx={{ ml: 2, mt: 1 }}>
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
