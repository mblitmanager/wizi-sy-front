import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import QuizList from './pages/QuizList';
import QuizPlay from './pages/QuizPlay';
import Formations from './pages/Formations';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Contacts from './pages/Contacts';
import Ranking from './pages/Ranking';
import Referral from './pages/Referral';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/Users';
import QuizManagement from './pages/admin/Quizzes';
import ContactsManagement from './pages/admin/Contacts';
import RankingsManagement from './pages/admin/Rankings';
import ReferralsManagement from './pages/admin/Referrals';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Student Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quiz" element={<QuizList />} />
            <Route path="/quiz/:id" element={<QuizPlay />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/referral" element={<Referral />} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute requireAdmin={true}><Layout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/quizzes" element={<QuizManagement />} />
            <Route path="/admin/contacts" element={<ContactsManagement />} />
            <Route path="/admin/rankings" element={<RankingsManagement />} />
            <Route path="/admin/referrals" element={<ReferralsManagement />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;