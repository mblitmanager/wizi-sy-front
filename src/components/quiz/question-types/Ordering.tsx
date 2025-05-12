
import React from 'react';
import { useOrderingQuestion } from '@/use-case/hooks/quiz/rearangement/useOrderingQuestion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, ArrowDown, ArrowUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderingOption {
  id: string;
  text: string;
  position?: number;
}

interface OrderingAnswer {
  id: string;
  position: number;
}

interface Question {
  id: string;
  texte: string;
  options?: OrderingOption[];
  reponses: OrderingOption[];
  correctOrder?: string[];
}

interface OrderingProps {
  question: Question;
  onAnswer: (answer: OrderingAnswer[]) => void;
  showFeedback?: boolean;
}

export const Ordering = ({ question, onAnswer, showFeedback = false }: OrderingProps) => {
  const {
    items,
    handleDragEnd,
    moveItemUp,
    moveItemDown,
    handleSubmitOrder,
    isCorrectPosition
  } = useOrderingQuestion(question, onAnswer);
  
  // Use options if available, or create from reponses
  const options = question.options || question.reponses || [];

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">{question.texte}</h3>
        <p className="text-sm text-gray-500">Faites glisser les éléments pour les réorganiser dans le bon ordre.</p>
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
                  isDragDisabled={showFeedback}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        flex items-center p-3 bg-white border rounded-lg
                        ${showFeedback && isCorrectPosition(item, index) 
                          ? 'border-green-500 bg-green-50' 
                          : showFeedback 
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'}
                      `}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="mr-2 cursor-grab"
                      >
                        <GripVertical className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <span className="flex-1">{item.text}</span>
                      
                      {showFeedback && isCorrectPosition(item, index) && (
                        <Check className="h-5 w-5 text-green-500 ml-2" />
                      )}
                      
                      {!showFeedback && (
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveItemUp(index)}
                            disabled={index === 0}
                            className="h-8 w-8"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveItemDown(index)}
                            disabled={index === items.length - 1}
                            className="h-8 w-8"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {!showFeedback && (
        <Button
          onClick={handleSubmitOrder}
          className="w-full mt-4"
        >
          Confirmer l'ordre
        </Button>
      )}
    </div>
  );
};
