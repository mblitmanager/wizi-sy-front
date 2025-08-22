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
import back from "../../assets/test.jpg";

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
          <div className="w-full bg-[#feb823] rounded-b-lg text-white relative z-30">
            {/* <div className="container mx-auto px-3 py-2 flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                <Gift className="h-6 w-6 mr-2 flex-shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-xs sm:text-sm">
                    Je parraine et je gagne{" "}
                    <span className=" text-xl sm:text-4xl font-black mt-1 drop-shadow-lg text-red-600">
                      50€
                    </span>
                  </span>
                  <span className="ml-2 text-xs sm:text-sm text-[#895129] hidden sm:inline font-bold">
                    Profitez de notre offre de parrainage dès maintenant !
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  to="/parrainage"
                  className="text-black underline hover:bg-white/10 hover:text-white text-xs px-2">
                  Découvrir
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10 p-1"
                  onClick={() => setShowBanner(false)}>
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div> */}
            <div className="container mx-auto px-4 py-2 flex items-center justify-between  rounded-md shadow-md rounded-b-lg">
              <div className="flex items-center overflow-hidden">
                <Gift className="h-6 w-6 mr-2 flex-shrink-0" />

                <div className="truncate">
                  <span className="block font-semibold text-sm sm:text-md text-white">
                    Je parraine et je gagne
                    <span className="ml-1 text-2xl sm:text-2xl font-extrabold drop-shadow-md text-red-600">
                      50 €
                    </span>
                  </span>
                  <span className="block text-xs sm:text-sm text-[#5c371d] font-semibold mt-1">
                    Profitez de notre offre de parrainage dès maintenant !
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  className="text-black underline hover:text-red-700 text-xs sm:text-sm px-2 font-semibold"
                  href="/parrainage">
                  Découvrir
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10 p-1"
                  onClick={() => setShowBanner(false)}>
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
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
        {showBanner && isMobile && (
          <div className="fixed top-[54px] left-0 right-0 bg-[#feb823] rounded-b-lg text-white z-40">
            {/* <div className="container mx-auto px-3 py-2 flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                <Gift className="h-4 w-4 mr-2 flex-shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-xs sm:text-sm">
                    Parraine et gagne{" "}
                    <span className="text-2xl text-[#fff] font-extrabold drop-shadow-lg">
                      50€
                    </span>{" "}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white bg-blue-custom-50 border-white hover:bg-white/10 hover:text-white text-xs px-2"
                  onClick={() => navigate("/parrainage")}>
                  Voir
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10 p-1"
                  onClick={() => setShowBanner(false)}>
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div> */}
            <div className="container mx-auto px-4 py-2 flex items-center justify-between  rounded-md shadow-md">
              <div className="flex items-center overflow-hidden">
                <Gift className="h-6 w-6 mr-2 flex-shrink-0" />

                <div className="truncate">
                  <span className="block font-semibold text-sm sm:text-md text-white">
                    Je parraine et je gagne
                    <span className="ml-1 text-2xl sm:text-2xl font-extrabold drop-shadow-md text-red-600">
                      50 €
                    </span>
                  </span>
                  <span className="block text-xs sm:text-sm text-[#5c371d] font-semibold mt-1">
                    Profitez de notre offre de parrainage dès maintenant !
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  className="text-black underline hover:text-red-700 text-xs sm:text-sm px-2 font-semibold"
                  href="/parrainage">
                  Découvrir
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10 p-1"
                  onClick={() => setShowBanner(false)}>
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
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
