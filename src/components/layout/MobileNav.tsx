
import { Home, LayoutList, Trophy, Bell, BookOpen, Video, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { sponsorshipService } from "@/services/sponsorshipService";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: number;
}

export function MobileNav() {
  const location = useLocation();
  const { user } = useUser();

  const { data: sponsorshipStats } = useQuery({
    queryKey: ['sponsorship', 'stats'],
    queryFn: () => sponsorshipService.getStats(),
    staleTime: 60000,
    enabled: !!user
  });

  const referralsCount = sponsorshipStats?.totalReferrals || 0;

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
      href: "/quizzes"
    },
    {
      icon: Trophy,
      label: "Classement",
      href: "/classement"
    },
    {
      icon: Users,
      label: "Parrainage",
      href: "/profile?tab=parrainage",
      badge: referralsCount
    },
    {
      icon: Bell,
      label: "Notifs",
      href: "/notifications",
      badge: 2
    },
    {
      label: "Tutoriels",
      href: "/tuto-astuce",
      icon: Video,
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background pb-safe z-50">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href.includes('?tab=') && location.pathname === item.href.split('?')[0]);
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
                {item.badge !== undefined && item.badge > 0 && (
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
