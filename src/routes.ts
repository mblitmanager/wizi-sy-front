import * as React from "react";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoadingState } from "@/components/quiz/quiz-play/LoadingState";

// Lazy load components
// Named exports
const Index = lazy(() =>
  import("@/pages/Index").then((module) => ({ default: module.Index })),
);
const QuizDetail = lazy(() =>
  import("@/components/quiz/QuizDetail").then((module) => ({
    default: module.QuizDetail,
  })),
);
const QuizResults = lazy(() =>
  import("@/components/quiz/QuizResults").then((module) => ({
    default: module.QuizResults,
  })),
);

// Default exports
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Catalogue = lazy(() => import("@/pages/Catalogue"));
const CategoryFormations = lazy(() => import("@/pages/CategoryFormations"));
const Formation = lazy(() => import("@/pages/Formation"));
const Quizzes = lazy(() => import("@/pages/Quizzes"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const Classement = lazy(() => import("@/pages/Classement"));
const TutoAstucePage = lazy(() => import("@/pages/TutoAstucePage"));
const Contact = lazy(() => import("@/pages/Contact"));
const Parainage = lazy(() => import("@/pages/Parainage"));
const ParrainageInscriptionPage = lazy(
  () => import("@/pages/ParrainageInscriptionPage"),
);
const CatalogueFormationDetails = lazy(
  () => import("@/components/catalogueFormation/CatalogueFormationDetails"),
);
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const CGVPage = lazy(() => import("@/pages/CGVPage"));
const ManuelPage = lazy(() => import("@/pages/ManuelPage"));
const RemerciementsPage = lazy(() => import("@/pages/RemerciementsPage"));
const PolitiqueConfidentialitePage = lazy(
  () => import("@/pages/PolitiqueConfidentialitePage"),
);
const ContactSupportPage = lazy(() => import("@/pages/ContactSupportPage"));
const ForgotPassword = lazy(() => import("./components/auth/ForrgotPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const ProfileBadgesPage = lazy(() => import("@/pages/ProfileBadgesPage"));
const ProfileFormationsPage = lazy(
  () => import("@/pages/ProfileFormationsPage"),
);
const ProfileStatsPage = lazy(() => import("@/pages/ProfileStatsPage"));
const StatisticsDashboard = lazy(() =>
  import("@/pages/admin/StatisticsDashboard").then((module) => ({
    default: module.StatisticsDashboard,
  })),
);
const FormateurDashboard = lazy(() =>
  import("@/pages/formateur/FormateurDashboard").then((module) => ({
    default: module.FormateurDashboard,
  })),
);
const FormateurCommunicationsPage = lazy(() =>
  import("@/pages/formateur/FormateurCommunicationsPage").then((module) => ({
    default: module.FormateurCommunicationsPage,
  })),
);
const FormateurClassementPage = lazy(() =>
  import("@/pages/formateur/FormateurClassementPage").then((module) => ({
    default: module.FormateurClassementPage,
  })),
);
const FormateurVideosPage = lazy(() =>
  import("@/pages/formateur/FormateurVideosPage").then((module) => ({
    default: module.FormateurVideosPage,
  })),
);
const CommercialDashboard = lazy(() =>
  import("@/pages/commercial/CommercialDashboard").then((module) => ({
    default: module.CommercialDashboard,
  })),
);
const AnnouncementsPage = lazy(() =>
  import("@/pages/admin/AnnouncementsPage").then((module) => ({
    default: module.AnnouncementsPage,
  })),
);
const ChallengesPage = lazy(() =>
  import("@/pages/admin/ChallengesPage").then((module) => ({
    default: module.ChallengesPage,
  })),
);
const GestionFormations = lazy(() =>
  import("@/pages/formateur/GestionFormations").then((module) => ({
    default: module.default,
  })),
);
const Analytiques = lazy(() =>
  import("@/pages/formateur/Analytiques").then((module) => ({
    default: module.default,
  })),
);
const QuizCreator = lazy(() =>
  import("@/pages/formateur/QuizCreator").then((module) => ({
    default: module.default,
  })),
);
const MesStagiairesPage = lazy(() =>
  import("@/pages/formateur/MesStagiairesPage").then((module) => ({
    default: module.default,
  })),
);
const StagiaireProfilePage = lazy(() =>
  import("@/pages/formateur/StagiaireProfilePage").then((module) => ({
    default: module.default,
  })),
);
const FormateurQuizManagementPage = lazy(() =>
  import("@/pages/formateur/FormateurQuizManagementPage").then((module) => ({
    default: module.default,
  })),
);
const TrainerArenaPage = lazy(() =>
  import("@/pages/formateur/TrainerArenaPage").then((module) => ({
    default: module.TrainerArenaPage,
  })),
);
const SuiviDemandesPage = lazy(() =>
  import("@/pages/tracking/SuiviDemandesPage").then((module) => ({
    default: module.default,
  })),
);
const SuiviParrainagePage = lazy(() =>
  import("@/pages/tracking/SuiviParrainagePage").then((module) => ({
    default: module.default,
  })),
);
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const AgendaPage = lazy(() => import("@/pages/AgendaPage"));

// Admin routes
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminStagiaires = lazy(() => import("@/pages/admin/Stagiaires"));
const AdminQuiz = lazy(() => import("@/pages/admin/Quiz"));
const AdminFormations = lazy(() => import("@/pages/admin/Formations"));
const AdminCatalogueFormations = lazy(
  () => import("@/pages/admin/CatalogueFormations"),
);
const AdminFormateurs = lazy(() => import("@/pages/admin/Formateurs"));
const AdminCommerciaux = lazy(() => import("@/pages/admin/Commerciaux"));
const AdminAchievements = lazy(() => import("@/pages/admin/Achievements"));
const AdminParametres = lazy(() => import("@/pages/admin/Parametres"));

// Helper to wrap components in Suspense
const Loadable = (Component: React.ComponentType) =>
  React.createElement(
    Suspense,
    { fallback: React.createElement(LoadingState) },
    React.createElement(Component),
  );

export const routes = [
  {
    path: "/remerciements",
    element: Loadable(RemerciementsPage),
  },
  {
    path: "/politique-confidentialite",
    element: Loadable(PolitiqueConfidentialitePage),
  },
  {
    path: "/contact-support",
    element: Loadable(ContactSupportPage),
  },
  {
    path: "/faq",
    element: Loadable(FAQPage),
  },
  {
    path: "/cgv",
    element: Loadable(CGVPage),
  },
  {
    path: "/manuel",
    element: Loadable(ManuelPage),
  },
  {
    path: "/a-propos",
    element: Loadable(AboutPage),
  },
  {
    path: "/",
    element: Loadable(Index),
  },
  {
    path: "/login",
    element: Loadable(Login),
  },
  {
    path: "/forgot-password",
    element: Loadable(ForgotPassword),
  },
  {
    path: "/reset-password",
    element: Loadable(ResetPassword),
  },
  {
    path: "/register",
    element: Loadable(Register),
  },
  {
    path: "/parrainage/:token",
    element: Loadable(ParrainageInscriptionPage),
  },
  {
    path: "/catalogue",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Catalogue),
    ),
  },
  {
    path: "/catalogue/:categoryId",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(CategoryFormations),
    ),
  },
  {
    path: "/formations",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Formation),
    ),
  },
  {
    path: "/quizzes",
    element: React.createElement(ProtectedRoute, undefined, Loadable(Quizzes)),
  },
  {
    path: "/quiz",
    element: React.createElement(ProtectedRoute, undefined, Loadable(Quiz)),
  },
  {
    path: "/quiz/:quizId",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(QuizDetail),
    ),
  },
  {
    path: "/quiz/:quizId/start",
    element: React.createElement(ProtectedRoute, undefined, Loadable(Quiz)),
  },
  {
    path: "/quiz/:quizId/results",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(QuizResults),
    ),
  },
  {
    path: "/suivi-demandes",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(SuiviDemandesPage),
    ),
  },
  {
    path: "/suivi-parrainage",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(SuiviParrainagePage),
    ),
  },

  // Routes de profil
  {
    path: "/profile",
    element: React.createElement(ProtectedRoute, undefined, Loadable(Profile)),
  },
  {
    path: "/profile/badges",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(ProfileBadgesPage),
    ),
  },
  {
    path: "/profile/formations",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(ProfileFormationsPage),
    ),
  },
  {
    path: "/profile/statistiques",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(ProfileStatsPage),
    ),
  },
  {
    path: "/settings",
    element: React.createElement(ProtectedRoute, undefined, Loadable(Settings)),
  },
  {
    path: "/classement",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Classement),
    ),
  },
  {
    path: "/tuto-astuce",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(TutoAstucePage),
    ),
  },
  {
    path: "/contacts",
    element: React.createElement(ProtectedRoute, undefined, Loadable(Contact)),
  },
  {
    path: "/parrainage",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Parainage),
    ),
  },
  {
    path: "/catalogue-formation/:id",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(CatalogueFormationDetails),
    ),
  },
  {
    path: "/admin/dashboard",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AdminDashboard),
    ),
  },
  {
    path: "/admin/stagiaires",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AdminStagiaires),
    ),
  },
  {
    path: "/admin/quiz",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AdminQuiz),
    ),
  },
  {
    path: "/admin/formations",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AdminFormations),
    ),
  },
  {
    path: "/admin/catalogue-formations",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AdminCatalogueFormations),
    ),
  },
  {
    path: "/admin/formateurs",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AdminFormateurs),
    ),
  },
  {
    path: "/admin/commerciaux",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AdminCommerciaux),
    ),
  },
  {
    path: "/admin/achievements",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AdminAchievements),
    ),
  },
  {
    path: "/admin/parametres",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AdminParametres),
    ),
  },
  {
    path: "/admin/statistics",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(StatisticsDashboard),
    ),
  },
  {
    path: "/admin/announcements",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AnnouncementsPage),
    ),
  },
  {
    path: "/admin/challenges",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(ChallengesPage),
    ),
  },
  {
    path: "/formateur/announcements",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AnnouncementsPage),
    ),
  },
  {
    path: "/commercial/announcements",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AnnouncementsPage),
    ),
  },
  {
    path: "/formateur/analytiques",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Analytiques),
    ),
  },
  {
    path: "/formateur/dashboard",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(FormateurDashboard),
    ),
  },
  {
    path: "/formateur/communications",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AnnouncementsPage),
    ),
  },
  {
    path: "/formateur/classement",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(FormateurClassementPage),
    ),
  },
  {
    path: "/formateur/arena",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(TrainerArenaPage),
    ),
  },
  {
    path: "/formateur/videos",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(FormateurVideosPage),
    ),
  },
  {
    path: "/formateur/quizzes",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(FormateurQuizManagementPage),
    ),
  },
  {
    path: "/formateur/mes-stagiaires",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(MesStagiairesPage),
    ),
  },
  {
    path: "/formateur/formations",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(GestionFormations),
    ),
  },
  {
    path: "/formateur/stagiaire/:id",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(StagiaireProfilePage),
    ),
  },
  {
    path: "/formateur/suivi-demandes",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(SuiviDemandesPage),
    ),
  },
  {
    path: "/formateur/suivi-parrainage",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(SuiviParrainagePage),
    ),
  },
  {
    path: "/commercial/suivi-demandes",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(SuiviDemandesPage),
    ),
  },
  {
    path: "/commercial/suivi-parrainage",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(SuiviParrainagePage),
    ),
  },

  {
    path: "/commercial/dashboard",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(CommercialDashboard),
    ),
  },
  {
    path: "/notifications",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(NotificationsPage),
    ),
  },
  {
    path: "/agenda",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AgendaPage),
    ),
  },
  {
    path: "*",
    element: Loadable(NotFound),
  },
];
