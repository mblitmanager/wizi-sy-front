
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, BarChart2, User, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // If user is not authenticated and not on auth pages, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('/auth')) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Navigation items for both bottom and side navigation
  const navItems = [
    { name: 'Accueil', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Quiz', path: '/quiz', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Classement', path: '/leaderboard', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Profil', path: '/profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top header */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="px-2 py-6">
                <h2 className="text-xl font-bold mb-6">LearnQuest</h2>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
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
                  <Button variant="outline" className="w-full" onClick={logout}>
                    Déconnexion
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold ml-2">LearnQuest</h1>
        </div>
        <div className="flex items-center">
          {user && (
            <div className="flex items-center">
              <div className="mr-2 hidden md:block text-right">
                <div className="text-sm font-medium">{user.username}</div>
                <div className="text-xs text-gray-500">Niveau {user.level}</div>
              </div>
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto py-4 px-4">
        <Outlet />
      </main>

      {/* Bottom navigation bar (mobile only) */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Side navigation (desktop only) - hidden on mobile */}
      <nav className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 pt-16">
        <div className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
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
            <Button variant="outline" className="w-full" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
