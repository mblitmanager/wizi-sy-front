
import React from 'react';
import { Category, UserProgress } from '@/types';
import { Progress } from '@/components/ui/progress';

interface CategoryProgressProps {
  categories: Category[];
  userProgress: UserProgress | null;
}

const CategoryProgress: React.FC<CategoryProgressProps> = ({ categories, userProgress }) => {
  if (!userProgress) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4 font-montserrat">Ma progression</h2>
      <div className="space-y-3">
        {categories.map((category) => {
          const progress = userProgress.categoryProgress[category.id];
          if (!progress) return null;
          
          const totalQuizzes = progress.totalQuizzes || 0;
          const completedQuizzes = progress.completedQuizzes || 0;
          const percentage = totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0;
          
          return (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-1 font-montserrat">{category.name}</h3>
              <div className="flex justify-between items-center mb-1 text-xs text-gray-500 font-roboto">
                <span>{completedQuizzes} terminés</span>
                <span>{totalQuizzes} total</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
        
        {categories.length > 0 && Object.keys(userProgress.categoryProgress).length === 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 font-roboto">Aucune progression disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryProgress;
