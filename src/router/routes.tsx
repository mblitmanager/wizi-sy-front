component: withSuspense(lazy(() => import("@/pages/LandingPage"))),
  preload: () => import("@/pages/LandingPage"),
  },
login: {
  path: "/login",
    component: withSuspense(lazy(() => import("@/pages/Login"))),
      preload: () => import("@/pages/Login"),
  },
contact: {
  path: "/contact",
    component: withSuspense(lazy(() => import("@/pages/Contact"))),
      preload: () => import("@/pages/Contact"),
  },
quiz: {
  path: "/quiz",
    component: withSuspense(lazy(() => import("@/pages/Quiz"))),
      preload: () => import("@/pages/Quiz"),
  },
formations: {
  path: "/formations",
    component: withSuspense(lazy(() => import("@/pages/Formations"))),
      preload: () => import("@/pages/Formations"),
  },
// NOUVELLES ROUTES DU PROFIL
profile: {
  path: "/profile",
    component: withSuspense(lazy(() => import("@/pages/Profile"))),
      preload: () => import("@/pages/Profile"),
  },
profileBadges: {
  path: "/profile/badges",
    component: withSuspense(lazy(() => import("@/pages/ProfileBadgesPage"))),
      preload: () => import("@/pages/ProfileBadgesPage"),
  },
profileFormations: {
  path: "/profile/formations",
    component: withSuspense(
      lazy(() => import("@/pages/ProfileFormationsPage"))
    ),
      preload: () => import("@/pages/ProfileFormationsPage"),
  },
profileStats: {
  path: "/profile/statistiques",
    component: withSuspense(lazy(() => import("@/pages/ProfileStatsPage"))),
      preload: () => import("@/pages/ProfileStatsPage"),
  },
// ROUTES EXISTANTES
catalogue: {
  path: "/catalogue",
    component: withSuspense(lazy(() => import("@/pages/Catalogue"))),
      preload: () => import("@/pages/Catalogue"),
  },
quizzes: {
  // Ajout de la route quizzes manquante
  path: "/quizzes",
    component: withSuspense(lazy(() => import("@/pages/Quizzes"))),
      preload: () => import("@/pages/Quizzes"),
  },
classement: {
  path: "/classement",
    component: withSuspense(lazy(() => import("@/pages/Classement"))),
      preload: () => import("@/pages/Classement"),
  },
tutoriels: {
  path: "/tuto-astuce",
    component: withSuspense(lazy(() => import("@/pages/TutoAstucePage"))),
      preload: () => import("@/pages/TutoAstucePage"), // Correction: TutoAstucePage au lieu de -TutoAstucePage
  },
parrainage: {
  path: "/parrainage",
    component: withSuspense(lazy(() => import("@/pages/Parrainage"))), // Correction: Parrainage au lieu de Parainage
      preload: () => import("@/pages/Parrainage"),
  },
// ROUTES RESSOURCES UTILES
faq: {
  path: "/faq",
    component: withSuspense(lazy(() => import("@/pages/FAQPage"))),
      preload: () => import("@/pages/FAQPage"),
  },
cgv: {
  path: "/cgv",
    component: withSuspense(lazy(() => import("@/pages/CGVPage"))),
      preload: () => import("@/pages/CGVPage"),
  },
contactSupport: {
  path: "/contact-support",
    component: withSuspense(lazy(() => import("@/pages/ContactSupportPage"))),
      preload: () => import("@/pages/ContactSupportPage"),
  },
manuel: {
  path: "/manuel",
    component: withSuspense(lazy(() => import("@/pages/ManuelPage"))),
      preload: () => import("@/pages/ManuelPage"),
  },
remerciements: {
  path: "/remerciements",
    component: withSuspense(lazy(() => import("@/pages/RemerciementsPage"))),
      preload: () => import("@/pages/RemerciementsPage"),
  },
politiqueConfidentialite: {
  path: "/politique-confidentialite",
    component: withSuspense(
      lazy(() => import("@/pages/PolitiqueConfidentialitePage"))
    ),
      preload: () => import("@/pages/PolitiqueConfidentialitePage"),
  },
};

// Type des routes
export type RouteKey = keyof typeof routes;

// Hook pour le prefetching des routes
export function usePrefetch() {
  const prefetch = (routeKey: RouteKey) => {
    const route = routes[routeKey];
    if (route.preload) {
      route.preload();
    }
  };

  return { prefetch };
}

// Hook pour la navigation optimisée
export function useOptimizedNavigate() {
  const navigate = useNavigate();
  const { prefetch } = usePrefetch();

  const navigateTo = (routeKey: RouteKey) => {
    const route = routes[routeKey];
    // Précharger la route avant la navigation
    prefetch(routeKey);
    navigate(route.path);
  };

  return navigateTo;
}

// Hook pour le prefetching automatique des routes liées
export function useAutoPrefetch() {
  const location = useLocation();
  const { prefetch } = usePrefetch();

  // Mapping des routes liées qui devraient être préchargées
  const relatedRoutes: Record<string, RouteKey[]> = {
    "/": ["login", "contact", "profile", "catalogue"],
    "/login": ["home", "profile"],
    "/contact": ["home"],
    "/quiz": ["formations"],
    "/formations": ["quiz", "catalogue"],
    "/profile": [
      "profileBadges",
      "profileFormations",
      "profileStats",
      "catalogue",
    ],
    "/profile/badges": ["profile", "profileFormations", "profileStats"],
    "/profile/formations": ["profile", "profileBadges", "catalogue"],
    "/profile/statistiques": ["profile", "profileBadges"],
    "/catalogue": ["profileFormations", "formations"],
    "/quizzes": ["profileStats", "quiz"],
    "/classement": ["profileStats"],
    "/tuto-astuce": ["formations"],
    "/parrainage": ["profile"],
  };

  const currentRelatedRoutes = relatedRoutes[location.pathname];
  if (currentRelatedRoutes) {
    currentRelatedRoutes.forEach(prefetch);
  }
}
