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
            href: "/admin/users",
            icon: Users,
            color: "text-yellow-600",
        },
        {
            title: "Annonces",
            url: "/admin/announcements",
            icon: Megaphone,
        },
        {
            title: "Défis",
            url: "/admin/challenges",
            icon: Target,
        },
        {
            title: "Achèvements",
            url: "/admin/achievements",
            icon: Medal,
        },
    ] as NavItem[],
});
