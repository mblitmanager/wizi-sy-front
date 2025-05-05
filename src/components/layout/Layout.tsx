import { ReactNode } from "react";
import MainNav from "./MainNav";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar";
import { useUser } from "@/context/UserContext";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { token } = useUser();

  if (!token) {
    return <>{children}</>; // Pas de layout si pas connecté
  }

  return (
    <div className="min-h-screen flex bg-background text-gray-900">
      {/* Sidebar - visible sur desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r border-gray-200 bg-white shadow-sm">
        {/* Logo en haut de la sidebar */}
        <div className="h-16 flex items-center justify-center border-b">
          <img
            src="lovable-uploads/e4aa6740-d9f0-40d2-a150-efc75ae46692.png"
            alt=""
            className="object-contain h-14 w-40"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <MainNav />
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Barre du haut (Navbar) */}
        <header className="h-16 border-b border-gray-200 bg-white shadow-sm px-4 flex items-center">
          <Navbar />
        </header>

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>

        {/* Menu bas pour mobile */}
        <footer className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-md z-50">
          <MobileNav />
        </footer>
      </div>
    </div>
  );
}
