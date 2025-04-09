
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Wizi Learn</h1>
            <p className="text-gray-600 mt-1">Votre parcours d'apprentissage interactif</p>
          </div>
          <Outlet />
        </div>
      </div>
      <footer className="py-4 text-center text-gray-500 text-sm">
        © 2025 Wizi Learn. Tous droits réservés.
      </footer>
    </div>
  );
};

export default AuthLayout;
