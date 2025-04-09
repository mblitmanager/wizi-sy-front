
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Layouts
import AppLayout from "@/components/Layout/AppLayout";
import AuthLayout from "@/components/Layout/AuthLayout";

// Pages
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import QuizPage from "@/pages/QuizPage";
import QuizCatalogPage from "@/pages/QuizCatalogPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ProfilePage from "@/pages/ProfilePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";

// Components
import { SessionTimeoutIndicator } from "@/components/Auth/SessionTimeoutIndicator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionTimeoutIndicator />
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="category/:id" element={<CategoryPage />} />
              <Route path="quiz/:id" element={<QuizPage />} />
              <Route path="quiz" element={<QuizCatalogPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
