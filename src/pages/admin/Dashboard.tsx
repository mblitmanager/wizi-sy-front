import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Award, Calendar, BarChart3 } from 'lucide-react';

const adminMenuItems = [
  {
    title: 'Users Management',
    icon: Users,
    description: 'Manage trainees, trainers, and staff accounts',
    link: '/admin/users'
  },
  {
    title: 'Training Management',
    icon: BookOpen,
    description: 'Manage courses, quizzes, and content',
    link: '/admin/trainings'
  },
  {
    title: 'Quiz Management',
    icon: Award,
    description: 'Create and manage quizzes and questions',
    link: '/admin/quizzes'
  },
  {
    title: 'Schedule Management',
    icon: Calendar,
    description: 'Manage training schedules and events',
    link: '/admin/schedule'
  },
  {
    title: 'Statistics',
    icon: BarChart3,
    description: 'View detailed analytics and reports',
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">No recent activity to display</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-blue-600">0</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Active Quizzes</p>
              <p className="text-2xl font-semibold text-green-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;