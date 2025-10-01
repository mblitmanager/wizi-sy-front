import { ReactNode, useState } from "react";
import MainNav from "./MainNav";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar";
import { useUser } from "@/hooks/useAuth";
import logo from "../../assets/logo.png";
import { Gift, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/system";
import gift from "../../../public/assets/giftbox.png";

interface LayoutProps {
  children: ReactNode;
}
export function Layout({ children }: LayoutProps) {
  const { token } = useUser();
  const [showBanner, setShowBanner] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const navigate = useNavigate();

  // Détecter si on est sur la page QuizPlay
  const isQuizPlay =
    window.location.pathname.startsWith("/quiz/") &&
    window.location.pathname.includes("start");

  if (!token) {
    return <>{children}</>; // Pas de layout si pas connecté
  }

  return (
    <div className="min-h-screen flex bg-background text-gray-900">
      {/* Sidebar - visible sur desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-gray-200 bg-white shadow-sm">
        {/* Logo en haut de la sidebar */}
        <div className="flex items-center justify-center border-b">
          <img src={logo} alt="" className="object-contain h-14 w-40" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <MainNav />
        </div>
      </aside>

      {/* Menu burger pour tablettes et mobiles */}
      {isTablet && isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl z-50">
            <div className="flex items-center justify-between p-4 border-b">
              <img src={logo} alt="" className="object-contain h-10" />
              <button
                type="button"
                className="rounded-md p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-60 relative"
                onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto ">
              <MainNav onItemClick={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Barre du haut (Navbar) */}
        <header className="h-14 border-b border-gray-200 bg-white shadow-sm flex items-center flex-shrink-0 justify-between px-4 z-40 relative">
          {/* Bouton menu burger pour tablettes et mobiles (masqué sur desktop) */}
          {isTablet && !isQuizPlay && (
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 z-50 relative"
              onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex-1 flex justify-center lg:justify-start">
            <Navbar />
          </div>
        </header>

        {/* Bannière en haut (uniquement sur desktop) */}
        {showBanner && !isMobile && (
          <div className="bg-slate-100 text-white relative z-30">
            <div className="container mx-auto px-4 h-[60px] flex items-center justify-between rounded-md shadow-md bg-gradient-to-r from-orange-500 to-red-600">
              {/* Contenu centré */}
              <div className="flex-1 flex items-center justify-center gap-2">
                {/* Icône cadeau oblique */}
                <img
                  src={gift}
                  className="h-7 w-7 text-white drop-shadow-md transform"
                />

                {/* Texte */}
                <span
                  className="font-extrabold text-xl sm:text-3xl text-white drop-shadow-md transform"
                  style={{ fontFamily: "Poppins" }}>
                  Je parraine et je gagne
                  <span className="ml-2 text-3xl text-yellow-300 drop-shadow-lg">
                    50 €
                  </span>
                </span>

                {/* Flèche */}
                <Link
                  to="/parrainage"
                  className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white hover:text-yellow-300 transition-transform transform hover:translate-x-1 drop-shadow-md"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Bouton X (fermer) */}
              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-yellow-300 transition">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
        <main
          className={`flex-1 overflow-y-auto bg-slate-100 ${
            isMobile && showBanner ? "pt-20 pb-20" : ""
          } relative z-10`}>
          <div className="container mx-auto p-4 md:p-6 bg-slate-100">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {children}
            </div>
          </div>
        </main>

        {/* Bannière en bas (uniquement sur mobile) */}
        {/* Bannière en bas (uniquement sur mobile) */}
        {showBanner && isMobile && (
          <div className="fixed top-[54px] left-0 right-0 z-40">
            <div className="container mx-auto px-4 h-[60px] flex items-center justify-center rounded-md shadow-md bg-gradient-to-r from-orange-500 to-red-600 relative">
              {/* Contenu centré */}
              <div className="flex items-center gap-2">
                {/* Cadeau oblique */}
                <img
                  src={gift}
                  className="h-6 w-6 text-white drop-shadow-md transform"
                />

                {/* Texte */}
                <span
                  className="font-extrabold text-lg sm:text-xl text-white drop-shadow-md transform"
                  style={{ fontFamily: '"Inter", sans-serif' }}>
                  Je parraine et je gagne
                  <span className="ml-1 text-2xl text-yellow-300 drop-shadow-lg">
                    50 €
                  </span>
                </span>

                {/* Flèche */}
                <Link
                  to="/parrainage"
                  className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white hover:text-yellow-300 transition-transform transform hover:translate-x-1 drop-shadow-md"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Bouton X (fermer) */}
              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-yellow-300 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Menu bas pour mobile - MASQUER sur QuizPlay */}
        {!isQuizPlay && isMobile && (
          <footer className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-md z-50">
            <MobileNav />
          </footer>
        )}
      </div>
    </div>
  );
}
