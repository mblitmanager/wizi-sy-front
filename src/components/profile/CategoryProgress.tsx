
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Category, UserProgress } from '@/types/quiz';

interface CategoryProgressProps {
  categories: Category[];
  userProgress: UserProgress | null;
}

const CategoryProgress: React.FC<CategoryProgressProps> = ({ categories, userProgress }) => {
  const getProgressForCategory = (categoryId: string) => {
    if (!userProgress || !userProgress.category_progress) {
      return { 
        completed: 0,
        total: 0,
        percentage: 0
      };
    }

    const progress = userProgress.category_progress[categoryId];
    if (!progress) {
      return {
        completed: 0, 
        total: 0, 
        percentage: 0
      };
    }

    const completed = progress.completed || 0;
    const total = progress.total || 10; // Default to 10 if not available
    const percentage = (completed / total) * 100;

    return {
      completed,
      total,
      percentage
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold font-montserrat">Progression par catégorie</h2>
      <div className="space-y-6">
        {categories.map((category) => {
          const progress = getProgressForCategory(category.id);
          
          return (
            <div key={category.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium font-nunito">{category.name}</h3>
                <span className="text-xs text-muted-foreground font-roboto">
                  {progress.completed}/{progress.total} complétés
                </span>
              </div>
              <Progress value={progress.percentage} 
                className={`h-2 ${category.colorClass || 'bg-primary/20'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryProgress;
