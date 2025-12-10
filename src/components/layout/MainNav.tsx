import {
  Home,
  GraduationCap,
  Brain,
  Video,
  User,
  Trophy,
  Gift,
  HelpCircle,
  FileText,
  Mail,
  Book,
  Heart,
  Shield,
  ChevronDown,
  Award,
  BarChart3,
  LayoutDashboard,
  Users as UsersIcon,
  Briefcase,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface MainNavProps {
  showBottomNav?: boolean;
  onItemClick?: () => void;
}

export default function MainNav({
  showBottomNav = false,
  onItemClick,
}: MainNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Navigation principale
  const mainNavItems = [
    {
      title: "Accueil",
      href: "/",
      icon: Home,
      color: "text-yellow-600",
    },
    {
      title: "Formation",
      href: "/catalogue",
      icon: GraduationCap,
      color: "text-yellow-600",
    },
    {
      title: "Quiz",
      href: "/quizzes",
      icon: Brain,
      color: "text-yellow-600",
    },
    {
      title: "Classement",
      href: "/classement",
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      title: "Tutoriel",
      href: "/tuto-astuce",
      icon: Video,
      color: "text-yellow-600",
    },
    {
      title: "Parrainage",
      href: "/parrainage",
      icon: Gift,
      color: "text-yellow-600",
    },
  ];

  // Sous-navigation du profil
  const profileNavItems = [
    {
      title: "Mes Informations",
      href: "/profile",
      icon: User,
      color: "text-yellow-600",
    },
    {
      title: "Mes Badges",
      href: "/profile/badges",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      title: "Mes Formations",
      href: "/profile/formations",
      icon: GraduationCap,
      color: "text-yellow-600",
    },
    {
      title: "Mes Statistiques",
      href: "/profile/statistiques",
      icon: BarChart3,
      color: "text-yellow-600",
    },
  ];

  // Navigation Aide & Information
  const helpNavItems = [
    {
      title: "FAQ",
      href: "/faq",
      icon: HelpCircle,
      color: "text-yellow-600",
    },
    {
      title: "CGV",
      href: "/cgv",
      icon: FileText,
      color: "text-yellow-600",
    },
    {
      title: "Contact & Support",
      href: "/contact-support",
      icon: Mail,
      color: "text-yellow-600",
    },
    {
      title: "Manuel d'utilisation",
      href: "/manuel",
      icon: Book,
      color: "text-yellow-600",
    },
    {
      title: "Remerciements",
      href: "/remerciements",
      icon: Heart,
      color: "text-yellow-600",
    },
    {
      title: "Confidentialité",
      href: "/politique-confidentialite",
      icon: Shield,
      color: "text-yellow-600",
    },
  ];

  // Dashboard navigation (role-based)
  const dashboardNavItems = [
    ...(user?.role === 'admin' ? [{
      title: "Statistiques Admin",
      href: "/admin/statistics",
      icon: LayoutDashboard,
      color: "text-yellow-600",
    }] : []),
    ...(['formateur', 'formatrice'].includes(user?.role || '') ? [{
      title: "Dashboard Formateur",
      href: "/formateur/dashboard",
      icon: UsersIcon,
      color: "text-yellow-600",
    }] : []),
    ...(['commercial', 'commerciale'].includes(user?.role || '') ? [{
      title: "Dashboard Commercial",
      href: "/commercial/dashboard",
      icon: Briefcase,
      color: "text-yellow-600",
    }] : []),
  ];

  const NavItem = ({ item }: { item: (typeof mainNavItems)[0] }) => (
    <NavLink
      to={item.href}
      onClick={onItemClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border-l-4 ${isActive
          ? "bg-yellow-50 border-yellow-500 text-yellow-700 font-semibold shadow-sm"
          : "border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        }`
      }>
      {({ isActive }) => (
        <>
          <div
            className={`p-2 rounded-lg ${isActive ? "bg-yellow-100" : "bg-gray-100"
              }`}>
            <item.icon
              className={`w-5 h-5 ${isActive ? "text-yellow-600" : item.color}`}
            />
          </div>
          <span className="text-sm">{item.title}</span>
          {isActive && (
            <div className="ml-auto w-2 h-2 bg-yellow-500 rounded-full" />
          )}
        </>
      )}
    </NavLink>
  );

  const ProfileNavItem = ({ item }: { item: (typeof profileNavItems)[0] }) => (
    <NavLink
      to={item.href}
      onClick={onItemClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border-l-4 ${isActive
          ? "bg-yellow-50 border-yellow-500 text-yellow-700 font-semibold shadow-sm"
          : "border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        }`
      }>
      {({ isActive }) => (
        <>
          <div
            className={`p-2 rounded-lg ${isActive ? "bg-yellow-100" : "bg-gray-100"
              }`}>
            <item.icon
              className={`w-5 h-5 ${isActive ? "text-yellow-600" : item.color}`}
            />
          </div>
          <span className="text-sm">{item.title}</span>
          {isActive && (
            <div className="ml-auto w-2 h-2 bg-yellow-500 rounded-full" />
          )}
        </>
      )}
    </NavLink>
  );

  const HelpNavItem = ({ item }: { item: (typeof helpNavItems)[0] }) => (
    <NavLink
      to={item.href}
      onClick={onItemClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border-l-4 ${isActive
          ? "bg-yellow-50 border-yellow-500 text-yellow-700 font-semibold shadow-sm"
          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300"
        }`
      }>
      {({ isActive }) => (
        <>
          <div
            className={`p-2 rounded-lg ${isActive ? "bg-yellow-100" : "bg-gray-100"
              }`}>
            <item.icon
              className={`w-5 h-5 ${isActive ? "text-yellow-600" : item.color}`}
            />
          </div>
          <span className="text-sm">{item.title}</span>
          {isActive && (
            <div className="ml-auto w-2 h-2 bg-yellow-500 rounded-full" />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Navigation avec scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6 h-[600px]">
          {/* Navigation principale */}
          <div className="space-y-1 hidden md:block">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Navigation
            </h3>
            {mainNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          {/* Section Profil - Tous les items au même niveau */}
          <div className="space-y-1">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Mon Profil
            </h3>
            {profileNavItems.map((item) => (
              <ProfileNavItem key={item.href} item={item} />
            ))}
          </div>

          {/* Section Dashboard (role-based) */}
          {dashboardNavItems.length > 0 && (
            <div className="space-y-1">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Dashboard
              </h3>
              {dashboardNavItems.map((item) => (
                <ProfileNavItem key={item.href} item={item} />
              ))}
            </div>
          )}

          {/* Section Aide & Information */}
          <div className="space-y-1">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Aide & Information
            </h3>
            {helpNavItems.map((item) => (
              <HelpNavItem key={item.href} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
