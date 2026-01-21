import {
    LayoutDashboard,
    Mail,
    Trophy,
    Video,
    Megaphone,
    Bell,
    Gamepad2,
    ClipboardList
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
            icon: Megaphone,
            color: "text-orange-600",
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
            title: "Notifications",
            href: "/notifications",
            icon: Bell,
            color: "text-yellow-600",
        },
    ] as NavItem[],
});
