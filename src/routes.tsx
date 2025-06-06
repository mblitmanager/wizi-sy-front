// src/routes.tsx
import { Index } from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Catalogue from "@/pages/Catalogue";
import CategoryFormations from "@/pages/CategoryFormations";
import Formation from "@/pages/Formation";
import Quizzes from "@/pages/Quizzes";
import Quiz from "@/pages/Quiz";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Classement from "@/pages/Classement";
import TutoAstucePage from "@/pages/TutoAstucePage";
import { QuizDetail } from "@/components/quiz/QuizDetail";
import { QuizResults } from "@/components/quiz/QuizResults";
import Contact from "@/pages/Contact";
import Parainage from "@/pages/Parainage";
import ParrainageInscriptionPage from "@/pages/ParrainageInscriptionPage";
import CatalogueFormationDetails from "@/components/catalogueFormation/CatalogueFormationDetails";
import NotificationsPage from "@/pages/NotificationsPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/parrainage/:token",
    element: <ParrainageInscriptionPage />,
  },
  {
    path: "/catalogue",
    element: <ProtectedRoute><Catalogue /></ProtectedRoute>,
  },
  {
    path: "/catalogue/:categoryId",
    element: <ProtectedRoute><CategoryFormations /></ProtectedRoute>,
  },
  {
    path: "/formations",
    element: <ProtectedRoute><Formation /></ProtectedRoute>,
  },
  {
    path: "/quizzes",
    element: <ProtectedRoute><Quizzes /></ProtectedRoute>,
  },
  {
    path: "/quiz",
    element: <ProtectedRoute><Quiz /></ProtectedRoute>,
  },
  {
    path: "/quiz/:quizId",
    element: <ProtectedRoute><QuizDetail /></ProtectedRoute>,
  },
  {
    path: "/quiz/:quizId/start",
    element: <ProtectedRoute><Quiz /></ProtectedRoute>,
  },
  {
    path: "/quiz/:quizId/results",
    element: <ProtectedRoute><QuizResults /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: "/classement",
    element: <ProtectedRoute><Classement /></ProtectedRoute>,
  },
  {
    path: "/tuto-astuce",
    element: <ProtectedRoute><TutoAstucePage /></ProtectedRoute>,
  },
  {
    path: "/contacts",
    element: <ProtectedRoute><Contact /></ProtectedRoute>,
  },
  {
    path: "/parrainage",
    element: <ProtectedRoute><Parainage /></ProtectedRoute>,
  },
  {
    path: "/catalogue-formation/:id",
    element: <ProtectedRoute><CatalogueFormationDetails /></ProtectedRoute>,
  },
  {
    path: "/notifications",
    element: <ProtectedRoute><NotificationsPage /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]; 