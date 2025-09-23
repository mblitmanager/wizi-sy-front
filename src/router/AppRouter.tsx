import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes, useAutoPrefetch } from './routes';

function RouterContent() {
  // Active le prefetching automatique des routes liées
  useAutoPrefetch();

  return (
    <Routes>
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