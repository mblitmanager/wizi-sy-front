import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { routes, useAutoPrefetch } from './routes';
import { lazy } from 'react';

// Lazy admin dashboard (minimal route to restore redirections)
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));

function RouterContent() {
  // Active le prefetching automatique des routes liées
  useAutoPrefetch();

  return (
    <Routes>
      {/* Redirect legacy or misspelled admin paths to /admin */}
      <Route path="/administrateur" element={<Navigate to="/admin" replace />} />
      <Route path="/administrateur/*" element={<Navigate to="/admin" replace />} />
      <Route path="/admi/*" element={<Navigate to="/admin" replace />} />

      {/* Minimal admin entry route */}
      <Route path="/admin" element={<AdminDashboard />} />

      {Object.entries(routes).map(([key, route]) => (
        <Route
          key={key}
          path={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
}