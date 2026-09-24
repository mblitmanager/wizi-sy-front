import React, { useState, useCallback } from "react";
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

import { LogOut, User, Trophy } from "lucide-react";

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
import { useClassementPoints } from "@/hooks/useClassementPoints";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { parrainageService } from "@/services/parrainageService";
import type { User as AppUser } from "@/types";

import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

/* ---------------------- Sous-composants ---------------------- */

// Avatar utilisateur
const UserAvatar = ({ user, initials }: { user: AppUser; initials: string }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 overflow-hidden"
      style={{ boxShadow: `0 0 0 2px var(--brand-primary)` }}
    >
      {user?.user?.image && !imageError ? (
        <img
          src={`${VITE_API_URL_MEDIA}/${user.user.image}`}
          alt={user.user.name || "User"}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-semibold">{initials}</span>
      )}
    </div>
  );
};

// Infos utilisateur
const UserInfo = ({ user }: { user: AppUser }) => (
  <div className="mr-2 hidden flex-col items-start sm:flex">
    <span className="text-sm font-semibold text-[#173f46]">
      {(user?.user?.name || "").toUpperCase()} {user?.stagiaire?.prenom || ""}
    </span>
    <span className="text-xs capitalize text-[#6b7773]">{user.role}</span>
  </div>
);

// Menu utilisateur
const UserDropdownMenu = ({ onLogout }: { onLogout: () => void }) => (
  <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-xl">
    <DropdownMenuLabel className="text-gray-700">Mon compte</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
      <Link to="/profile" className="flex items-center">
  <User className="mr-2 h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
        <span>Profil</span>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      onClick={onLogout}
      className="text-red-600 hover:bg-red-50">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Déconnexion</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
);

// Badge de notifications
const NotificationBadge = ({ count }: { count: number }) => (
  <Link to="/notifications">
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-xl transition hover:bg-[#fff4d8]"
      style={{
        // subtle hover handled via CSS class using the existing Tailwind tokens
      }}>
      <Bell className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
      {count > 0 && (
        <Badge
          className="absolute -right-1 -top-1 h-5 min-w-5 animate-pulse px-1.5 text-xs text-white"
          style={{ backgroundColor: 'var(--brand-primary)' }}>
          {count}
        </Badge>
      )}
    </Button>
  </Link>
);

// Score utilisateur
const UserScore = ({ score }: { score: number | null }) => {
  if (score === null) return null;

  return (
    <>
      <span className="ml-2 flex items-center text-sm font-semibold text-[#173f46]">
        <Trophy className="inline h-4 w-4 mr-1" style={{ color: 'var(--brand-primary)' }} />
        {score} pts
      </span>
    </>
  );

};

/* ---------------------- Navbar principale ---------------------- */

export function Navbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { user, logout } = useUser();
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  // Score partagé avec les pages quiz (une seule requête de classement)
  const { points, loading: scoreLoading } = useClassementPoints();
  const userScore = user?.stagiaire?.id && !scoreLoading ? points : null;

  // Initiales
  const getInitials = useCallback(() => {
    if (!user) return "U";
    const firstNameInitial = user?.stagiaire?.prenom?.[0]?.toUpperCase() ?? "";
    const lastNameInitial = user?.user?.name?.[0]?.toUpperCase() ?? "U";
    return `${firstNameInitial}${lastNameInitial}`;
  }, [user]);

  // Déconnexion
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout, navigate]);

  if (!user) {
    return (
      <nav className="px-2 md:px-6 py-2 sticky top-0 z-50 w-full text-white shadow-md bg-brand-primary">
        {/* Navbar pour utilisateur non connecté (à compléter si besoin) */}
      </nav>
    );
  }

  const initials = getInitials();

  return (
    <nav className="w-full px-1 py-1 md:px-2">
      <div className="w-full">
        <div className="flex items-center justify-end gap-3">
          {/* left: hamburger + logo */}
          <div className="flex items-center gap-3">
            {/* {(isTablet || isMobile) && (
              <button
                onClick={() => onMenuToggle && onMenuToggle()}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200">
                <Menu className="h-5 w-5" />
              </button>
            )} */}
            {(isTablet || isMobile) && (
              <Link to="/" className="flex items-center">
                <img
                  src="/assets/logo.png"
                  alt="Wizi Learn"
                  className={`object-contain ${isMobile ? "h-6" : "h-8"}`}
                />
              </Link>
            )}
            
          </div>

          {/* right: points + notifications + user menu */}
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="hidden rounded-xl border border-[#d3e2de] bg-[#eaf2f0] px-3 py-2 sm:block">
              <UserScore score={userScore} />
            </div>
            <NotificationDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 transition hover:border-[#d3e2de] hover:bg-[#eaf2f0]">
                  <UserAvatar user={user} initials={initials} />
                  <UserInfo user={user} />
                </button>
              </DropdownMenuTrigger>
              <UserDropdownMenu onLogout={handleLogout} />
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
