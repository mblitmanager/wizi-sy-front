import {
    LayoutDashboard,
    Mail,
    Trophy,
    Video,
    Megaphone,
    Bell,
    Gamepad2,
    ClipboardList,
    Users,
    Calendar,
    BarChart3,
    ScrollText,
    Gift
} from "lucide-react";

import { NavItem } from "./stagiaire";

export const getFormateurNavigation = () => ({
    principal: [
        {
            title: "Tableau de bord",
            href: "/formateur/dashboard",
            icon: LayoutDashboard,
            color: "text-blue-600",
        },
        {
            title: "Mes Stagiaires",
            href: "/formateur/mes-stagiaires",
            icon: Users,
            color: "text-pink-600",
        },
        {
            title: "Analytiques",
            href: "/formateur/analytiques",
            icon: BarChart3,
            color: "text-indigo-600",
        },
        {
            title: "Vidéos",
            href: "/formateur/videos",
            icon: Video,
            color: "text-purple-600",
        },
    ] as NavItem[],
    gestion: [
        {
            title: "Communications",
            href: "/formateur/communications",
            icon: Megaphone,
            color: "text-orange-600",
        },
        {
            title: "Arène des Formateurs",
            href: "/formateur/arena",
            icon: Gamepad2, // Stadium Lucide icon if available, but Gamepad2 is close to what was in Flutter (sports_esports)
            color: "text-yellow-600",
        },
        {
            title: "Classement Général",
            href: "/formateur/classement",
            icon: Trophy,
            color: "text-amber-600",
        },
        {
            title: "Quiz",
            href: "/formateur/quizzes",
            icon: ClipboardList,
            color: "text-emerald-600",
        },
        {
            title: "Suivi Demandes",
            href: "/formateur/suivi-demandes",
            icon: ScrollText,
            color: "text-indigo-600",
        },
        {
            title: "Suivi Parrainage",
            href: "/formateur/suivi-parrainage",
            icon: Gift,
            color: "text-cyan-600",
        },
    ] as NavItem[],
});
