import {
    LayoutDashboard,
    Users,
    Megaphone,
    Target,
    Medal,
} from "lucide-react";
import { NavItem } from "./stagiaire";

export const getAdminNavigation = () => ({
    main: [
        {
            title: "Statistiques Admin",
            href: "/admin/statistics",
            icon: LayoutDashboard,
            color: "text-yellow-600",
        },
        {
            title: "Utilisateurs",
            href: "/admin/stagiaires",
            icon: Users,
            color: "text-yellow-600",
        },
        {
            title: "Annonces",
            href: "/admin/announcements",
            icon: Megaphone,
            color: "text-yellow-600",
        },
        {
            title: "Défis",
            href: "/admin/challenges",
            icon: Target,
            color: "text-yellow-600",
        },
        {
            title: "Achèvements",
            href: "/admin/achievements",
            icon: Medal,
            color: "text-yellow-600",
        },
    ] as NavItem[],
});
