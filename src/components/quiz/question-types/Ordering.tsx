import { Card } from "@/components/ui/card";
import type { Question } from "@/types/quiz";
import { CheckCircle2, GripVertical } from "lucide-react";
import { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface OrderingProps {
  question: Question;
  onAnswer: (value: string[]) => void;
}

export function Ordering({ question, onAnswer }: OrderingProps) {
  const [items, setItems] = useState(question.answers || []);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    setItems(newItems);
    onAnswer(newItems.map(item => item.id));
  };

  const checkOrder = () => {
    const isOrderCorrect = items.every((item, index) => 
      item.position === index + 1
    );
    setIsCorrect(isOrderCorrect);
    setShowFeedback(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium leading-relaxed">
        {question.text}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ordering-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        p-4 flex items-center gap-4
                        transition-all duration-300
                        hover:shadow-md
                        ${showFeedback && isCorrect ? 'bg-green-50 border-green-500' : ''}
                        ${showFeedback && !isCorrect ? 'bg-red-50 border-red-500' : ''}
                      `}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="flex-1">{item.text}</span>
                      {showFeedback && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 animate-bounce-once" />
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex justify-end">
        <button
          onClick={checkOrder}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Vérifier l'ordre
        </button>
      </div>

      {showFeedback && (
        <div className="text-center text-sm text-muted-foreground">
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Ordre correct !</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <span>L'ordre n'est pas correct. Essayez encore !</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
