import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Users, 
  Calendar as CalendarIcon,
  UserCircle,
  Settings,
  BarChart3,
  Phone,
  Trophy,
  Share2,
  Gift,
  BookOpen,
  Play,
  History,
  Award,
  Target,
  Languages,
  Bell,
  Settings as SettingsIcon
} from 'lucide-react';
import useAuthStore from '../store/authStore';

function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const studentNavItems = [
    { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/quiz', icon: BrainCircuit, label: 'Quiz' },
    { path: '/formations', icon: BookOpen, label: 'Formations' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendrier' },
    { path: '/contacts', icon: Phone, label: 'Contacts' },
    { path: '/ranking', icon: Trophy, label: 'Classement' },
    { path: '/challenges', icon: Target, label: 'Défis' },
    { path: '/games/language', icon: Languages, label: 'Apprentissage Langues' },
    { path: '/referral', icon: Share2, label: 'Parrainage' },
    { path: '/catalog', icon: BookOpen, label: 'Catalogue' },
    { path: '/tutorials', icon: Play, label: 'Tutoriels' },
    { path: '/history', icon: History, label: 'Historique' },
    { path: '/achievements', icon: Award, label: 'Récompenses' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/settings', icon: SettingsIcon, label: 'Paramètres' },
    { path: '/profile', icon: UserCircle, label: 'Profil' }
  ];

  const adminNavItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
    { path: '/admin/quizzes', icon: BrainCircuit, label: 'Quiz' },
    { path: '/admin/contacts', icon: Phone, label: 'Contacts' },
    { path: '/admin/rankings', icon: Trophy, label: 'Classements' },
    { path: '/admin/referrals', icon: Gift, label: 'Parrainages' },
    { path: '/admin/media', icon: Play, label: 'Médias' },
    { path: '/admin/challenges', icon: Target, label: 'Défis' },
    { path: '/admin/schedule', icon: CalendarIcon, label: 'Planning' },
    { path: '/admin/stats', icon: BarChart3, label: 'Statistiques' },
    { path: '/admin/settings', icon: Settings, label: 'Paramètres' }
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Wizi Learn</h1>
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