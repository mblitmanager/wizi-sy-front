import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Bell, LogOut, Settings, User, Trophy } from "lucide-react";

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
import { rankingService } from "@/services/rankingService";
import { parrainageService } from "@/services/parrainageService";

// Sous-composant pour l'avatar utilisateur
const UserAvatar = ({ user, initials }: { user: any; initials: string }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-brown-shade text-white">
      {user?.user?.image && !imageError ? (
        <img
          src={`${VITE_API_URL_MEDIA}/${user.user.image}`}
          alt={user.user.name || "User"}
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-medium">{initials}</span>
      )}
    </div>
  );
};

// Sous-composant pour les informations utilisateur
const UserInfo = ({ user }: { user: any }) => (
  <div className="flex flex-col items-start mr-2">
    <span className="text-sm font-medium">
      {(user?.user?.name || "").toUpperCase()} {user?.stagiaire?.prenom || ""}
    </span>
    <span className="text-xs text-gray-500">{user.role}</span>
  </div>
);

// Sous-composant pour le menu déroulant
const UserDropdownMenu = ({ onLogout }: { onLogout: () => void }) => (
  <DropdownMenuContent align="end" className="w-48 shadow-lg">
    <DropdownMenuLabel className="text-gray-700">Mon compte</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
      <Link to="/profile" className="dropdown-menu-item">
        <User className="mr-2 h-4 w-4" />
        <span>Profil</span>
      </Link>
    </DropdownMenuItem>
    {/* <DropdownMenuItem asChild>
      <Link to="/settings" className="dropdown-menu-item">
        <Settings className="mr-2 h-4 w-4" />
        <span>Paramètres</span>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator /> */}
    <DropdownMenuItem
      onClick={onLogout}
      className="dropdown-menu-item text-red-600 hover:bg-red-50">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Déconnexion</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
);

// Sous-composant pour le badge de notifications
const NotificationBadge = ({ count }: { count: number }) => (
  <Link to="/notifications">
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:bg-gray-100 transition">
      <Bell className="h-5 w-5 text-gray-600" />
      {count > 0 && (
        <Badge className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 text-xs bg-amber-500 text-white animate-pulse">
          {count}
        </Badge>
      )}
    </Button>
  </Link>
);

// Sous-composant pour le score utilisateur
const UserScore = ({ score }: { score: number | null }) => {
  if (score === null) return null;

  return (
    <span className="ml-2 text-sm">
      <Trophy className="inline h-4 w-4 mr-1" />
      {score} pts
    </span>
  );
};

export function Navbar() {
  const { user, logout } = useUser();
  const isMobile = useIsMobile();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [userScore, setUserScore] = useState<number | null>(null);
  const [filleulsCount, setFilleulsCount] = useState<number | null>(null);

  // Récupération du score utilisateur
  const fetchUserScore = useCallback(async () => {
    if (!user?.stagiaire?.id) return;

    try {
      const ranking = await rankingService.getGlobalRanking();
      const entry = ranking.find(
        (e: any) =>
          e.stagiaire?.id?.toString() === user.stagiaire.id?.toString()
      );
      setUserScore(entry?.totalPoints ?? 0);
    } catch (error) {
      console.error("Failed to fetch user score:", error);
      setUserScore(null);
    }
  }, [user]);

  // Récupération du nombre de filleuls
  const fetchFilleulsCount = useCallback(async () => {
    try {
      const stats = await parrainageService.getParrainageStats();
      setFilleulsCount(stats.total_filleuls ?? 0);
    } catch (error) {
      console.error("Failed to fetch filleuls count:", error);
      setFilleulsCount(null);
    }
  }, []);

  // Initialisation des données
  useEffect(() => {
    fetchUserScore();
    if (user) fetchFilleulsCount();
  }, [user, fetchUserScore, fetchFilleulsCount]);

  // Calcul des initiales
  const getInitials = useCallback(() => {
    if (!user) return "U";
    const firstNameInitial = user?.stagiaire?.prenom?.[0]?.toUpperCase() ?? "";
    const lastNameInitial = user?.user?.name?.[0]?.toUpperCase() ?? "U";
    return `${firstNameInitial}${lastNameInitial}`;
  }, [user]);

  // Gestion de la déconnexion
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout, navigate]);

  if (!user) {
    return (
      <nav className="px-2 md:px-6 py-2 sticky top-0 z-50 w-full bg-amber-300 md:bg-white">
        {/* Contenu pour les utilisateurs non connectés */}
      </nav>
    );
  }

  const initials = getInitials();

  return (
    <nav className="px-2 md:px-6 py-2 sticky top-0 z-50 w-full ">
      <div className="w-full">
        <div className="flex justify-between md:justify-end items-center gap-4">
          <div className="flex items-center gap-3">
            <NotificationBadge count={unreadCount} />
            <UserScore score={userScore} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative flex items-center gap-2 p-1 rounded-full hover:shadow-md transition focus:outline-none">
                <UserAvatar user={user} initials={initials} />
                {!isMobile && <UserInfo user={user} />}
              </button>
            </DropdownMenuTrigger>
            <UserDropdownMenu onLogout={handleLogout} />
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
