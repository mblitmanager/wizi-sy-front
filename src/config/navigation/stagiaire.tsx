import {
    Home,
    GraduationCap,
    Brain,
    Video,
    Trophy,
    Gift,
} from "lucide-react";

export interface NavItem {
    title: string;
    href: string;
    icon: any;
    color: string;
}

export const getStagiaireNavigation = () => ({
    main: [
        {
            title: "Accueil",
            href: "/",
            icon: Home,
            color: "text-yellow-600",
        },
        {
            title: "Formation",
            href: "/catalogue",
            icon: GraduationCap,
            color: "text-yellow-600",
        },
        {
            title: "Quiz",
            href: "/quizzes",
            icon: Brain,
            color: "text-yellow-600",
        },
        {
            title: "Classement",
            href: "/classement",
            icon: Trophy,
            color: "text-yellow-600",
        },
        {
            title: "Tutoriel",
            href: "/tuto-astuce",
            icon: Video,
            color: "text-yellow-600",
        },
        {
            title: "Parrainage",
            href: "/parrainage",
            icon: Gift,
            color: "text-yellow-600",
        },
    ] as NavItem[],
});
