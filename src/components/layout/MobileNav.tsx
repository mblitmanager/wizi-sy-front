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
      label: "Formation",
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white pt-2 pb-safe z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      <div className="flex items-end justify-around pb-2">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          const isQuiz = item.gold;

          if (isQuiz) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="relative group flex flex-col items-center justify-center -top-6"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200",
                    "bg-gradient-to-br from-[#667eea] to-[#764ba2] shadow-purple-500/30",
                    "ring-4 ring-white",
                    isActive ? "scale-110" : "scale-100 group-hover:scale-110"
                  )}
                >
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold mt-1",
                    isActive ? "text-[#667eea]" : "text-gray-400 group-hover:text-[#667eea]"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex flex-col items-center gap-1 p-2 min-w-[60px] transition-colors",
                isActive ? "text-[#FFB800]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div 
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive ? "bg-[#FFB800]/10" : "bg-transparent"
                )}
              >
                <item.icon
                  className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isActive ? "stroke-[2.5px]" : "stroke-2"
                  )}
                />
              </div>
              <span className="text-[10px] font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
