import { ReactNode, useState } from "react";
import MainNav from "./MainNav";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar";
import { useUser } from "@/hooks/useAuth";
const logo = '/assets/logo.png';
import { Menu, X,  LogOut } from "lucide-react";
import { useMediaQuery } from "@mui/system";
import { ParrainageBanner } from "../parrainage/ParrainageBanner";
import { Link } from "react-router-dom";
import { Button } from "react-day-picker";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { token } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Règles de responsive design
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isLaptop = useMediaQuery("(min-width: 1025px) and (max-width: 1440px)");
  const isDesktop = useMediaQuery("(min-width: 1441px)");

  const isQuizPlay =
    window.location.pathname.startsWith("/quiz/") &&
    window.location.pathname.includes("start");

  if (!token) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-background text-gray-900">
      {/* Sidebar - Visible sur laptop et desktop */}
      <aside
        className={`
        hidden 
        ${isLaptop || isDesktop ? "lg:flex" : "lg:hidden"}
        flex-col 
        ${isLaptop ? "w-60" : "w-64"}
        border-r border-gray-200 bg-white shadow-sm
        transition-all duration-300
      `}>
        {/* Logo en haut de la sidebar */}
        <Link to="/" className="flex items-center justify-center border-b p-4">
          <img
            src={logo}
            alt="Logo"
            className={`
              object-contain 
              ${isLaptop ? "h-12 w-32" : "h-14 w-40"}
              transition-all duration-300
            `}
          />
        </Link>
               <Button
      onClick={onLogout}
      className="text-red-600 hover:bg-red-50">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Déconnexion</span>
    </Button>
        <div className="flex-1 overflow-y-auto">
          <MainNav />
        </div>
      </aside>

      {/* Menu burger pour mobile ET tablette */}
      {(isMobile || isTablet) && isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl z-50">
            <div className="flex items-center justify-between p-4 border-b">
              <img src={logo} alt="Logo" className="object-contain h-10" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              <MainNav onItemClick={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 h-screen min-w-0">
        {" "}
        {/* min-w-0 pour éviter les débordements */}
        {/* Header */}
        <header
          className={`
          border-b border-gray-200 bg-white shadow-sm 
          flex items-center flex-shrink-0 justify-between 
          relative z-10
          ${isMobile ? "h-12 px-3" : ""}
          ${isTablet ? "h-14 px-4" : ""}
          ${isLaptop || isDesktop ? "h-16 px-6" : ""}
          transition-all duration-300
        `}>
          {/* Bouton menu burger pour mobile ET tablette */}
          {(isMobile || isTablet) && !isQuizPlay && (
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Ouvrir le menu">
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div
            className={`
            flex-1 flex 
            ${isMobile ? "justify-center" : "justify-start"}
            ${isTablet ? "justify-start ml-2" : ""}
            ${isLaptop || isDesktop ? "justify-start" : ""}
          `}>
            <Navbar onMenuToggle={() => setIsMenuOpen(true)} />
          </div>
        </header>
        {/* Bannière responsive */}
        {!isQuizPlay && (
          <>
            {!isMobile && <ParrainageBanner />}
            {isMobile && <ParrainageBanner isMobile={true} />}
          </>
        )}
        {/* Main content */}
        <main
          className={`
            flex-1 overflow-y-auto bg-slate-100 relative z-10 
            ${
              isMobile ? "pt-[50px] pb-16" : ""
            } /* Espace pour le footer mobile */
            ${isTablet ? "pt-4" : ""}
            ${isLaptop || isDesktop ? "pt-6" : ""}
            transition-all duration-300
          `}>
          <div
            className={`
            h-full
            ${isMobile ? "px-3 py-2" : ""}
            ${isTablet ? "px-4 py-3" : ""}
            ${isLaptop ? "px-6 py-4" : ""}
            ${isDesktop ? "px-8 py-6" : ""}
            bg-slate-100
          `}>
            <div
              className={`
              bg-white rounded-lg shadow-sm
              ${isMobile ? "p-3" : ""}
              ${isTablet ? "p-4" : ""}
              ${isLaptop ? "p-5" : ""}
              ${isDesktop ? "p-6" : ""}
              min-h-[calc(100vh-200px)] /* Hauteur minimale adaptative */
              transition-all duration-300
            `}>
              {children}
            </div>
          </div>
        </main>
        {/* Footer mobile - Seulement sur mobile */}
        {!isQuizPlay && isMobile && (
          <footer className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-md z-50">
            <MobileNav />
          </footer>
        )}
      </div>
    </div>
  );
}
