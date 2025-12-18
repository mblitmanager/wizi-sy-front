import {
    LayoutDashboard,
    Mail,
    Trophy,
    Video,
    Megaphone,
} from "lucide-react";
import { NavItem } from "./stagiaire";

export const getFormateurNavigation = () => ({
    main: [
        {
            title: "Dashboard",
            href: "/formateur/dashboard",
            icon: LayoutDashboard,
            color: "text-blue-600",
        },
        {
            title: "Communications",
            href: "/formateur/communications",
            icon: Mail,
            color: "text-green-600",
        },
        {
            title: "Classement",
            href: "/formateur/classement",
            icon: Trophy,
            color: "text-amber-600",
        },
        {
            title: "Vidéos",
            href: "/formateur/videos",
            icon: Video,
            color: "text-purple-600",
        },
        {
            title: "Annonces",
            href: "/formateur/announcements",
            icon: Megaphone,
            color: "text-orange-600",
        },
    ] as NavItem[],
});
