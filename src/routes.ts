import React, { Suspense, lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoadingState } from "@/components/quiz/quiz-play/LoadingState";

// Lazy load components
// Named exports
const Index = lazy(() => import("@/pages/Index").then(module => ({ default: module.Index })));
const QuizDetail = lazy(() => import("@/components/quiz/QuizDetail").then(module => ({ default: module.QuizDetail })));
const QuizResults = lazy(() => import("@/components/quiz/QuizResults").then(module => ({ default: module.QuizResults })));

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
const ParrainageInscriptionPage = lazy(() => import("@/pages/ParrainageInscriptionPage"));
const CatalogueFormationDetails = lazy(() => import("@/components/catalogueFormation/CatalogueFormationDetails"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const CGVPage = lazy(() => import("@/pages/CGVPage"));
const ManuelPage = lazy(() => import("@/pages/ManuelPage"));
const RemerciementsPage = lazy(() => import("@/pages/RemerciementsPage"));
const PolitiqueConfidentialitePage = lazy(() => import("@/pages/PolitiqueConfidentialitePage"));
const ContactSupportPage = lazy(() => import("@/pages/ContactSupportPage"));
const ForgotPassword = lazy(() => import("./components/auth/ForrgotPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const ProfileBadgesPage = lazy(() => import("@/pages/ProfileBadgesPage"));
const ProfileFormationsPage = lazy(() => import("@/pages/ProfileFormationsPage"));
const ProfileStatsPage = lazy(() => import("@/pages/ProfileStatsPage"));
const ProfileEditPage = lazy(() => import("@/pages/ProfileEditPage"));
const StatisticsDashboard = lazy(() => import("@/pages/admin/StatisticsDashboard").then(module => ({ default: module.StatisticsDashboard })));
const FormateurDashboard = lazy(() => import("@/pages/formateur/FormateurDashboard").then(module => ({ default: module.FormateurDashboard })));
const CommercialDashboard = lazy(() => import("@/pages/commercial/CommercialDashboard").then(module => ({ default: module.CommercialDashboard })));
const AnnouncementsPage = lazy(() => import("@/pages/admin/AnnouncementsPage").then(module => ({ default: module.AnnouncementsPage })));

// Helper to wrap components in Suspense
const Loadable = (Component: React.LazyExoticComponent<any>) =>
  React.createElement(
    Suspense,
    { fallback: React.createElement(LoadingState) },
    React.createElement(Component)
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
      Loadable(Catalogue)
    ),
  },
  {
    path: "/catalogue/:categoryId",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(CategoryFormations)
    ),
  },
  {
    path: "/formations",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Formation)
    ),
  },
  {
    path: "/quizzes",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Quizzes)
    ),
  },
  {
    path: "/quiz",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Quiz)
    ),
  },
  {
    path: "/quiz/:quizId",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(QuizDetail)
    ),
  },
  {
    path: "/quiz/:quizId/start",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Quiz)
    ),
  },
  {
    path: "/quiz/:quizId/results",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(QuizResults)
    ),
  },
  // Routes de profil
  {
    path: "/profile",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Profile)
    ),
  },
  {
    path: "/profile/badges",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(ProfileBadgesPage)
    ),
  },
  {
    path: "/profile/formations",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(ProfileFormationsPage)
    ),
  },
  {
    path: "/profile/statistiques",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(ProfileStatsPage)
    ),
  },
  {
    path: "/profile/edit",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(ProfileEditPage)
    ),
  },
  {
    path: "/settings",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Settings)
    ),
  },
  {
    path: "/classement",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Classement)
    ),
  },
  {
    path: "/tuto-astuce",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(TutoAstucePage)
    ),
  },
  {
    path: "/contacts",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Contact)
    ),
  },
  {
    path: "/parrainage",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(Parainage)
    ),
  },
  {
    path: "/catalogue-formation/:id",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(CatalogueFormationDetails)
    ),
  },
  {
    path: "/admin/statistics",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(StatisticsDashboard)
    ),
  },
  {
    path: "/admin/announcements",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(AnnouncementsPage)
    ),
  },
  {
    path: "/formateur/dashboard",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(FormateurDashboard)
    ),
  },
  {
    path: "/commercial/dashboard",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(CommercialDashboard)
    ),
  },
  {
    path: "/notifications",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      Loadable(NotificationsPage)
    ),
  },
  {
    path: "*",
    element: Loadable(NotFound),
  },
];
