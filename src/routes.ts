// src/routes.ts
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
import React from "react";
import ForgotPassword from "./components/auth/ForrgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

export const routes = [
  {
    path: "/",
    element: React.createElement(Index),
  },
  {
    path: "/login",
    element: React.createElement(Login),
  },
  {
    path: "/forgot-password",
    element: React.createElement(ForgotPassword),
  },
  {
    path: "/reset-password",
    element: React.createElement(ResetPassword),
  },
  {
    path: "/register",
    element: React.createElement(Register),
  },
  {
    path: "/parrainage/:token",
    element: React.createElement(ParrainageInscriptionPage),
  },
  {
    path: "/catalogue",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Catalogue)
    ),
  },
  {
    path: "/catalogue/:categoryId",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(CategoryFormations)
    ),
  },
  {
    path: "/formations",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Formation)
    ),
  },
  {
    path: "/quizzes",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Quizzes)
    ),
  },
  {
    path: "/quiz",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Quiz)
    ),
  },
  {
    path: "/quiz/:quizId",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(QuizDetail)
    ),
  },
  {
    path: "/quiz/:quizId/start",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Quiz)
    ),
  },
  {
    path: "/quiz/:quizId/results",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(QuizResults)
    ),
  },
  {
    path: "/profile",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Profile)
    ),
  },
  {
    path: "/settings",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Settings)
    ),
  },
  {
    path: "/classement",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Classement)
    ),
  },
  {
    path: "/tuto-astuce",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(TutoAstucePage)
    ),
  },
  {
    path: "/contacts",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Contact)
    ),
  },
  {
    path: "/parrainage",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(Parainage)
    ),
  },
  {
    path: "/catalogue-formation/:id",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(CatalogueFormationDetails)
    ),
  },
  {
    path: "/notifications",
    element: React.createElement(
      ProtectedRoute,
      undefined,
      React.createElement(NotificationsPage)
    ),
  },
  {
    path: "*",
    element: React.createElement(NotFound),
  },
];
