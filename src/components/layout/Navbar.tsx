import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { rankingService } from "@/services/rankingService";
import { parrainageService } from "@/services/parrainageService";
import logo from "../../assets/logo.png";

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
export function Navbar() {
  const { user, logout } = useUser();
  const isMobile = useIsMobile();
  const [userScore, setUserScore] = useState<number | null>(null);
  const [filleulsCount, setFilleulsCount] = useState<number | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Fetch unread notifications count
  useEffect(() => {
    // This would typically come from a backend API call
    setUnreadNotifications(2);
  }, []);
  useEffect(() => {
    const fetchScore = async () => {
      if (!user || !user.stagiaire) return;
      try {
        const ranking = await rankingService.getGlobalRanking();
        // Les données du backend sont sous la forme { stagiaire: { id, ... }, totalPoints, ... }
        const entry = ranking.find(
          (e: any) =>
            e.stagiaire?.id?.toString() === user.stagiaire.id?.toString()
        );
        setUserScore(entry ? entry.totalPoints : 0);
      } catch (e) {
        setUserScore(null);
      }
    };
    fetchScore();
  }, [user]);

  useEffect(() => {
    const fetchFilleuls = async () => {
      try {
        const stats = await parrainageService.getParrainageStats();
        setFilleulsCount(stats.total_filleuls ?? 0);
      } catch (e) {
        setFilleulsCount(null);
      }
    };
    if (user) fetchFilleuls();
  }, [user]);
  const getInitials = () => {
    if (!user || !user.user.name) return "U";
    // Récupère la première lettre du prénom si disponible
    const firstNameInitial = user.stagiaire?.prenom
      ? user.stagiaire.prenom.charAt(0).toUpperCase()
      : "";

    // Récupère la première lettre du nom
    const lastNameInitial = user.user.name.charAt(0).toUpperCase();

    return `${firstNameInitial}${lastNameInitial}`;
  };

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
    <nav className="px-4 md:px-6 py-2 sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full">
        {/* Bloc gauche - Logo uniquement mobile */}
        <div className="max-w-sm">
          {isMobile && <img src={logo} alt="Logo" className="h-8 w-auto" />}
        </div>

        {/* Bloc droite - Notifications + Dropdown */}
        {user && (
          <div className="flex items-center gap-4">
           <Link to="/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 transition"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 text-xs bg-red-500 text-white animate-pulse">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </Link>
                   
              {userScore !== null && (
                <span className="ml-2 text-yellow-600 font-bold text-sm">
                  {userScore} pts
                </span>
              )}
               {filleulsCount !== null && (
              <span className="ml-2 text-blue-600 font-bold text-sm flex items-center">
                <Users className="inline h-4 w-4 mr-1" />
                {filleulsCount} filleul{filleulsCount > 1 ? "s" : ""}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center gap-2 p-1 rounded-full hover:shadow-md transition focus:outline-none">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                    {user.image ? (
                      <img
                        src={`${VITE_API_URL_MEDIA}/${user.image}`}
                        alt={user.name || "User"}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextSibling && e.currentTarget.nextSibling instanceof HTMLElement) {
                            (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <span
                      className="font-medium"
                      style={{ display: user.image ? "none" : "flex" }}>
                      {getInitials()}
                    </span>
                  </div>
                  {!isMobile && (
                    <div className="flex flex-col items-start mr-2">
                      <span className="text-sm font-medium">
                        {(user.user?.name || '').toUpperCase()} {user.stagiaire?.prenom || ''}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.role}
                      </span>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 shadow-lg">
                <DropdownMenuLabel className="text-gray-700">
                  Mon compte
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center w-full hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/settings"
                    className="flex items-center w-full hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}
