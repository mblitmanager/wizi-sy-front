import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Question as QuizQuestion, MatchingItem } from '@/types/quiz';

interface MatchingProps {
  question: QuizQuestion;
  onAnswer: (matches: Record<string, string>) => void;
  showFeedback?: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StyledBox = styled(Box)<{ isDragging?: boolean }>(
  ({ theme, isDragging }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    backgroundColor: isDragging
      ? theme.palette.action.hover
      : theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create(['background-color', 'border-color']),
  })
);

export const Matching: React.FC<MatchingProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [matches, setMatches] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialiser les correspondances vides
    const initialMatches: Record<string, string> = {};
    question.matching?.forEach(item => {
      initialMatches[item.id] = '';
    });
    setMatches(initialMatches);
  }, [question]);

  const handleDragEnd = (result: any) => {
    if (!result.destination || showFeedback) return;

    const { source, destination } = result;
    const newMatches = { ...matches };
    newMatches[source.droppableId] = destination.droppableId;
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const isCorrectMatch = (sourceId: string, destinationId: string) => {
    if (!showFeedback) return undefined;
    const item = question.matching?.find(i => i.id === sourceId);
    return item && item.matchPair === destinationId;
  };

  return (
    <StyledPaper>
      <Typography variant="body1" gutterBottom>
        {question.text}
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          {/* Colonne de gauche */}
          <Grid component="div" sx={{ gridColumn: '1 / 2' }}>
            <Typography variant="subtitle2" gutterBottom>
              Éléments à associer
            </Typography>
            <Droppable droppableId="source">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {question.matching?.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={showFeedback}
                    >
                      {(provided, snapshot) => (
                        <StyledBox
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                        >
                          <Typography>
                            {item.text}
                          </Typography>
                        </StyledBox>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Grid>

          {/* Colonne de droite */}
          <Grid component="div" sx={{ gridColumn: '3 / 4' }}>
            <Typography variant="subtitle2" gutterBottom>
              Correspondances
            </Typography>
            <Droppable droppableId="destination">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {question.matching?.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={showFeedback}
                    >
                      {(provided, snapshot) => (
                        <StyledBox
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                          sx={{
                            backgroundColor: showFeedback
                              ? isCorrectMatch(item.id, matches[item.id])
                                ? 'success.light'
                                : 'error.light'
                              : undefined,
                          }}
                        >
                          <Typography>
                            {item.text}
                          </Typography>
                        </StyledBox>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Grid>
        </Grid>
      </DragDropContext>

      {showFeedback && (
        <Box mt={2}>
          {question.matching?.map((item, index) => (
            !isCorrectMatch(item.id, matches[item.id]) && (
              <Typography key={index} color="error" variant="body2">
                La correspondance correcte pour {item.text} était : {item.matchPair}
              </Typography>
            )
          ))}
        </Box>
      )}
    </StyledPaper>
  );
};
