import { ReactNode, useState } from "react";
import MainNav from "./MainNav";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar";
import { useUser } from "@/context/UserContext";
import logo from "../../assets/logo.png";
import { Gift, X } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/system";

interface LayoutProps {
  children: ReactNode;
}
export function Layout({ children }: LayoutProps) {
  const { token } = useUser();
  const [showBanner, setShowBanner] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
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
      <aside className="hidden md:flex md:flex-col md:w-64 border-r border-gray-200 bg-white shadow-sm">
        {/* Logo en haut de la sidebar */}
        <div className="flex items-center justify-center border-b">
          <img src={logo} alt="" className="object-contain h-14 w-40" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <MainNav />
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Barre du haut (Navbar) */}
        <header className="h-14 border-b border-gray-200 bg-white shadow-sm px-4 flex items-center flex-shrink-0">
          <Navbar />
        </header>
        {/* Bannière en haut (uniquement sur desktop) */}
        {showBanner && !isMobile && (
          <div className="w-full bg-[#feb823] rounded-b-lg text-white">
            <div className="container mx-auto px-3 py-2 flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                <Gift className="h-6 w-6 mr-2 flex-shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-xs sm:text-sm">
                    Je parraine et je gagne{" "}
                    <span className="text-white text-2xl font-extrabold drop-shadow-lg">
                      50€
                    </span>{" "}
                  </span>
                  <span className="ml-2 text-xs sm:text-sm text-blue-700 hidden sm:inline">
                    Profitez de notre offre de parrainage dès maintenant !
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  size="sm"
                  variant="outline"
                  className="text-black underline hover:bg-white/10 hover:text-white text-xs px-2"
                  onClick={() => navigate("/parrainage")}
                >
                  Découvrir
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10 p-1"
                  onClick={() => setShowBanner(false)}
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <main
          className={`flex-1 overflow-y-auto ${
            isMobile && showBanner ? "pt-20 pb-20" : ""
          }`}
        >
          <div className="">{children}</div>
        </main>

        {/* Bannière en bas (uniquement sur mobile) */}
        {showBanner && isMobile && (
          <div className="fixed top-[54px] left-0 right-0 bg-[#feb823] rounded-2xl text-white z-40">
            <div className="container mx-auto px-3 py-2 flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                <Gift className="h-4 w-4 mr-2 flex-shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-xs sm:text-sm">
                    Parraine et gagne{" "}
                    <span className="text-white text-2xl font-extrabold drop-shadow-lg">
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
                  onClick={() => navigate("/parrainage")}
                >
                  Voir
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10 p-1"
                  onClick={() => setShowBanner(false)}
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Menu bas pour mobile - MASQUER sur QuizPlay */}
        {!isQuizPlay && (
          <footer className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-md z-50">
            <MobileNav />
          </footer>
        )}
      </div>
    </div>
  );
}
