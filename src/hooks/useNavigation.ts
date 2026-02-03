import { useMemo } from "react";
import { useUser } from "@/hooks/useAuth";
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

interface UserProfile {
  role: string;
  user?: {
    role: string;
  };
}

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
  const { user, isLoading } = useUser();

  const items: NavigationItems = useMemo(() => {
    // Default empty navigation while loading or no user
    if (!user) {
      return {
        mainSections: [],
        profile: getProfileNavigation(),
        help: getHelpNavigation(),
      };
    }

    const profile = user as unknown as UserProfile;
    const userRole = profile.user?.role || profile.role;
    const isFormateur = userRole === "formateur" || userRole === "formatrice";

    // Role-based navigation configurations
    const roleNavigations: Record<string, () => any> = {
      formateur: getFormateurNavigation,
      formatrice: getFormateurNavigation,
      commercial: getCommercialNavigation,
      commerciale: getCommercialNavigation,
      admin: getAdminNavigation,
    };

    // Get main navigation based on role, default to stagiaire
    const getMainNav = roleNavigations[userRole] || getStagiaireNavigation;
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
  }, [user]);

  return { items, isLoading, user };
}
