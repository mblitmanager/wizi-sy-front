import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Category, UserProgress } from "@/types/quiz";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CategoryProgressProps {
  categories: Category[];
  userProgress: UserProgress | null;
}

const CategoryProgress: React.FC<CategoryProgressProps> = ({
  categories,
  userProgress,
}) => {
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    setShowCharts(true);
  }, []);

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

  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Progression par catégorie',
        data: categories.map(cat => getProgressForCategory(cat.id).percentage),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Progression globale',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
      },
    },
  };

  const doughnutData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        data: categories.map(cat => getProgressForCategory(cat.id).completed),
        backgroundColor: categories.map(cat => cat.colorClass || 'rgb(59, 130, 246)'),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Progression par catégorie</h3>
          {showCharts && <Line data={chartData} options={chartOptions} />}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Répartition des complétions</h3>
          {showCharts && <Doughnut data={doughnutData} />}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {categories.map((category, index) => {
          const progress = getProgressForCategory(category.id);
          const isTop =
            Math.max(...categories.map((c) => getProgressForCategory(c.id).percentage)) ===
              progress.percentage && progress.percentage > 0;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-lg p-4 flex flex-col gap-3 group hover:shadow-2xl transition-all duration-300 border border-blue-100 dark:border-blue-900/40 overflow-hidden`}
            >
              <div className="flex items-center gap-2 mb-1">
                <motion.span
                  whileHover={{ scale: 1.1 }}
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
                </motion.span>
                <h3
                  className="text-base font-semibold font-nunito truncate cursor-help"
                  title={category.name}
                >
                  {category.name}
                </h3>
                {isTop && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold shadow"
                  >
                    Top
                  </motion.span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-roboto">
                  {progress.completed}/{progress.total} complétés
                </span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-semibold text-blue-700 dark:text-blue-300"
                >
                  {Math.round(progress.percentage)}%
                </motion.span>
              </div>
              <Progress
                value={progress.percentage}
                className={`h-2 transition-all duration-700 ease-in-out ${
                  category.colorClass || "bg-primary/20"
                }`}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default CategoryProgress;
