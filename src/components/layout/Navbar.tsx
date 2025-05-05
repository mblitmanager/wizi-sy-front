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
import { Bell, LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import logo from "../../assets/logo.png";

export function Navbar() {
  const { user, logout } = useUser();
  const isMobile = useIsMobile();

  const getInitial = () => {
    if (!user || !user.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <nav className="px-4 md:px-6 py-3 sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full">
        {/* Bloc gauche - Logo uniquement mobile */}
        <div className="max-w-sm">
          {isMobile && <img src={logo} alt="Logo" className="h-8 w-auto" />}
        </div>

        {/* Bloc droite - Notifications + Dropdown uniquement mobile */}
        {isMobile && user && (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 transition">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 text-xs bg-red-500 text-white animate-pulse">
                2
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 p-0 rounded-full border hover:shadow-md transition">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name || "User"} />
                    <AvatarFallback>{getInitial()}</AvatarFallback>
                  </Avatar>
                </Button>
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
                  onClick={logout}
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
