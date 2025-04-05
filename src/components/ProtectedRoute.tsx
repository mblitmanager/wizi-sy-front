import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: string;
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.roles && !user.roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;