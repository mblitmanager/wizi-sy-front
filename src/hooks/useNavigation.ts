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

interface NavigationItems {
  main: NavItem[];
  profile: NavItem[];
  help: NavItem[];
}

export function useNavigation() {
  const { user, isLoading } = useUser();

  const items: NavigationItems = useMemo(() => {
    // Default empty navigation while loading or no user
    if (!user) {
      return {
        main: [],
        profile: getProfileNavigation(),
        help: getHelpNavigation(),
      };
    }

    // Debug: Log the current user role
    // console.log('🔍 [useNavigation] Current user role:', user.role);
    // console.log('🔍 [useNavigation] User object:', user);

    // L'API retourne {user: {...}, stagiaire: null}, donc on accède à user.user.role
    const userRole = (user as any).user?.role || user.role;
    // console.log('🔍 [useNavigation] Extracted role:', userRole);

    // Role-based navigation configurations
    const roleNavigations: Record<string, () => { main: NavItem[] }> = {
      formateur: getFormateurNavigation,
      formatrice: getFormateurNavigation,
      commercial: getCommercialNavigation,
      commerciale: getCommercialNavigation,
      admin: getAdminNavigation,
    };

    // Get main navigation based on role, default to stagiaire
    const getMainNav = roleNavigations[userRole] || getStagiaireNavigation;
    const mainNav = getMainNav();

    // Profiler visibility: ne pas afficher si vue formateur
    const isFormateur = userRole === "formateur" || userRole === "formatrice";

    return {
      main: mainNav.main,
      profile: isFormateur ? [] : getProfileNavigation(),
      help: getHelpNavigation(),
    };
  }, [user]);

  return { items, isLoading, user };
}
