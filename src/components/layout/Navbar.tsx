
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
import { Bell, LogOut, Settings, User, Users, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "../../assets/logo.png";
import { useQuery } from "@tanstack/react-query";
import { sponsorshipService } from "@/services/sponsorshipService";

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;

export function Navbar() {
  const { user, logout } = useUser();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: sponsorshipStats } = useQuery({
    queryKey: ['sponsorship', 'stats'],
    queryFn: () => sponsorshipService.getStats(),
    staleTime: 60000,
    enabled: !!user,
  });

  const getInitials = () => {
    if (!user) return "U";
    
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

      // 3. Redirection avec React Router
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const referralsCount = sponsorshipStats?.totalReferrals || 0;
  const userPoints = user?.stagiaire?.points || 0;

  return (
    <nav className="px-4 md:px-6 py-3 sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full">
        {/* Bloc gauche - Logo uniquement mobile et sponsorship info */}
        <div className="flex items-center gap-4">
          {isMobile && <img src={logo} alt="Logo" className="h-8 w-auto" />}
          
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{userPoints} pts</span>
              </Link>
              
              <Link to="/profile?tab=parrainage" className="bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-medium">{referralsCount} filleuls</span>
              </Link>
            </div>
          )}
        </div>

        {/* Bloc droite - Notifications + Dropdown */}
        {user && (
          <div className="flex items-center gap-4">
            <Link to="/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 transition">
                <Bell className="h-5 w-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 text-xs bg-red-500 text-white animate-pulse">
                  2
                </Badge>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center gap-2 p-1 rounded-full hover:shadow-md transition focus:outline-none">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                    {user.user.image ? (
                      <img
                        src={`${VITE_API_URL_MEDIA}/${user.user.image}`}
                        alt={user.user.name || "User"}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = "none";
                          const nextSibling = target.nextSibling as HTMLElement;
                          if (nextSibling) {
                            nextSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <span
                      className="font-medium"
                      style={{ display: user.user.image ? "none" : "flex" }}>
                      {getInitials()}
                    </span>
                  </div>
                  {!isMobile && (
                    <div className="flex flex-col items-start mr-2">
                      <span className="text-sm font-medium">
                        {user.stagiaire.prenom} {user.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.user.role}
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
                    className="flex items-center w-full hover:bg-gray-100 px-2 py-1 rounded">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/settings"
                    className="flex items-center w-full hover:bg-gray-100 px-2 py-1 rounded">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 hover:bg-red-50 px-2 py-1 rounded">
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
