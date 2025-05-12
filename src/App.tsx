
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserProvider } from "@/context/UserContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { NotificationManager } from "@/components/notifications/NotificationManager";

// Pages
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
import Notifications from "@/pages/Notifications";

// Components
import { QuizDetail } from "@/components/quiz/QuizDetail";
import { QuizResults } from "@/components/quiz/QuizResults";

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <NotificationManager />
                <BrowserRouter>
                  <Routes>
                    {/* ✅ Routes publiques */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* 🔒 Routes protégées */}
                    <Route
                      path="/catalogue"
                      element={
                        <ProtectedRoute>
                          <Catalogue />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/catalogue/:categoryId"
                      element={
                        <ProtectedRoute>
                          <CategoryFormations />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/formations"
                      element={
                        <ProtectedRoute>
                          <Formation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quizzes"
                      element={
                        <ProtectedRoute>
                          <Quizzes />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quiz"
                      element={
                        <ProtectedRoute>
                          <Navigate to="/quizzes" replace />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quiz/:quizId"
                      element={
                        <ProtectedRoute>
                          <QuizDetail />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quiz/:quizId/start"
                      element={
                        <ProtectedRoute>
                          <Quiz />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quiz/:quizId/results"
                      element={
                        <ProtectedRoute>
                          <QuizResults />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/classement"
                      element={
                        <ProtectedRoute>
                          <Classement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/tuto-astuce"
                      element={
                        <ProtectedRoute>
                          <TutoAstucePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <Notifications />
                        </ProtectedRoute>
                      }
                    />

                    {/* 🚫 Route introuvable */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </NotificationProvider>
          </UserProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default App;
