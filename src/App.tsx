
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { Index } from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Catalogue from "./pages/Catalogue";
import CategoryFormations from "./pages/CategoryFormations";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Formation from "./pages/Formation";
import Quizzes from "./pages/Quizzes";
import { QuizDetail } from "@/components/quiz/QuizDetail";
import { QuizResults } from "@/components/quiz/QuizResults";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Routes protégées */}
                <Route path="/catalogue" element={
                  <ProtectedRoute>
                    <Catalogue />
                  </ProtectedRoute>
                } />
                <Route path="/catalogue/:categoryId" element={
                  <ProtectedRoute>
                    <CategoryFormations />
                  </ProtectedRoute>
                } />
                <Route path="/formations" element={
                  <ProtectedRoute>
                    <Formation />
                  </ProtectedRoute>
                } />
                <Route path="/quizzes" element={
                  <ProtectedRoute>
                    <Quizzes />
                  </ProtectedRoute>
                } />
                <Route path="/quiz" element={
                  <ProtectedRoute>
                    <Navigate to="/quizzes" replace />
                  </ProtectedRoute>
                } />
                <Route path="/quiz/:quizId" element={
                  <ProtectedRoute>
                    <QuizDetail />
                  </ProtectedRoute>
                } />
                <Route path="/quiz/:quizId/start" element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                } />
                <Route path="/quiz/:quizId/results" element={
                  <ProtectedRoute>
                    <QuizResults />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

export default App;
