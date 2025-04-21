import { ReactNode } from "react";
import MainNav from "./MainNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Menu de navigation (caché sur mobile) */}
        <div className="hidden md:block w-64">
          <MainNav />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col">
          {/* En-tête avec menu mobile */}
          <header className="h-16 border-b bg-background flex items-center px-4 md:px-6">
            <MainNav />
          </header>

          {/* Contenu de la page */}
          <main className="flex-1 overflow-auto pb-16 md:pb-0">
            {children}
          </main>
          
          {/* Navigation mobile en bas */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
            <div className="flex justify-around items-center h-16">
              <MainNav />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
