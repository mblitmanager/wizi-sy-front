
import { Home, LayoutList, Trophy, UserRound, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const location = useLocation();

  const items = [
    {
      icon: Home,
      label: "Accueil",
      href: "/"
    },
    {
      icon: LayoutList,
      label: "Catalogue",
      href: "/catalogue"
    },
    {
      icon: BookOpen,
      label: "Quiz",
      href: "/quizzes"
    },
    {
      icon: Trophy,
      label: "Classement",
      href: "/classement"
    },
    {
      icon: UserRound,
      label: "Profil",
      href: "/profile"
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background pb-safe">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-muted-foreground",
                isActive && "text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
