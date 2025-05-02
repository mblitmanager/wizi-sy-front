
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

export function Navbar() {
  const { user, logout } = useUser();
  const isMobile = useIsMobile();

  // Function to safely get the first letter of the user's name
  const getInitial = () => {
    if (!user || !user.name) return "U"; // Default fallback if user or user.name is missing
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <nav className="border-b bg-white px-4 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/e4aa6740-d9f0-40d2-a150-efc75ae46692.png" 
              alt="Wizi Learn" 
              className="h-10"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center">
                  2
                </Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name || "User"} />
                      <AvatarFallback>
                        {getInitial()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {!isMobile && (
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Inscription</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
