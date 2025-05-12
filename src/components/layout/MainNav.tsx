
import {
  Home,
  GraduationCap,
  Brain,
  Video,
  LayoutGrid,
  User,
  Settings,
  Trophy,
  LogOut,
  Users,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { sponsorshipService } from "@/services/sponsorshipService";

interface MainNavProps {
  showBottomNav?: boolean;
}

export default function MainNav({ showBottomNav = false }: MainNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const pathname = location.pathname;

  const { data: sponsorshipStats } = useQuery({
    queryKey: ['sponsorship', 'stats'],
    queryFn: () => sponsorshipService.getStats(),
    staleTime: 60000,
    enabled: !!user
  });

  const referralsCount = sponsorshipStats?.totalReferrals || 0;

  // Main navigation items
  const items = [
    {
      title: "Accueil",
      href: "/",
      icon: Home,
    },
    {
      title: "Quiz",
      href: "/quizzes",
      icon: Brain,
    },
    {
      title: "Classement",
      href: "/classement",
      icon: Trophy,
    },
    {
      title: "Tutoriels",
      href: "/tuto-astuce",
      icon: Video,
    },
    {
      title: "Formations",
      href: "/catalogue",
      icon: GraduationCap,
    },
    {
      title: "Parrainage",
      href: "/profile?tab=parrainage",
      icon: Users,
      badge: referralsCount,
    },
    {
      title: "Profil",
      href: "/profile",
      icon: User,
    },
  ];

  const handleLogout = async () => {
    try {
      // 1. Nettoyage immédiat
      localStorage.removeItem("token");

      // 2. Déconnexion globale (si votre hook gère un état)
      if (logout) logout();

      // Redirection avec React Router
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <ul className="space-y-1 p-3">
            {items.map((item) => (
              <li key={item.href} className="py-2">
                <NavLink
                  to={item.href}
                  className={({ isActive }) => {
                    const baseClasses =
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full transition-all";
                    const activeClasses = "bg-yellow-400 text-white shadow-md";
                    const inactiveClasses =
                      "text-gray-500 hover:bg-gray-100 hover:text-gray-800";

                    return `${baseClasses} ${
                      isActive ? activeClasses : inactiveClasses
                    }`;
                  }}>
                  {({ isActive }) => (
                    <>
                      <div className="relative">
                        <item.icon
                          className={`w-6 h-6 ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                        />
                        {item.badge && item.badge > 0 && (
                          <Badge className="absolute -top-2 -right-2 h-4 min-w-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {item.title}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
