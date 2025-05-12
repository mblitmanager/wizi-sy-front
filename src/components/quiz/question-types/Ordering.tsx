
import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, List, ListItemText, ListItemIcon, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GripVertical, Check, X } from "lucide-react";
import { useOrderingQuestion } from "@/use-case/hooks/quiz/rearangement/useOrderingQuestion";
import { Question, Answer } from "@/types/quiz";

interface OrderingProps {
  question: Question;
  onAnswer: (answers: string[]) => void;
  showFeedback?: boolean;
}

interface SortableItemProps {
  id: string;
  text: string;
  isCorrect?: boolean;
  disabled?: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledListItem = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const SortableItem = ({ id, text, isCorrect, disabled }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Custom transform handler to manage potential issues with the CSS import
  const getTransformStyles = () => {
    if (!transform) return {};
    
    try {
      return {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      };
    } catch (error) {
      // Fallback if CSS utility isn't working properly
      const { x, y, scaleX, scaleY } = transform;
      return {
        transform: `translate3d(${x}px, ${y}px, 0) scaleX(${scaleX}) scaleY(${scaleY})`,
        transition,
        opacity: isDragging ? 0.5 : 1,
      };
    }
  };

  const style = getTransformStyles();

  return (
    <StyledListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ListItemIcon sx={{ cursor: disabled ? "default" : "grab" }}>
        <GripVertical size={20} />
      </ListItemIcon>
      <ListItemText
        primary={text}
        sx={{
          color:
            isCorrect !== undefined
              ? isCorrect
                ? "success.main"
                : "error.main"
              : "text.primary",
        }}
      />
      {isCorrect !== undefined && (
        <Box ml={2}>
          {isCorrect ? <Check color="green" /> : <X color="red" />}
        </Box>
      )}
    </StyledListItem>
  );
};

export const Ordering: React.FC<OrderingProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const { orderedAnswers, setOrderedAnswers, isCorrectPosition } =
    useOrderingQuestion({ question, showFeedback, onAnswer });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = orderedAnswers.findIndex((a) => a.id === active.id);
      const newIndex = orderedAnswers.findIndex((a) => a.id === over?.id);
      const newOrder = arrayMove(orderedAnswers, oldIndex, newIndex);
      setOrderedAnswers(newOrder);
    }
  };

  const correctAnswersList = question.reponses 
    ? [...question.reponses].filter(a => a.is_correct || a.isCorrect).sort((a, b) => (a.position || 0) - (b.position || 0))
    : [];

  return (
    <StyledPaper>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={orderedAnswers.map((a) => a.id)}
          strategy={verticalListSortingStrategy}>
          <List sx={{ padding: 0 }}>
            {orderedAnswers.map((answer, index) => (
              <SortableItem
                key={answer.id}
                id={answer.id}
                text={answer.text}
                isCorrect={
                  showFeedback ? isCorrectPosition(answer, index) : undefined
                }
                disabled={showFeedback}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>

      {showFeedback &&
        !orderedAnswers.every((answer, index) =>
          isCorrectPosition(answer, index)
        ) && (
          <Box mt={2} color="error.main">
            <strong>L'ordre correct était :</strong>
            {correctAnswersList.map((answer, idx) => (
              <Box key={answer.id} ml={2}>
                {idx + 1}. {answer.text}
              </Box>
            ))}
          </Box>
        )}
    </StyledPaper>
  );
};
