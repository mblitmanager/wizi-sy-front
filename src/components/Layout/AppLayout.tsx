import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, BarChart2, User, Menu, Settings, Users, LogOut } from 'lucide-react';
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

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('/auth')) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(() => {
        refreshSession();
      }, 5 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, refreshSession]);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const stagiairesNavItems = [
    { name: 'Accueil', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Formations', path: '/formations', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Quiz', path: '/quiz', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Classement', path: '/classement', icon: <BarChart2 className="h-5 w-5" /> },
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
                  <Button variant="outline" className="w-full font-nunito" onClick={() => logout()}>
                    <LogOut className="h-4 w-4 mr-2" />
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
                <div className="text-sm font-medium font-nunito">{user.email || "Utilisateur"}</div>
                <div className="text-xs text-gray-500 font-roboto">
                  {isAdmin ? 'Administrateur' : `Niveau ${user.level || 1}`}
                </div>
              </div>
              <div className={`${isAdmin ? 'bg-red-500' : 'bg-blue-500'} text-white w-8 h-8 rounded-full flex items-center justify-center font-nunito`}>
                {user.username ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
          )}
        </div>
      </header>

      <SessionTimeoutIndicator />

      <div className="flex flex-1">
        {/* Sidebar pour tablette et desktop */}
        <nav className="hidden md:block w-64 bg-white border-r border-gray-200 pt-4 pb-4">
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
              <Button 
                variant="outline" 
                className="w-full font-nunito" 
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Navigation mobile en bas */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 md:hidden z-10">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => (
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
    </div>
  );
};

export default AppLayout;
