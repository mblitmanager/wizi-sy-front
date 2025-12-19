import {
    User,
    Award,
    GraduationCap,
    BarChart3,
    HelpCircle,
    FileText,
    Mail,
    Book,
    Heart,
    Shield,
} from "lucide-react";
import { NavItem } from "./stagiaire";

export const getProfileNavigation = () => [
    {
        title: "Mes Informations",
        href: "/profile",
        icon: User,
        color: "text-yellow-600",
    },
    {
        title: "Mes Badges",
        href: "/profile/badges",
        icon: Award,
        color: "text-yellow-600",
    },
    {
        title: "Mes Formations",
        href: "/profile/formations",
        icon: GraduationCap,
        color: "text-yellow-600",
    },
    {
        title: "Mes Statistiques",
        href: "/profile/statistiques",
        icon: BarChart3,
        color: "text-yellow-600",
    },
] as NavItem[];

export const getHelpNavigation = () => [
    {
        title: "FAQ",
        href: "/faq",
        icon: HelpCircle,
        color: "text-yellow-600",
    },
    {
        title: "CGV",
        href: "/cgv",
        icon: FileText,
        color: "text-yellow-600",
    },
    {
        title: "Contact",
        href: "/contact-support",
        icon: Mail,
        color: "text-yellow-600",
    },
    {
        title: "Manuel",
        href: "/manuel",
        icon: Book,
        color: "text-yellow-600",
    },
    {
        title: "À propos",
        href: "/a-propos",
        icon: Heart,
        color: "text-yellow-600",
    },
    {
        title: "Confidentialité",
        href: "/politique-confidentialite",
        icon: Shield,
        color: "text-yellow-600",
    },
] as NavItem[];
