
import { Home, LayoutList, BookOpen, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
      icon: Bell,
      label: "Notifs",
      href: "/notifications",
      badge: 2
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background pb-safe z-50">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 p-2 relative text-muted-foreground",
                isActive && "text-primary"
              )}
            >
              <span className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge variant="destructive" className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center">
                    {item.badge}
                  </Badge>
                )}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
