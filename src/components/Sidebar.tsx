import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Users, 
  Calendar as CalendarIcon,
  UserCircle,
  Settings,
  BarChart3
} from 'lucide-react';
import useAuthStore from '../store/authStore';

function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const studentNavItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/quiz', icon: BrainCircuit, label: 'Quiz' },
    { path: '/formations', icon: Users, label: 'Formations' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
    { path: '/profile', icon: UserCircle, label: 'Profile' }
  ];

  const adminNavItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/quizzes', icon: BrainCircuit, label: 'Quizzes' },
    { path: '/admin/trainings', icon: Users, label: 'Trainings' },
    { path: '/admin/schedule', icon: CalendarIcon, label: 'Schedule' },
    { path: '/admin/stats', icon: BarChart3, label: 'Statistics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Portal</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors ${
                isActive ? 'bg-gray-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;