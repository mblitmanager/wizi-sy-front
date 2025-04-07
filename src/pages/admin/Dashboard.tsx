import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Award, Calendar, BarChart3 } from 'lucide-react';

const adminMenuItems = [
  {
    title: 'Gestion des utilisateurs',
    icon: Users,
    description: 'Gérer les comptes des stagiaires, formateurs et personnel',
    link: '/admin/users'
  },
  {
    title: 'Gestion des formations',
    icon: BookOpen,
    description: 'Gérer les cours, quiz et contenus',
    link: '/admin/trainings'
  },
  {
    title: 'Gestion des quiz',
    icon: Award,
    description: 'Créer et gérer les quiz et questions',
    link: '/admin/quizzes'
  },
  {
    title: 'Gestion des plannings',
    icon: Calendar,
    description: 'Gérer les plannings de formation et événements',
    link: '/admin/schedule'
  },
  {
    title: 'Statistiques',
    icon: BarChart3,
    description: 'Voir les analyses détaillées et rapports',
    link: '/admin/stats'
  }
];

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminMenuItems.map((item) => (
          <Link
            key={item.link}
            to={item.link}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Aucune activité récente à afficher</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques rapides</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Nombre total d'utilisateurs</p>
              <p className="text-2xl font-semibold text-blue-600">0</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Quiz actifs</p>
              <p className="text-2xl font-semibold text-green-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;