import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Trophy, Settings, ChevronDown } from "lucide-react";
import { useUser } from "@/hooks/useAuth";
import { useClassementPoints } from "@/hooks/useClassementPoints";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { cn } from "@/lib/utils";
import type { User as AppUser } from "@/types";
import { getUserAccount } from "@/utils/userAccount";

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;

const ROLE_LABELS: Record<string, string> = {
  stagiaire: "Stagiaire",
  formateur: "Formateur",
  formatrice: "Formatrice",
  commercial: "Commercial",
  commerciale: "Commerciale",
  admin: "Administrateur",
  administrateur: "Administrateur",
};

/* ---------------------- Helpers partagés ---------------------- */

export function getUserInitials(user: AppUser | null): string {
  if (!user) return "U";
  const firstNameInitial = user?.stagiaire?.prenom?.[0]?.toUpperCase() ?? "";
  const lastNameInitial = getUserAccount(user).name[0]?.toUpperCase() ?? "U";
  return `${firstNameInitial}${lastNameInitial}`;
}

export function getUserDisplayName(user: AppUser | null): string {
  if (!user) return "";
  const name = getUserAccount(user).name;
  const prenom = user?.stagiaire?.prenom || "";
  return [prenom, name.toUpperCase()].filter(Boolean).join(" ");
}

export function getRoleLabel(role?: string | null): string {
  return ROLE_LABELS[role?.toLowerCase() ?? ""] ?? role ?? "";
}

/** Avatar utilisateur (photo de profil ou initiales). */
export function UserAvatar({ user, className }: { user: AppUser; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const account = getUserAccount(user);

  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground ring-2 ring-card",
        className
      )}
    >
      {account.image && !imageError ? (
        <img
          src={`${VITE_API_URL_MEDIA}/${account.image}`}
          alt={account.name || "Utilisateur"}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{getUserInitials(user)}</span>
      )}
    </span>
  );
}

/* ---------------------- Navbar (partie droite de l'en-tête) ---------------------- */

export function Navbar(_props: { onMenuToggle?: () => void }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  // Score partagé avec les pages quiz (une seule requête de classement)
  const { points, loading: scoreLoading } = useClassementPoints();
  const userScore = user?.stagiaire?.id && !scoreLoading ? points : null;

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout, navigate]);

  if (!user) return null;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {userScore !== null && (
        <Link
          to="/classement"
          className="hidden items-center gap-1.5 rounded-full border border-border bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground transition-colors hover:border-primary/60 sm:flex"
          title="Voir le classement"
        >
          <Trophy className="h-4 w-4 text-gold-deep" />
          <span className="tabular-nums">{userScore}</span>
          <span className="font-medium opacity-80">pts</span>
        </Link>
      )}

      <NotificationDropdown />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:pr-2.5"
            aria-label="Menu du compte"
          >
            <UserAvatar user={user} />
            <span className="hidden max-w-[160px] flex-col items-start leading-tight lg:flex">
              <span className="w-full truncate text-sm font-semibold text-foreground">{getUserDisplayName(user)}</span>
              <span className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
          <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2 font-normal">
            <UserAvatar user={user} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{getUserDisplayName(user)}</span>
              <span className="block truncate text-xs text-muted-foreground">{getUserAccount(user).email || getRoleLabel(user.role)}</span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2">
            <Link to="/profile">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              Mon profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2">
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              Paramètres
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer rounded-lg py-2 text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
