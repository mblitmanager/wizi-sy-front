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
        <div className="flex items-center justify-center border-b ">
          <img src={logo} alt="" className="object-contain h-14 w-40" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <MainNav />
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Barre du haut (Navbar) */}
        <header className="h-14 shadow-sm px-4 flex items-center flex-shrink-0">
          <Navbar />
        </header>
        {/* Bannière en haut (uniquement sur desktop) */}
        {showBanner && !isMobile && (
          <div className="w-full relative rounded-b-lg text-white overflow-hidden h-[70px]">
            {/* Conteneur de l'animation SVG en arrière-plan */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
              <svg
                className="w-full h-full object-cover"
                viewBox="0 0 1200 200"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg">
                {/* Dégradé de fond */}
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" /> {/* yellow-500 */}
                    <stop offset="50%" stopColor="#ec4899" /> {/* pink-500 */}
                    <stop offset="100%" stopColor="#8b5cf6" />{" "}
                    {/* purple-500 */}
                  </linearGradient>
                </defs>

                {/* Rectangle de fond avec dégradé */}
                <rect width="100%" height="100%" fill="url(#gradient)" />

                {/* Vague animée */}
                <path
                  fill="rgba(255,255,255,0.15)"
                  d="M0,150 C150,170 350,130 500,150 C650,170 850,130 1200,150 L1200,200 L0,200 Z">
                  <animate
                    attributeName="d"
                    dur="10s"
                    repeatCount="indefinite"
                    values="
            M0,150 C150,170 350,130 500,150 C650,170 850,130 1200,150 L1200,200 L0,200 Z;
            M0,140 C150,160 350,140 500,160 C650,180 850,140 1200,160 L1200,200 L0,200 Z;
            M0,150 C150,130 350,170 500,150 C650,130 850,170 1200,150 L1200,200 L0,200 Z;
            M0,150 C150,170 350,130 500,150 C650,170 850,130 1200,150 L1200,200 L0,200 Z
          "
                  />
                </path>

                {/* Seconde vague pour plus de profondeur */}
                <path
                  fill="rgba(255,255,255,0.1)"
                  d="M0,160 C200,140 400,180 600,160 C800,140 1000,180 1200,160 L1200,200 L0,200 Z">
                  <animate
                    attributeName="d"
                    dur="12s"
                    repeatCount="indefinite"
                    values="
            M0,160 C200,140 400,180 600,160 C800,140 1000,180 1200,160 L1200,200 L0,200 Z;
            M0,150 C200,130 400,170 600,150 C800,130 1000,170 1200,150 L1200,200 L0,200 Z;
            M0,170 C200,150 400,190 600,170 C800,150 1000,190 1200,170 L1200,200 L0,200 Z;
            M0,160 C200,140 400,180 600,160 C800,140 1000,180 1200,160 L1200,200 L0,200 Z
          "
                  />
                </path>
              </svg>
            </div>

            {/* Points lumineux */}
            <div className="absolute inset-0 opacity-30 z-0">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    width: `${Math.random() * 5 + 2}px`,
                    height: `${Math.random() * 5 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.3 + 0.1,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                  }}
                />
              ))}
            </div>

            {/* Contenu de la bannière */}
            <div className="container mx-auto px-3 py-2 flex items-center justify-between relative z-10 h-full">
              <div className="flex items-center overflow-hidden">
                <Gift className="h-6 w-6 mr-2 flex-shrink-0 text-white drop-shadow-md" />
                <div className="truncate">
                  <span className="font-bold text-xs sm:text-sm drop-shadow-md">
                    Je parraine et je gagne{" "}
                    <span className="text-white text-2xl font-extrabold drop-shadow-lg">
                      50€
                    </span>
                  </span>
                  <span className="ml-2 text-xs sm:text-sm hidden sm:inline drop-shadow-md">
                    Profitez de notre offre de parrainage dès maintenant !
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  size="sm"
                  variant="outline"
                  className="text-purple-900 bg-white/90 hover:bg-white hover:text-purple-800 font-medium text-xs px-2 py-1 rounded-md transition-all shadow-sm"
                  to="/parrainage">
                  Découvrir
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-1 rounded-full"
                  onClick={() => setShowBanner(false)}>
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
          }`}>
          <div className="p-3 mx-8">{children}</div>
        </main>

        {/* Bannière en bas (uniquement sur mobile) */}
        {showBanner && isMobile && (
          <div className="fixed top-[54px] left-0 right-0 bg-gradient-to-r from-yellow-shade-2 via-yellow-shade to-yellow-shade-2 rounded-2xl text-white z-40">
            {/* Conteneur de l'animation SVG en arrière-plan */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
              <svg
                className="w-full h-full object-cover"
                viewBox="0 0 1200 200"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg">
                {/* Dégradé de fond */}
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" /> {/* yellow-500 */}
                    <stop offset="50%" stopColor="#ec4899" /> {/* pink-500 */}
                    <stop offset="100%" stopColor="#8b5cf6" />{" "}
                    {/* purple-500 */}
                  </linearGradient>
                </defs>

                {/* Rectangle de fond avec dégradé */}
                <rect width="100%" height="100%" fill="url(#gradient)" />

                {/* Vague animée */}
                <path
                  fill="rgba(255,255,255,0.15)"
                  d="M0,150 C150,170 350,130 500,150 C650,170 850,130 1200,150 L1200,200 L0,200 Z">
                  <animate
                    attributeName="d"
                    dur="10s"
                    repeatCount="indefinite"
                    values="
            M0,150 C150,170 350,130 500,150 C650,170 850,130 1200,150 L1200,200 L0,200 Z;
            M0,140 C150,160 350,140 500,160 C650,180 850,140 1200,160 L1200,200 L0,200 Z;
            M0,150 C150,130 350,170 500,150 C650,130 850,170 1200,150 L1200,200 L0,200 Z;
            M0,150 C150,170 350,130 500,150 C650,170 850,130 1200,150 L1200,200 L0,200 Z
          "
                  />
                </path>

                {/* Seconde vague pour plus de profondeur */}
                <path
                  fill="rgba(255,255,255,0.1)"
                  d="M0,160 C200,140 400,180 600,160 C800,140 1000,180 1200,160 L1200,200 L0,200 Z">
                  <animate
                    attributeName="d"
                    dur="12s"
                    repeatCount="indefinite"
                    values="
            M0,160 C200,140 400,180 600,160 C800,140 1000,180 1200,160 L1200,200 L0,200 Z;
            M0,150 C200,130 400,170 600,150 C800,130 1000,170 1200,150 L1200,200 L0,200 Z;
            M0,170 C200,150 400,190 600,170 C800,150 1000,190 1200,170 L1200,200 L0,200 Z;
            M0,160 C200,140 400,180 600,160 C800,140 1000,180 1200,160 L1200,200 L0,200 Z
          "
                  />
                </path>
              </svg>
            </div>

            {/* Points lumineux */}
            <div className="absolute inset-0 opacity-30 z-0">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    width: `${Math.random() * 5 + 2}px`,
                    height: `${Math.random() * 5 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.3 + 0.1,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                  }}
                />
              ))}
            </div>

            {/* Contenu de la bannière */}
            <div className="container mx-auto px-3 py-2 flex items-center justify-between relative z-10 h-full">
              <div className="flex items-center overflow-hidden">
                <Gift className="h-6 w-6 mr-2 flex-shrink-0 text-white drop-shadow-md" />
                <div className="truncate">
                  <span className="font-bold text-xs sm:text-sm drop-shadow-md">
                    Je parraine et je gagne{" "}
                    <span className="text-white text-2xl font-extrabold drop-shadow-lg">
                      50€
                    </span>
                  </span>
                  <span className="ml-2 text-xs sm:text-sm hidden sm:inline drop-shadow-md">
                    Profitez de notre offre de parrainage dès maintenant !
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  size="sm"
                  variant="outline"
                  className="text-purple-900 bg-white/90 hover:bg-white hover:text-purple-800 font-medium text-xs px-2 py-1 rounded-md transition-all shadow-sm"
                  to="/parrainage">
                  Découvrir
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-1 rounded-full"
                  onClick={() => setShowBanner(false)}>
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
