import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Users,
  BookOpen,
  HelpCircle,
  Settings,
  LogOut,
  BarChart3,
  Award,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      label: "Stagiaires",
      href: "/admin/stagiaires",
      icon: Users,
    },
    {
      label: "Formations",
      href: "/admin/formations",
      icon: BookOpen,
    },
    {
      label: "Quiz",
      href: "/admin/quiz",
      icon: HelpCircle,
    },
    {
      label: "Catalogue",
      href: "/admin/catalogue",
      icon: ShoppingCart,
    },
    {
      label: "Formateurs",
      href: "/admin/formateurs",
      icon: Users,
    },
    {
      label: "Commerciaux",
      href: "/admin/commerciaux",
      icon: Users,
    },
    {
      label: "Achievements",
      href: "/admin/achievements",
      icon: Award,
    },
    {
      label: "Statistiques",
      href: "/admin/stats",
      icon: BarChart3,
    },
    {
      label: "Paramètres",
      href: "/admin/parametres",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-orange-500">Wizi Admin</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                  active
                    ? "bg-orange-600 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}>
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-2 w-full text-gray-400 hover:bg-gray-800 rounded-lg transition-all">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Panneau d'Administration</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
