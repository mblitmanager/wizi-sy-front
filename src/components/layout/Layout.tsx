import { ReactNode, useState } from "react";
import MainNav from "./MainNav";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar";
import { useUser } from "@/hooks/useAuth";
import logo from "../../assets/logo.png";
import { Menu, X } from "lucide-react";
import { useMediaQuery } from "@mui/system";
import { ParrainageBanner } from "../parrainage/ParrainageBanner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { token } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const isQuizPlay =
    window.location.pathname.startsWith("/quiz/") &&
    window.location.pathname.includes("start");

  if (!token) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-background text-gray-900">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-center border-b">
          <img src={logo} alt="Logo" className="object-contain h-14 w-40" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <MainNav />
        </div>
      </aside>

      {/* Menu burger tablette */}
      {isTablet && isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl z-50">
            <div className="flex items-center justify-between p-4 border-b">
              <img src={logo} alt="Logo" className="object-contain h-10" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <MainNav onItemClick={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <header className="h-14 border-b border-gray-200 bg-white shadow-sm flex items-center flex-shrink-0 justify-between px-4 relative z-40">
          {isTablet && !isQuizPlay && (
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1 flex justify-center lg:justify-start">
            <Navbar />
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
          className={`flex-1 overflow-y-auto bg-slate-100 relative z-10 ${
            isMobile ? "pt-[60px]" : ""
          }`}>
          <div className="container mx-auto p-4 md:p-6 bg-slate-100">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {children}
            </div>
          </div>
        </main>

        {/* Footer mobile */}
        {!isQuizPlay && isMobile && (
          <footer className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-md z-50">
            <MobileNav />
          </footer>
        )}
      </div>
    </div>
  );
}
