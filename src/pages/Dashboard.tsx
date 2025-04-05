import React from 'react';
import { Brain, Trophy, Users, Target } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useQuizStats, useComparisonStats } from '../hooks/useStats';
import StatCard from '../components/dashboard/StatCard';
import ProgressChart from '../components/dashboard/ProgressChart';
import RecentQuizzes from '../components/dashboard/RecentQuizzes';

function Dashboard() {
  const { user } = useAuthStore();
  const { data: quizStats } = useQuizStats(user?.id || '');
  const { data: comparisonStats } = useComparisonStats(user?.id || '');

  const progressData = [
    { category: 'Bureautique', completed: 15, total: 20 },
    { category: 'Langues', completed: 8, total: 12 },
    { category: 'Internet', completed: 10, total: 15 },
    { category: 'Création', completed: 5, total: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome back,</span>
          <span className="font-medium">{user?.firstName} {user?.lastName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Quizzes Completed"
          value={quizStats?.completed || 0}
          icon={Brain}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Score"
          value={quizStats?.totalScore || 0}
          icon={Trophy}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Global Ranking"
          value={`#${comparisonStats?.rank || 0}`}
          icon={Users}
        />
        <StatCard
          title="Success Rate"
          value={`${quizStats?.successRate || 0}%`}
          icon={Target}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart data={progressData} />
        <RecentQuizzes attempts={quizStats?.recentAttempts || []} />
      </div>
    </div>
  );
}

export default Dashboard;