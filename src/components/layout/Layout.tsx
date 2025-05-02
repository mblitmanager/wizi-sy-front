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
  return (
    <div className="min-h-screen bg-background">
      {token && <Navbar />}
      <div className="flex h-screen pt-16">
        {/* Menu de navigation (caché sur mobile) */}
        {token && (
          <div className="hidden md:block w-64">
            <MainNav />
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col">
          {/* Contenu de la page */}
          <main className="flex-1 overflow-auto pb-16 md:pb-0">
            {children}
          </main>
          
          {/* Navigation mobile en bas */}
          {token && <MobileNav />}
        </div>
      </div>
    </div>
  );
}
