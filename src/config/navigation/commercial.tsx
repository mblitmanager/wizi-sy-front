import {
    Briefcase,
    Users,
    LayoutDashboard,
    Megaphone,
} from "lucide-react";
import { NavItem } from "./stagiaire";

export const getCommercialNavigation = () => ({
    main: [
        {
            title: "Dashboard",
            href: "/commercial/dashboard",
            icon: LayoutDashboard,
            color: "text-blue-600",
        },
        {
            title: "Stagiaires",
            href: "/commercial/stagiaires",
            icon: Users,
            color: "text-green-600",
        },
        {
            title: "Annonces",
            href: "/commercial/announcements",
            icon: Megaphone,
            color: "text-red-600",
        },
    ] as NavItem[],
});
