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
import { quizService, CategoryStats, ProgressStats, QuizTrends, PerformanceStats } from "@/services/quiz/QuizService";

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

interface QuizStats {
  total_quizzes: number;
  completed_quizzes: number;
  average_score: number;
  category_stats: {
    [key: string]: {
      total: number;
      completed: number;
      average_score: number;
    };
  };
}

const CategoryProgress: React.FC = () => {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [quizTrends, setQuizTrends] = useState<QuizTrends | null>(null);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stats, progress, trends, performance] = await Promise.all([
          quizService.getCategoryStats(),
          quizService.getProgressStats(),
          quizService.getQuizTrends(),
          quizService.getPerformanceStats(),
        ]);
        setCategoryStats(stats);
        setProgressStats(progress);
        setQuizTrends(trends);
        setPerformanceStats(performance);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  const lineChartData = {
    labels: quizTrends?.overall_trend.map(trend => trend.date) || [],
    datasets: [
      {
        label: 'Score moyen',
        data: quizTrends?.overall_trend.map(trend => trend.average_score) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Progression des scores',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const doughnutChartData = {
    labels: categoryStats.map(stat => stat.category_name),
    datasets: [
      {
        data: categoryStats.map(stat => stat.completed_quizzes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Répartition des quiz complétés',
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* En-tête avec statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Quiz complétés</h3>
          <p className="text-3xl font-bold text-primary">
            {categoryStats.reduce((acc, stat) => acc + stat.completed_quizzes, 0)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Score moyen</h3>
          <p className="text-3xl font-bold text-primary">
            {categoryStats.length > 0
              ? Math.round(
                  categoryStats.reduce((acc, stat) => acc + stat.average_score, 0) /
                    categoryStats.length
                )
              : 0}
            %
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Taux de réussite</h3>
          <p className="text-3xl font-bold text-primary">
            {categoryStats.length > 0
              ? Math.round(
                  categoryStats.reduce((acc, stat) => acc + stat.success_rate, 0) /
                    categoryStats.length
                )
              : 0}
            %
          </p>
        </motion.div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <Line data={lineChartData} options={lineChartOptions} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
        </motion.div>
      </div>

      {/* Forces et faiblesses */}
      {performanceStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Points forts</h3>
            <div className="space-y-4">
              {performanceStats.strengths.map((strength, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{strength.category_name}</span>
                  <span className="text-primary font-semibold">{strength.score}%</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Points à améliorer</h3>
            <div className="space-y-4">
              {performanceStats.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{weakness.category_name}</span>
                  <span className="text-red-500 font-semibold">{weakness.score}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Progression détaillée par catégorie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Progression par catégorie</h3>
        <div className="space-y-6">
          {categoryStats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{stat.category_name}</span>
                <span className="text-primary font-semibold">{stat.average_score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.success_rate}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="bg-primary rounded-full h-2"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{stat.completed_quizzes} quiz complétés</span>
                <span>{stat.total_quizzes} quiz au total</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryProgress;
