import React from 'react';
import { Trophy, BookOpen, Calendar as CalendarIcon, Users } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ProgressChart from '../components/dashboard/ProgressChart';
import RecentQuizzes from '../components/dashboard/RecentQuizzes';
import { useQuizStats } from '../hooks/useStats';
import useAuthStore from '../store/authStore';

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading, error } = useQuizStats(user?.id || '');

  const progressData = [
    { category: 'Bureautique', completed: 5, total: 10 },
    { category: 'Langues', completed: 3, total: 8 },
    { category: 'Internet', completed: 7, total: 12 },
    { category: 'Création', completed: 2, total: 6 }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">Une erreur est survenue lors du chargement des données.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Quiz complétés"
          value={stats?.completedQuizzes ?? 0}
          icon={Trophy}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Formations en cours"
          value={stats?.activeFormations ?? 0}
          icon={BookOpen}
        />
        <StatCard
          title="Prochaine session"
          value="Dans 2 jours"
          icon={CalendarIcon}
        />
        <StatCard
          title="Contacts actifs"
          value={stats?.activeContacts ?? 0}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart data={progressData} />
        <RecentQuizzes attempts={stats?.recentAttempts ?? []} />
      </div>

      {/* Prochaines sessions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Prochaines sessions</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Aucune session planifiée</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
