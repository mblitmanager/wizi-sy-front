import { lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { withSuspense } from '@/utils/withSuspense';

// Routes avec code splitting
export const routes = {
  home: {
    path: '/',
    component: withSuspense(lazy(() => import('@/pages/LandingPage'))),
    preload: () => import('@/pages/LandingPage'),
  },
  login: {
    path: '/login',
    component: withSuspense(lazy(() => import('@/pages/Login'))),
    preload: () => import('@/pages/Login'),
  },
  contact: {
    path: '/contact',
    component: withSuspense(lazy(() => import('@/pages/Contact'))),
    preload: () => import('@/pages/Contact'),
  },
  quiz: {
    path: '/quiz',
    component: withSuspense(lazy(() => import('@/pages/Quiz'))),
    preload: () => import('@/pages/Quiz'),
  },
  formations: {
    path: '/formations',
    component: withSuspense(lazy(() => import('@/pages/Formations'))),
    preload: () => import('@/pages/Formations'),
  },
};

// Type des routes
export type RouteKey = keyof typeof routes;

// Hook pour le prefetching des routes
export function usePrefetch() {
  const prefetch = (routeKey: RouteKey) => {
    const route = routes[routeKey];
    if (route.preload) {
      route.preload();
    }
  };

  return { prefetch };
}

// Hook pour la navigation optimisée
export function useOptimizedNavigate() {
  const navigate = useNavigate();
  const { prefetch } = usePrefetch();

  const navigateTo = (routeKey: RouteKey) => {
    const route = routes[routeKey];
    // Précharger la route avant la navigation
    prefetch(routeKey);
    navigate(route.path);
  };

  return navigateTo;
}

// Hook pour le prefetching automatique des routes liées
export function useAutoPrefetch() {
  const location = useLocation();
  const { prefetch } = usePrefetch();

  // Mapping des routes liées qui devraient être préchargées
  const relatedRoutes: Record<string, RouteKey[]> = {
    '/': ['login', 'contact'],
    '/login': ['home'],
    '/contact': ['home'],
    '/quiz': ['formations'],
    '/formations': ['quiz'],
  };

  const currentRelatedRoutes = relatedRoutes[location.pathname];
  if (currentRelatedRoutes) {
    currentRelatedRoutes.forEach(prefetch);
  }
}