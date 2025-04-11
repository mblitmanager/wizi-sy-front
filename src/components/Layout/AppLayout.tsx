
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, BarChart2, User, Menu, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { SessionTimeoutIndicator } from '@/components/Auth/SessionTimeoutIndicator';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin, refreshSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Si l'utilisateur n'est pas authentifié et pas sur les pages auth, rediriger vers login
  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('/auth')) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);
  
  // Rediriger les administrateurs vers le tableau de bord admin et les stagiaires vers l'accueil
  useEffect(() => {
    if (isAuthenticated) {
      // Si c'est la page racine, rediriger en fonction du rôle
      if (location.pathname === '/') {
        if (isAdmin) {
          navigate('/admin');
        }
        // Les stagiaires restent sur la page d'accueil (/)
      }
      // Si c'est une page admin et l'utilisateur n'est pas admin, rediriger vers l'accueil
      else if (location.pathname.includes('/admin') && !isAdmin) {
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, location.pathname, navigate]);

  // Vérifier et rafraîchir la session régulièrement
  useEffect(() => {
    if (isAuthenticated) {
      // Vérifier la session toutes les 5 minutes
      const intervalId = setInterval(() => {
        refreshSession();
      }, 5 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, refreshSession]);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Éléments de navigation pour la barre inférieure et latérale
  const stagiairesNavItems = [
    { name: 'Accueil', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Quiz', path: '/quiz', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Classement', path: '/leaderboard', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Profil', path: '/profile', icon: <User className="h-5 w-5" /> },
  ];

  const adminNavItems = [
    { name: 'Tableau de bord', path: '/admin', icon: <Home className="h-5 w-5" /> },
    { name: 'Administration', path: '/admin/users', icon: <Settings className="h-5 w-5" /> },
    { name: 'Profil', path: '/profile', icon: <User className="h-5 w-5" /> },
  ];

  const navItems = isAdmin ? adminNavItems : stagiairesNavItems;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold mb-6 font-montserrat">Wizi Learn</SheetTitle>
              </SheetHeader>
              <div className="px-2 py-6">
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 py-2 px-3 rounded-md font-nunito ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
                <div className="mt-10">
                  <Button variant="outline" className="w-full font-nunito" onClick={logout}>
                    Déconnexion
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold ml-2 font-montserrat">Wizi Learn</h1>
          {isAdmin && <span className="ml-2 text-sm bg-red-500 text-white px-2 py-0.5 rounded font-nunito">Admin</span>}
        </div>
        <div className="flex items-center">
          {user && (
            <div className="flex items-center">
              <div className="mr-2 hidden md:block text-right">
                <div className="text-sm font-medium font-nunito">{user.username}</div>
                <div className="text-xs text-gray-500 font-roboto">
                  {isAdmin ? 'Administrateur' : `Niveau ${user.level}`}
                </div>
              </div>
              <div className={`${isAdmin ? 'bg-red-500' : 'bg-blue-500'} text-white w-8 h-8 rounded-full flex items-center justify-center font-nunito`}>
                {user.username ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Session Timeout Indicator */}
      <SessionTimeoutIndicator />

      {/* Contenu principal */}
      <main className="flex-grow container mx-auto py-4 px-4">
        <Outlet />
      </main>

      {/* Barre de navigation inférieure (mobile uniquement) */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 md:hidden z-10">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center text-xs font-nunito ${
                isActive(item.path) ? 'text-blue-600 font-medium' : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Navigation latérale (desktop uniquement) - cachée sur mobile */}
      <nav className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 pt-16 z-10">
        <div className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 py-2 px-3 rounded-md font-nunito ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-200 mt-8">
            <Button variant="outline" className="w-full font-nunito" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
