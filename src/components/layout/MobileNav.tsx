import { Home, LayoutList, Trophy, Bell, BookOpen, Video, Settings } from "lucide-react";
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
      href: "/"
    },
    {
      icon: LayoutList,
      label: "Formations",
      href: "/catalogue"
    },
    {
      icon: BookOpen,
      label: "Quiz",
      href: "/quizzes",
      // Ajout d'une propriété spéciale pour le style
      gold: true
    },
    {
      icon: Trophy,
      label: "Classement",
      href: "/classement"
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
    }
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
          const isQuiz = item.label === "Quiz";
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
              "flex flex-col items-center gap-0.5 p-2 relative text-muted-foreground",
              isActive && (!isQuiz || (isQuiz && !isActive)) && "text-primary",
              isQuiz && !isActive && "z-10 scale-[0.8] -mt-3 bg-white rounded-full shadow-xl border-b-4 border-yellow-900 !p-2",
              isQuiz && isActive && "z-10 scale-[0.8] -mt-3 bg-white rounded-full shadow-xl border-b-4 border-yellow-400 !p-2 text-yellow-700"
              )}
              // style={isQuiz ? { boxShadow: '0 4px 24px 0 #facc15, 0 4px 0 0 #fde68a' } : {}}
            >
              <span className="relative">
              <item.icon className={cn(
                "h-10 w-10 transition-all",
                isQuiz ? "text-yellow-500 drop-shadow-lg" : "h-5 w-5"
              )} />
              {item.badge !== undefined && (
                <Badge variant="destructive" className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center">
                {item.badge}
                </Badge>
              )}
              </span>
              <span className={cn("text-[12px] font-bold", isQuiz && "text-yellow-700")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
