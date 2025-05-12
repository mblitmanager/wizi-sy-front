
import { useState, useEffect } from 'react';
import { DropResult } from '@hello-pangea/dnd';

interface OrderingOption {
  id: string;
  text: string;
  position?: number;
}

interface OrderingAnswer {
  id: string;
  position: number;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  texte: string;
  options?: OrderingOption[];
  reponses: OrderingOption[];
  correctOrder?: string[];
}

export const useOrderingQuestion = (
  question: Question, 
  onAnswer: (answers: OrderingAnswer[]) => void
) => {
  const [items, setItems] = useState<OrderingOption[]>([]);
  
  useEffect(() => {
    // Initialize items from question options or reponses
    const sourceItems = question.options || question.reponses || [];
    
    // Shuffle the items to create a random initial order
    const shuffled = [...sourceItems].sort(() => Math.random() - 0.5);
    
    setItems(shuffled);
  }, [question]);
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const reordered = [...items];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    
    setItems(reordered);
  };
  
  const moveItemUp = (index: number) => {
    if (index === 0) return;
    
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    
    setItems(newItems);
  };
  
  const moveItemDown = (index: number) => {
    if (index === items.length - 1) return;
    
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    
    setItems(newItems);
  };
  
  const handleSubmitOrder = () => {
    const answers: OrderingAnswer[] = items.map((item, index) => ({
      id: item.id,
      position: index
    }));
    
    onAnswer(answers);
  };
  
  const isCorrectPosition = (item: OrderingOption, currentIndex: number): boolean => {
    // If we have explicit correctOrder, use it
    if (question.correctOrder) {
      return question.correctOrder[currentIndex] === item.id;
    }
    
    // If items have position properties, use those
    if (item.position !== undefined) {
      return item.position === currentIndex;
    }
    
    // Default to true if no validation method is available
    return true;
  };
  
  return {
    items,
    handleDragEnd,
    moveItemUp,
    moveItemDown,
    handleSubmitOrder,
    isCorrectPosition
  };
};
