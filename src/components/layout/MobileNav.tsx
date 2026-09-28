import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/hooks/useNavigation";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  gold?: boolean; // Bouton central mis en avant (Quiz)
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const location = useLocation();
  const { items: navItems } = useNavigation();

  // Extraire les items de la première section ou une liste vide
  const mainItems = navItems?.mainSections?.[0]?.items || [];

  const items: NavItem[] = mainItems.slice(0, 5).map((item) => ({
    icon: item.icon as NavItem["icon"],
    label: item.title,
    href: item.href || "",
    gold: (item as { variant?: string }).variant === "gold",
  }));

  return (
    <nav
      aria-label="Navigation rapide"
      className="border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(28,26,23,0.06)] backdrop-blur-lg md:hidden"
    >
      <div className="flex items-stretch justify-around px-1">
        {items.map((item) => {
          const isActive = isActivePath(location.pathname, item.href);

          if (item.gold) {
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className="group relative -top-4 flex flex-col items-center justify-center"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy shadow-lg shadow-slate-400/30 ring-4 ring-card transition-transform duration-200",
                    isActive ? "scale-105" : "group-active:scale-95"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                </span>
                <span className={cn("mt-1 text-[10px] font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-w-[56px] flex-1 flex-col items-center gap-0.5 px-1 pb-1.5 pt-2 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground active:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-200",
                  isActive ? "bg-primary text-primary-foreground" : "bg-transparent"
                )}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <span className={cn("max-w-full truncate text-[10px]", isActive ? "font-bold" : "font-medium")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
