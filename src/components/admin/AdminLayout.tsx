import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { useUser } from "@/hooks/useAuth";
import { BrandLogos } from "@/components/layout/BrandLogos";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout } = useUser();

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
      href: "/admin/catalogue-formations",
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
      href: "/admin/statistics",
      icon: BarChart3,
    },
    {
      label: "Paramètres",
      href: "/admin/parametres",
      icon: Settings,
    },
  ];

  // Déconnexion via le contexte : vide la session en mémoire, pas seulement le stockage
  const handleLogout = () => {
    logout();
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-[72px]"
        } flex flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200`}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between gap-2 px-4">
          {sidebarOpen && (
            <Link to="/admin/dashboard" className="flex items-center gap-2 overflow-hidden">
              <BrandLogos size="h-7" />
              <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                Admin
              </span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mx-auto rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={sidebarOpen ? "Réduire le menu" : "Déplier le menu"}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3" aria-label="Administration">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                title={sidebarOpen ? undefined : item.label}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-secondary hover:text-foreground"
                } ${sidebarOpen ? "" : "justify-center"}`}>
                {active && <span aria-hidden className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gold" />}
                <Icon size={18} className={active ? "text-primary" : "text-muted-foreground"} />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={handleLogout}
            title={sidebarOpen ? undefined : "Déconnexion"}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 ${sidebarOpen ? "" : "justify-center"}`}>
            <LogOut size={18} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center border-b border-border bg-card px-6">
          <h1 className="font-poppins text-lg font-semibold text-foreground">
            {menuItems.find((item) => isActive(item.href))?.label ?? "Panneau d'administration"}
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
};
