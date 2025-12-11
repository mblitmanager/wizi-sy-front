import {
    Briefcase,
    Users,
    LayoutDashboard,
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
    ] as NavItem[],
});
