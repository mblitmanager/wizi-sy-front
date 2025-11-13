import {
  Home,
  LayoutList,
  Trophy,
  Brain,
  Bell,
  BookOpen,
  Video,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useAuth";

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
      icon: BookOpen,
      label: "Formations",
      href: "/catalogue",
    },
    {
      icon: Brain,
      label: "Quiz",
      href: "/quizzes",
      gold: true,
    },
    {
      icon: Trophy,
      label: "Classement",
      href: "/classement",
    },
    {
      label: "Tutoriel",
      href: "/tuto-astuce",
      icon: Video,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-safe z-50">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          const isQuizActive = isActive && item.gold;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex flex-col items-center gap-1 p-2 relative transition-all duration-300 ease-in-out",
                "min-w-[60px]"
              )}>
              {/* Bulle d'arrière-plan pour l'élément actif */}
              {isActive && (
                <div className="absolute -top-1 inset-x-0 flex justify-center">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full shadow-lg flex items-center justify-center",
                      isQuizActive
                        ? "bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-purple-500/30"
                        : "bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-yellow-500/30"
                    )}>
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        isQuizActive ? "bg-purple-100" : "bg-yellow-100"
                      )}>
                      {/* Légère ombre intérieure */}
                      <div className="absolute inset-0 rounded-full shadow-inner"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Conteneur d'icône avec position relative */}
              <span
                className={cn(
                  "relative flex items-center justify-center transition-all duration-300 z-10",
                  isActive ? "mt-2" : "mt-0"
                )}>
                <item.icon
                  className={cn(
                    "transition-all duration-300",
                    isActive
                      ? isQuizActive
                        ? "h-7 w-7 text-[#667eea] drop-shadow-sm"
                        : "h-7 w-7 text-yellow-600 drop-shadow-sm"
                      : "h-6 w-6 text-gray-500 group-hover:text-yellow-500"
                  )}
                />
                {item.badge !== undefined && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {item.badge}
                  </Badge>
                )}
              </span>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-semibold transition-all duration-300 mt-1",
                  isActive
                    ? isQuizActive
                      ? "text-[#667eea] font-bold"
                      : "text-yellow-600 font-bold"
                    : "text-gray-500 group-hover:text-yellow-600"
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
