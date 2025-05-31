import {
  Home,
  LayoutList,
  Trophy,
  Bell,
  BookOpen,
  Video,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: number;
  gold?: boolean; // Ajout de la propriété gold pour le style spécial Quiz
}

export function MobileNav() {
  const location = useLocation();
  const { user } = useUser();

  const items: NavItem[] = [
    {
      icon: Home,
      label: "Accueil",
      href: "/",
    },
    {
      icon: LayoutList,
      label: "Formations",
      href: "/catalogue",
    },
    {
      icon: BookOpen,
      label: "Quiz",
      href: "/quizzes",
      // Ajout d'une propriété spéciale pour le style
      gold: true,
    },
    {
      icon: Trophy,
      label: "Classement",
      href: "/classement",
    },

    // {
    //   icon: Bell,
    //   label: "Notifs",
    //   href: "/notifications",
    //   badge: 2
    // },
    {
      label: "Tutoriels",
      href: "/tuto-astuce",
      icon: Video,
    },
    // {
    //   icon: UserRound,
    //   label: "Profile",
    //   href: "/profile"
    // }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background pb-safe z-50">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          const isHoverOrActive = isActive;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex flex-col items-center gap-0.5 p-1 relative transition-all duration-200",
                (isActive || item.label === "Quiz") &&
                  "z-10 mt-0 border-t-2 rounded-lg border-yellow-500 !p-2 text-yellow-700"
              )}>
              <span className="relative flex items-center justify-center">
                <item.icon
                  className={cn(
                    "transition-all",
                    isActive || item.label === "Quiz"
                      ? "h-6 w-6 text-yellow-500 drop-shadow-lg"
                      : "h-5 w-5 text-muted-foreground group-hover:text-yellow-500 group-hover:h-7 group-hover:w-7"
                  )}
                />
                {item.badge !== undefined && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center">
                    {item.badge}
                  </Badge>
                )}
              </span>
              <span
                className={cn(
                  "text-[12px] font-bold transition-all",
                  isActive || item.label === "Quiz"
                    ? "text-yellow-700"
                    : "text-muted-foreground group-hover:text-yellow-700"
                )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
