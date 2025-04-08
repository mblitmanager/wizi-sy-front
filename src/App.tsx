import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import QuizList from "./pages/QuizList";
import QuizPlay from "./pages/QuizPlay";
import DemoQuiz from "./pages/quiz/DemoQuiz";
import Formations from "./pages/Formations";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Contacts from "./pages/Contacts";
import Ranking from "./pages/Ranking";
import Referral from "./pages/Referral";
import Catalog from "./pages/Catalog";
import Tutorials from "./pages/Tutorials";
import History from "./pages/user/History";
import Achievements from "./pages/user/Achievements";
import Notifications from "./pages/user/Notifications";
import Settings from "./pages/user/Settings";
import Challenges from "./pages/Challenges";
import LanguageLearning from "./pages/games/LanguageLearning";
import DuolingoStyle from "./pages/games/DuolingoStyle";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import UsersManagement from "./pages/admin/Users/Users";
import QuizManagement from "./pages/admin/Quizzes";
import QuestionsManagement from "./pages/admin/Questions";
import FormationsManagement from "./pages/admin/Formations";
import CatalogManagement from "./pages/admin/Catalog";
import ContactsManagement from "./pages/admin/Contacts";
import RankingsManagement from "./pages/admin/Rankings";
import ReferralsManagement from "./pages/admin/Referrals";
import MediaManagement from "./pages/admin/Media";
import ChallengesManagement from "./pages/admin/Challenges";
import ScheduleManagement from "./pages/admin/Schedule";
import StatisticsManagement from "./pages/admin/Statistics";
import CreateUser from "./pages/admin/Users/CreateUser";
import UpdateUser from "./pages/admin/Users/UpdateUser";
import DetailUser from "./pages/admin/Users/DetailsUser";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/demo-quiz" element={<DemoQuiz />} />

          {/* Student Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quiz" element={<QuizList />} />
            <Route path="/quiz/:id" element={<QuizPlay />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/history" element={<History />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/games/language" element={<LanguageLearning />} />
            <Route path="/games/duolingo" element={<DuolingoStyle />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* user  */}
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/users/create" element={<CreateUser />} />
            <Route path="/admin/users/:id/update" element={<UpdateUser />} />
            <Route path="/admin/users/:id/details" element={<DetailUser />} />
            {/* ==== */}
            <Route path="/admin/quizzes" element={<QuizManagement />} />
            <Route path="/admin/questions" element={<QuestionsManagement />} />
            <Route
              path="/admin/formations"
              element={<FormationsManagement />}
            />
            <Route path="/admin/catalog" element={<CatalogManagement />} />
            <Route path="/admin/contacts" element={<ContactsManagement />} />
            <Route path="/admin/rankings" element={<RankingsManagement />} />
            <Route path="/admin/referrals" element={<ReferralsManagement />} />
            <Route path="/admin/media" element={<MediaManagement />} />
            <Route
              path="/admin/challenges"
              element={<ChallengesManagement />}
            />
            <Route path="/admin/schedule" element={<ScheduleManagement />} />
            <Route
              path="/admin/statistics"
              element={<StatisticsManagement />}
            />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
