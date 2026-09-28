import { ComponentType, lazy, ReactNode, Suspense } from "react";
import { Outlet, RouteObject, useLocation } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { ThemeScope } from "@/components/layout/ThemeScope";
import { FullScreenLoader, PageLoader } from "@/components/common/PageLoader";
import { RouteError } from "@/components/common/RouteError";
import { useUser } from "@/hooks/useAuth";
import type { AppRole } from "@/utils/roles";

/** `lazy()` pour un module qui exporte le composant sous un nom (export nommé). */
function lazyNamed<M extends Record<string, unknown>>(loader: () => Promise<M>, name: keyof M) {
  return lazy(() => loader().then((m) => ({ default: m[name] as ComponentType })));
}

// --- Pages publiques ---------------------------------------------------------
const Index = lazyNamed(() => import("@/pages/Index"), "Index");
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/components/auth/ForrgotPassword"));
const ResetPassword = lazy(() => import("@/components/auth/ResetPassword"));
const ParrainageInscriptionPage = lazy(() => import("@/pages/ParrainageInscriptionPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const CGVPage = lazy(() => import("@/pages/CGVPage"));
const ManuelPage = lazy(() => import("@/pages/ManuelPage"));
const RemerciementsPage = lazy(() => import("@/pages/RemerciementsPage"));
const PolitiqueConfidentialitePage = lazy(() => import("@/pages/PolitiqueConfidentialitePage"));
const ContactSupportPage = lazy(() => import("@/pages/ContactSupportPage"));

// --- Stagiaire -------------------------------------------------------------------
const Catalogue = lazy(() => import("@/pages/Catalogue"));
const CategoryFormations = lazy(() => import("@/pages/CategoryFormations"));
const CatalogueFormationDetails = lazy(() => import("@/components/catalogueFormation/CatalogueFormationDetails"));
const Formation = lazy(() => import("@/pages/Formation"));
const Quizzes = lazy(() => import("@/pages/Quizzes"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const QuizDetail = lazyNamed(() => import("@/components/quiz/QuizDetail"), "QuizDetail");
const QuizResults = lazyNamed(() => import("@/components/quiz/QuizResults"), "QuizResults");
const Classement = lazy(() => import("@/pages/Classement"));
const TutoAstucePage = lazy(() => import("@/pages/TutoAstucePage"));
const Contact = lazy(() => import("@/pages/Contact"));
const Parainage = lazy(() => import("@/pages/Parainage"));
const AgendaPage = lazy(() => import("@/pages/AgendaPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const Profile = lazy(() => import("@/pages/Profile"));
const ProfileBadgesPage = lazy(() => import("@/pages/ProfileBadgesPage"));
const ProfileFormationsPage = lazy(() => import("@/pages/ProfileFormationsPage"));
const ProfileStatsPage = lazy(() => import("@/pages/ProfileStatsPage"));
const Settings = lazy(() => import("@/pages/Settings"));
const SuiviDemandesPage = lazy(() => import("@/pages/tracking/SuiviDemandesPage"));
const SuiviParrainagePage = lazy(() => import("@/pages/tracking/SuiviParrainagePage"));

// --- Formateur ---------------------------------------------------------------------
const FormateurDashboard = lazyNamed(() => import("@/pages/formateur/FormateurDashboard"), "FormateurDashboard");
const FormateurClassementPage = lazyNamed(() => import("@/pages/formateur/FormateurClassementPage"), "FormateurClassementPage");
const FormateurVideosPage = lazyNamed(() => import("@/pages/formateur/FormateurVideosPage"), "FormateurVideosPage");
const TrainerArenaPage = lazyNamed(() => import("@/pages/formateur/TrainerArenaPage"), "TrainerArenaPage");
const GestionFormations = lazy(() => import("@/pages/formateur/GestionFormations"));
const Analytiques = lazy(() => import("@/pages/formateur/Analytiques"));
const MesStagiairesPage = lazy(() => import("@/pages/formateur/MesStagiairesPage"));
const StagiaireProfilePage = lazy(() => import("@/pages/formateur/StagiaireProfilePage"));
const FormateurQuizManagementPage = lazy(() => import("@/pages/formateur/FormateurQuizManagementPage"));
const ManuelFormateurPage = lazy(() => import("@/pages/formateur/ManuelFormateurPage"));

// --- Commercial / Admin ----------------------------------------------------------------
const CommercialDashboard = lazyNamed(() => import("@/pages/commercial/CommercialDashboard"), "CommercialDashboard");
const AnnouncementsPage = lazyNamed(() => import("@/pages/admin/AnnouncementsPage"), "AnnouncementsPage");
const ChallengesPage = lazyNamed(() => import("@/pages/admin/ChallengesPage"), "ChallengesPage");
const StatisticsDashboard = lazyNamed(() => import("@/pages/admin/StatisticsDashboard"), "StatisticsDashboard");
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminStagiaires = lazy(() => import("@/pages/admin/Stagiaires"));
const AdminQuiz = lazy(() => import("@/pages/admin/Quiz"));
const AdminFormations = lazy(() => import("@/pages/admin/Formations"));
const AdminCatalogueFormations = lazy(() => import("@/pages/admin/CatalogueFormations"));
const AdminFormateurs = lazy(() => import("@/pages/admin/Formateurs"));
const AdminCommerciaux = lazy(() => import("@/pages/admin/Commerciaux"));
const AdminAchievements = lazy(() => import("@/pages/admin/Achievements"));
const AdminParametres = lazy(() => import("@/pages/admin/Parametres"));

// --- Helpers ---------------------------------------------------------------------------

const FORMATEUR: AppRole[] = ["formateur", "admin"];
const COMMERCIAL: AppRole[] = ["commercial", "admin"];
const ADMIN: AppRole[] = ["admin"];

/** Page réservée aux utilisateurs connectés (optionnellement à certains rôles). */
const guard = (element: ReactNode, roles?: AppRole[]) => <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;

/**
 * Cadre persistant (sidebar + header) : il reste monté pendant les navigations,
 * seul le contenu affiche un squelette pendant le chargement de la page.
 */
function AppShell() {
  const { pathname } = useLocation();
  const { token } = useUser();
  const fallback = pathname === "/" && !token ? <FullScreenLoader /> : <PageLoader />;

  return (
    <Layout>
      <Suspense fallback={fallback}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}

/** Pages avec leur propre mise en page (auth, admin, dashboards plein écran). */
function StandaloneShell() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Outlet />
    </Suspense>
  );
}

export const routes: RouteObject[] = [
  {
    element: <ThemeScope />,
    errorElement: <RouteError />,
    children: [
      {
        element: <AppShell />,
        children: [
          // Publiques (le Layout n'affiche son cadre que pour un utilisateur connecté)
          { path: "/", element: <Index /> },
          { path: "/register", element: <Register /> },
          { path: "/faq", element: <FAQPage /> },
          { path: "/cgv", element: <CGVPage /> },
          { path: "/manuel", element: <ManuelPage /> },
          { path: "/remerciements", element: <RemerciementsPage /> },
          { path: "/politique-confidentialite", element: <PolitiqueConfidentialitePage /> },
          { path: "/contact-support", element: <ContactSupportPage /> },

          // Stagiaire et tous rôles connectés
          { path: "/catalogue", element: guard(<Catalogue />) },
          { path: "/catalogue/:categorySlug", element: guard(<CategoryFormations />) },
          { path: "/catalogue-formation/:id", element: guard(<CatalogueFormationDetails />) },
          { path: "/formations", element: guard(<Formation />) },
          { path: "/quizzes", element: guard(<Quizzes />) },
          { path: "/quiz", element: guard(<Quiz />) },
          { path: "/quiz/:quizId", element: guard(<QuizDetail />) },
          { path: "/quiz/:quizId/start", element: guard(<Quiz />) },
          { path: "/quiz/:quizId/results", element: guard(<QuizResults />) },
          { path: "/classement", element: guard(<Classement />) },
          { path: "/tuto-astuce", element: guard(<TutoAstucePage />) },
          { path: "/contacts", element: guard(<Contact />) },
          { path: "/parrainage", element: guard(<Parainage />) },
          { path: "/agenda", element: guard(<AgendaPage />) },
          { path: "/notifications", element: guard(<NotificationsPage />) },
          { path: "/profile", element: guard(<Profile />) },
          { path: "/profile/badges", element: guard(<ProfileBadgesPage />) },
          { path: "/profile/formations", element: guard(<ProfileFormationsPage />) },
          { path: "/profile/statistiques", element: guard(<ProfileStatsPage />) },
          { path: "/settings", element: guard(<Settings />) },
          { path: "/suivi-demandes", element: guard(<SuiviDemandesPage />) },
          { path: "/suivi-parrainage", element: guard(<SuiviParrainagePage />) },

          // Formateur
          { path: "/formateur/dashboard", element: guard(<FormateurDashboard />, FORMATEUR) },
          { path: "/formateur/analytiques", element: guard(<Analytiques />, FORMATEUR) },
          { path: "/formateur/communications", element: guard(<AnnouncementsPage />, FORMATEUR) },
          { path: "/formateur/announcements", element: guard(<AnnouncementsPage />, FORMATEUR) },
          { path: "/formateur/classement", element: guard(<FormateurClassementPage />, FORMATEUR) },
          { path: "/formateur/arena", element: guard(<TrainerArenaPage />, FORMATEUR) },
          { path: "/formateur/videos", element: guard(<FormateurVideosPage />, FORMATEUR) },
          { path: "/formateur/quizzes", element: guard(<FormateurQuizManagementPage />, FORMATEUR) },
          { path: "/formateur/mes-stagiaires", element: guard(<MesStagiairesPage />, FORMATEUR) },
          { path: "/formateur/formations", element: guard(<GestionFormations />, FORMATEUR) },
          { path: "/formateur/stagiaire/:id", element: guard(<StagiaireProfilePage />, FORMATEUR) },
          { path: "/formateur/suivi-demandes", element: guard(<SuiviDemandesPage />, FORMATEUR) },
          { path: "/formateur/suivi-parrainage", element: guard(<SuiviParrainagePage />, FORMATEUR) },
          { path: "/formateur/guide", element: guard(<ManuelFormateurPage />, FORMATEUR) },

          // Commercial
          { path: "/commercial/announcements", element: guard(<AnnouncementsPage />, COMMERCIAL) },
          { path: "/commercial/suivi-demandes", element: guard(<SuiviDemandesPage />, COMMERCIAL) },
          { path: "/commercial/suivi-parrainage", element: guard(<SuiviParrainagePage />, COMMERCIAL) },

          // Administration (pages utilisant le Layout principal)
          { path: "/admin/announcements", element: guard(<AnnouncementsPage />, ADMIN) },
          { path: "/admin/challenges", element: guard(<ChallengesPage />, ADMIN) },
        ],
      },
      {
        element: <StandaloneShell />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password", element: <ResetPassword /> },
          { path: "/parrainage/:token", element: <ParrainageInscriptionPage /> },
          { path: "/a-propos", element: <AboutPage /> },

          { path: "/commercial/dashboard", element: guard(<CommercialDashboard />, COMMERCIAL) },

          { path: "/admin/dashboard", element: guard(<AdminDashboard />, ADMIN) },
          { path: "/admin/statistics", element: guard(<StatisticsDashboard />, ADMIN) },
          { path: "/admin/stagiaires", element: guard(<AdminStagiaires />, ADMIN) },
          { path: "/admin/quiz", element: guard(<AdminQuiz />, ADMIN) },
          { path: "/admin/formations", element: guard(<AdminFormations />, ADMIN) },
          { path: "/admin/catalogue-formations", element: guard(<AdminCatalogueFormations />, ADMIN) },
          { path: "/admin/formateurs", element: guard(<AdminFormateurs />, ADMIN) },
          { path: "/admin/commerciaux", element: guard(<AdminCommerciaux />, ADMIN) },
          { path: "/admin/achievements", element: guard(<AdminAchievements />, ADMIN) },
          { path: "/admin/parametres", element: guard(<AdminParametres />, ADMIN) },

          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
];
