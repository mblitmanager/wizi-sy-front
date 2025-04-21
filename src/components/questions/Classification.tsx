import React, { useState } from 'react';
import { Question } from '@/types/quiz';
import BaseQuestion from './BaseQuestion';
import { GripVertical } from 'lucide-react';

interface ClassificationData {
  categories: string[];
  items: Array<{ id: string; text: string }>;
  correct_categories: { [key: string]: string[] };
}

interface ClassificationProps {
  question: Question;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked: boolean;
  selectedAnswer: { [key: string]: string[] } | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const Classification: React.FC<ClassificationProps> = ({
  question,
  onAnswerSelect,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const parseClassificationData = (): ClassificationData => {
    try {
      const data = JSON.parse(question.text) as ClassificationData;
      return {
        categories: data.categories || [],
        items: data.items || [],
        correct_categories: data.correct_categories || {}
      };
    } catch (e) {
      console.error('Error parsing classification data:', e);
      return {
        categories: [],
        items: [],
        correct_categories: {}
      };
    }
  };

  const { categories: questionCategories, items: questionItems, correct_categories } = parseClassificationData();
  
  const [categories, setCategories] = useState<{ [key: string]: string[] }>(
    selectedAnswer || questionCategories.reduce((acc, cat) => ({ ...acc, [cat]: [] }), {})
  );

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (isAnswerChecked) return;

    const itemId = e.dataTransfer.getData('text/plain');
    const newCategories = { ...categories };
    
    // Remove item from previous category if it exists
    Object.keys(newCategories).forEach(cat => {
      newCategories[cat] = newCategories[cat].filter(id => id !== itemId);
    });
    
    // Add item to new category
    newCategories[category] = [...newCategories[category], itemId];
    setCategories(newCategories);
    onAnswerSelect(question.id, JSON.stringify(newCategories));
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">{question.text}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questionCategories.map((category) => (
          <div
            key={category}
            className="p-4 bg-white rounded-lg shadow"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category)}
          >
            <h3 className="font-medium mb-2">{category}</h3>
            <div className="min-h-[100px] space-y-2">
              {categories[category]?.map((itemId) => {
                const item = questionItems.find((i) => i.id === itemId);
                return item ? (
                  <div
                    key={item.id}
                    className={`p-2 rounded-lg ${
                      isAnswerChecked
                        ? correct_categories[category]?.includes(item.id)
                          ? 'bg-green-100'
                          : 'bg-red-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {item.text}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-medium mb-2">Items à classer</h3>
        <div className="flex flex-wrap gap-2">
          {questionItems
            .filter((item) => !Object.values(categories).flat().includes(item.id))
            .map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                className="p-2 bg-gray-100 rounded-lg cursor-move"
              >
                {item.text}
              </div>
            ))}
        </div>
      </div>
      {isAnswerChecked && (
        <div className="mt-4 p-4 rounded-lg bg-muted">
          <div className="font-medium">Classement correct:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {Object.entries(correct_categories).map(([category, itemIds]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium">{category}</h4>
                {itemIds.map((itemId) => {
                  const item = questionItems.find((i) => i.id === itemId);
                  return item ? (
                    <div key={item.id} className="p-2 bg-green-100 rounded-lg">
                      {item.text}
                    </div>
                  ) : null;
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Classification;
