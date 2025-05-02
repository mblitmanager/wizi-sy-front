
import {
  Home,
  GraduationCap,
  Brain,
  Video,
  LayoutGrid,
  User,
  Settings,Trophy,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
      title: "Catalogue",
      href: "/catalogue",
      icon: GraduationCap,
    },
    {
      title: "Profil",
      href: "/profile",
      icon: User,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Wizi Learn
          </h2>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground w-full justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} alt="Avatar" />
                  <AvatarFallback>
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <span>Mon compte</span>
              </div>
              <Settings className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
