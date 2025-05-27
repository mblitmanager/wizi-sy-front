import React from "react";
import { Progress } from "@/components/ui/progress";
import { Category, UserProgress } from "@/types/quiz";

interface CategoryProgressProps {
  categories: Category[];
  userProgress: UserProgress | null;
}

const CategoryProgress: React.FC<CategoryProgressProps> = ({
  categories,
  userProgress,
}) => {
  const getProgressForCategory = (categoryId: string) => {
    if (!userProgress) {
      return {
        completed: 0,
        total: 0,
        percentage: 0,
      };
    }

    // Handle both potential property names
    const categoryProgress = userProgress.category_progress || {};

    const progress = categoryProgress[categoryId];
    if (!progress) {
      return {
        completed: 0,
        total: 0,
        percentage: 0,
      };
    }

    const completed = progress.completed || 0;
    const total = progress.total || 10; // Default to 10 if not available
    const percentage = (completed / total) * 100;

    return {
      completed,
      total,
      percentage,
    };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((category) => {
          const progress = getProgressForCategory(category.id);
          const isTop =
            Math.max(...categories.map((c) => getProgressForCategory(c.id).percentage)) ===
              progress.percentage && progress.percentage > 0;

          return (
            <div
              key={category.id}
              className={`relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-lg p-4 flex flex-col gap-3 group hover:shadow-2xl transition-all duration-300 border border-blue-100 dark:border-blue-900/40 overflow-hidden`}
            >
              {/* Badge or icon */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-block w-7 h-7 rounded-full ${
                    category.colorClass || "bg-blue-400"
                  } flex items-center justify-center text-white font-bold shadow-md border-2 border-white dark:border-gray-800`}
                  title={category.name}
                >
                  {category.icon ? (
                    <span className="text-lg">{category.icon}</span>
                  ) : (
                    category.name.charAt(0).toUpperCase()
                  )}
                </span>
                <h3
                  className="text-base font-semibold font-nunito truncate cursor-help"
                  title={category.name}
                >
                  {category.name}
                </h3>
                {isTop && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold shadow animate-bounce">
                    Top
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-roboto">
                  {progress.completed}/{progress.total} complétés
                </span>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {Math.round(progress.percentage)}%
                </span>
              </div>
              <Progress
                value={progress.percentage}
                className={`h-2 transition-all duration-700 ease-in-out ${
                  category.colorClass || "bg-primary/20"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryProgress;
