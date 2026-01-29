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
    Calendar
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
            title: "Agenda",
            href: "/agenda",
            icon: Calendar,
            color: "text-blue-500",
        },
        {
            title: "Communications",
            href: "/formateur/communications",
            icon: Megaphone,
            color: "text-orange-600",
        },
        {
            title: "Mes Stagiaires",
            href: "/formateur/mes-stagiaires",
            icon: Users,
            color: "text-pink-600",
        },

        {
            title: "Classement",
            href: "/formateur/classement",
            icon: Trophy,
            color: "text-amber-600",
        },
        {
            title: "L'Arène",
            href: "/formateur/arena",
            icon: Gamepad2,
            color: "text-yellow-600",
        },
        {
            title: "Vidéos",
            href: "/formateur/videos",
            icon: Video,
            color: "text-purple-600",
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
            icon: ClipboardList,
            color: "text-indigo-600",
        },
        {
            title: "Suivi Parrainage",
            href: "/formateur/suivi-parrainage",
            icon: Trophy,
            color: "text-cyan-600",
        },

        {
            title: "Notifications",
            href: "/notifications",
            icon: Bell,
            color: "text-yellow-600",
        },
    ] as NavItem[],
});
