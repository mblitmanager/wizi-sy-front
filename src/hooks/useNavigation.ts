import { useMemo } from "react";
import { useUser } from "@/hooks/useAuth";
import type { AppRole } from "@/utils/roles";
import { getStagiaireNavigation } from "@/config/navigation/stagiaire";
import { getFormateurNavigation } from "@/config/navigation/formateur";
import { getCommercialNavigation } from "@/config/navigation/commercial";
import { getAdminNavigation } from "@/config/navigation/admin";
import {
  getProfileNavigation,
  getHelpNavigation,
} from "@/config/navigation/common";
import { NavItem } from "@/config/navigation/stagiaire";
import { Settings, Book } from "lucide-react";

interface NavigationSection {
  title: string;
  items: NavItem[];
}

interface NavigationItems {
  mainSections: NavigationSection[];
  profile: NavItem[];
  help: NavItem[];
}

export function useNavigation() {
  const { user, role, isLoading } = useUser();

  const items: NavigationItems = useMemo(() => {
    // Default empty navigation while loading or no user
    if (!user) {
      return {
        mainSections: [],
        profile: getProfileNavigation(),
        help: getHelpNavigation(),
      };
    }

    const isFormateur = role === "formateur";

    // Navigation principale selon le rôle (normalisé : formatrice → formateur, etc.)
    const roleNavigations: Record<AppRole, () => any> = {
      stagiaire: getStagiaireNavigation,
      formateur: getFormateurNavigation,
      commercial: getCommercialNavigation,
      admin: getAdminNavigation,
    };
    const getMainNav = roleNavigations[role];
    const mainNav = getMainNav();

    // Transform into sections
    let mainSections: NavigationSection[] = [];

    if (isFormateur && mainNav.principal && mainNav.gestion) {
      mainSections = [
        { title: "PRINCIPAL", items: mainNav.principal },
        { title: "GESTION", items: mainNav.gestion },
        {
          title: "PARAMÈTRES",
          items: [
            {
              title: "Configuration",
              href: "/settings",
              icon: Settings,
              color: "text-gray-600",
            },
            {
              title: "Guide Formateur",
              href: "/formateur/guide",
              icon: Book,
              color: "text-orange-600",
            },
            ...getHelpNavigation().filter((item) => item.title !== "Manuel"),
          ],
        },
      ];
    } else {
      // Pour les autres rôles, on garde la section par défaut
      mainSections = [{ title: "Navigation", items: mainNav.main || [] }];
    }

    return {
      mainSections,
      profile: isFormateur ? [] : getProfileNavigation(),
      help: isFormateur ? [] : getHelpNavigation(),
    };
  }, [user, role]);

  return { items, isLoading, user };
}
