import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { NavItem } from "@/config/navigation/stagiaire";
import { cn } from "@/lib/utils";

interface NavSectionProps {
    title: string;
    items: NavItem[];
    onItemClick?: () => void;
    /** Section repliable (fermée par défaut sauf si elle contient la page courante). */
    collapsible?: boolean;
}

export function NavSection({ title, items, onItemClick, collapsible = false }: NavSectionProps) {
    const { pathname } = useLocation();
    const containsActive = items?.some((item) => item.href === pathname) ?? false;
    const [open, setOpen] = useState(!collapsible || containsActive);

    if (!items || items.length === 0) return null;

    const isOpen = open || containsActive;

    return (
        <div className="space-y-0.5">
            {collapsible ? (
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between rounded-md px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                >
                    {title}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                </button>
            ) : (
                <h3 className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {title}
                </h3>
            )}

            {isOpen &&
                items.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.href === "/"}
                        onClick={onItemClick}
                        className={({ isActive }) =>
                            cn(
                                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                    : "text-sidebar-foreground hover:bg-secondary hover:text-foreground"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {/* Repère de la page courante */}
                                <span
                                    aria-hidden
                                    className={cn(
                                        "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gold transition-opacity",
                                        isActive ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-secondary text-muted-foreground group-hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-[18px] w-[18px]" />
                                </span>
                                <span className="truncate">{item.title}</span>
                            </>
                        )}
                    </NavLink>
                ))}
        </div>
    );
}
