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

interface MainNavProps {
  showBottomNav?: boolean;
}

export default function MainNav({ showBottomNav = false }: MainNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const pathname = location.pathname;

  // Main navigation items
  const items = [
    {
      title: "Accueil",
      href: "/",
      icon: Home,
    },
    // {
    //   title: "Formations",
    //   href: "/formations",
    //   icon: GraduationCap,
    // },
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
      title: "Profile",
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

      // 3. Option 1: Redirection ultra-rapide (recharge la page)
      // window.location.assign("/login");

      // OU Option 2: Redirection avec React Router (moins instantanée)
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
                      <item.icon
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                      {item.title}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom user menu */}
      <div className="mt-auto px-3 py-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-100 transition">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} alt="Avatar" />
                <AvatarFallback>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-700">Mon compte</span>
              <Settings className="ml-auto w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-lg w-48">
            <DropdownMenuLabel className="text-gray-500">
              Mon compte
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
