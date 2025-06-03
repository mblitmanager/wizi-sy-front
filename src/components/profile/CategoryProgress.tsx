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
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

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

interface CategoryStats {
  category: string;
  totalQuizzes: number;
  completedQuizzes: number;
  completionRate: number;
}

interface ProgressStats {
  daily_progress: Array<{
    date: string;
    completed_quizzes: number;
    average_score: number;
  }>;
  weekly_progress: Array<{
    week: string;
    completed_quizzes: number;
    average_score: number;
  }>;
  monthly_progress: Array<{
    month: string;
    completed_quizzes: number;
    average_score: number;
  }>;
}

interface QuizTrends {
  category_trends: Array<{
    category_id: string;
    category_name: string;
    trend_data: Array<{
      date: string;
      score: number;
    }>;
  }>;
  overall_trend: Array<{
    date: string;
    average_score: number;
  }>;
}

interface PerformanceStats {
  strengths: Array<{
    category_id: string;
    category_name: string;
    score: number;
  }>;
  weaknesses: Array<{
    category_id: string;
    category_name: string;
    score: number;
  }>;
  improvement_areas: Array<{
    category_id: string;
    category_name: string;
    score: number;
  }>;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CategoryProgress: React.FC<CategoryProgressProps> = ({ categories, userProgress }) => {
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
        setError(null);
        const [statsRes, progressRes, trendsRes, performanceRes] = await Promise.all([
          api.get("/quiz/stats/categories"),
          api.get("/quiz/stats/progress"),
          api.get("/quiz/stats/trends"),
          api.get("/quiz/stats/performance"),
        ]);
        setCategoryStats(statsRes.data);
        setProgressStats(progressRes.data);
        setQuizTrends(trendsRes.data);
        setPerformanceStats(performanceRes.data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des statistiques. Veuillez réessayer plus tard.';
        setError(errorMsg);
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const lineChartData = {
    labels: quizTrends?.overall_trend.map(trend => trend.date) || [],
    datasets: [
      {
        label: 'Score moyen',
        data: quizTrends?.overall_trend.map(trend => trend.average_score) || [],
        borderColor: 'rgb(196, 121, 9)',
        tension: 0.1,
        fill: false,
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
        title: {
          display: true,
          text: 'Score (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
  };

  const doughnutChartData = {
    labels: categoryStats.map(stat => stat.category),
    datasets: [
      {
        data: categoryStats.map(stat => stat.completedQuizzes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          // 'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderWidth: 1,
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
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-8"
      >
        {/* En-tête avec statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Quiz complétés",
              value: categoryStats.reduce((acc, stat) => acc + stat.completedQuizzes, 0),
              delay: 0
            },
            {
              title: "Score moyen",
              value: progressStats?.daily_progress[0]?.average_score || 0,
              suffix: "%",
              delay: 0.1
            },
            {
              title: "Taux de réussite",
              value: categoryStats.length > 0
                ? Math.round(
                    categoryStats.reduce((acc, stat) => acc + stat.completionRate, 0) /
                      categoryStats.length
                  )
                : 0,
              suffix: "%",
              delay: 0.2
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-primary">
                {stat.value}{stat.suffix}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <Line data={lineChartData} options={lineChartOptions} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
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
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Points forts</h3>
              <div className="space-y-4">
                {performanceStats.strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600">{strength.category_name}</span>
                    <span className="text-primary font-semibold">{strength.score}%</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Points à améliorer</h3>
              <div className="space-y-4">
                {performanceStats.weaknesses.map((weakness, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600">{weakness.category_name}</span>
                    <span className="text-red-500 font-semibold">{weakness.score}%</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Progression détaillée par catégorie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Progression par catégorie</h3>
          <div className="space-y-6">
            {categoryStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{stat.category}</span>
                  <span className="text-primary font-semibold">{stat.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.completionRate}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="bg-primary rounded-full h-2"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{stat.completedQuizzes} quiz complétés</span>
                  <span>{stat.totalQuizzes} quiz au total</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CategoryProgress;
