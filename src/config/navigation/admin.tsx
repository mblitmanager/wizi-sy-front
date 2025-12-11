import {
    LayoutDashboard,
    Users,
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
    ] as NavItem[],
});
