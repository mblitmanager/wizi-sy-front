import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MainNav from './MainNav';
import { MobileNav } from './MobileNav';
import { Navbar } from './Navbar';
import { useUser } from '@/hooks/useAuth';
import { ParrainageBanner } from '../parrainage/ParrainageBanner';
import { Button } from '@/components/ui/button';

const logo = '/assets/logo.png';

/**
 * Vrai quand un Layout est déjà monté plus haut dans l'arbre (route "shell").
 * Les pages qui s'enveloppent encore dans <Layout> ne dupliquent alors pas le cadre,
 * et la sidebar reste en place pendant les navigations.
 */
const LayoutMountedContext = createContext(false);

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const alreadyMounted = useContext(LayoutMountedContext);
    if (alreadyMounted) return <>{children}</>;
    return (
        <LayoutMountedContext.Provider value={true}>
            <AppLayout>{children}</AppLayout>
        </LayoutMountedContext.Provider>
    );
}

/*
 * Breakpoints :
 *   mobile  < 768px   header 12, menu burger, barre de navigation en bas
 *   tablet  768-1023  header 14, menu burger
 *   laptop  1024-1440 sidebar 60
 *   desktop > 1440    sidebar 64
 */
function AppLayout({ children }: LayoutProps) {
    const { token, logout } = useUser();
    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 767px)');

    const isQuizPlay = pathname.startsWith('/quiz/') && pathname.includes('start');

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    if (!token) return <>{children}</>;

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* ── Sidebar fixe (laptop et plus) ── */}
            <aside className="hidden lg:flex flex-col w-60 min-[1441px]:w-64 fixed top-0 left-0 h-screen border-r border-sidebar-border bg-sidebar shadow-[8px_0_30px_rgba(23,63,70,0.06)] z-30">
                <Link to="/" className="flex items-center justify-center border-b border-sidebar-border p-4 flex-shrink-0">
                    <img
                        src={logo}
                        alt="Logo"
                        className="object-contain h-12 w-32 min-[1441px]:h-14 min-[1441px]:w-40"
                    />
                </Link>
                <Button onClick={logout} className="mx-4 mt-3 justify-between rounded-xl bg-transparent text-[#b47700] hover:bg-[#fff4d8]">
                    <span>Déconnexion</span>
                    <LogOut className="mr-2 h-4 w-4" />
                </Button>
                <div className="flex-1 overflow-y-auto">
                    <MainNav />
                </div>
            </aside>

            {/* ── Menu coulissant mobile/tablette ── */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/25" onClick={() => setIsMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-full flex-col bg-sidebar shadow-xl">
                        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
                            <img src={logo} alt="Logo" className="object-contain h-10" />
                            <div className="flex items-center gap-1">
                                <Button onClick={logout} className="bg-transparent text-[#b47700] hover:bg-[#fff4d8]">
                                    <span>Déconnexion</span>
                                    <LogOut className="mr-2 h-4 w-4" />
                                </Button>
                                <button
                                    className="rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent"
                                    onClick={() => setIsMenuOpen(false)}
                                    aria-label="Fermer le menu"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            <MainNav onItemClick={() => setIsMenuOpen(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Zone droite : header fixe + contenu ── */}
            <div className="flex flex-col flex-1 min-w-0 lg:ml-60 min-[1441px]:ml-64">
                <header className="fixed top-0 right-0 left-0 lg:left-60 min-[1441px]:left-64 z-30 flex h-12 items-center justify-between border-b border-border bg-card/95 px-3 shadow-sm backdrop-blur-md transition-all duration-300 md:h-14 md:px-4 lg:h-16 lg:px-6">
                    {!isQuizPlay && (
                        <button
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Ouvrir le menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    )}
                    <div className="flex-1 flex justify-center md:justify-start md:ml-2 lg:ml-0">
                        <Navbar onMenuToggle={() => setIsMenuOpen(true)} />
                    </div>
                </header>

                {/* Contenu — padding-top = hauteur du header */}
                <main className="flex-1 overflow-y-auto bg-background pt-12 pb-16 md:pt-14 md:pb-0 lg:pt-16">
                    {!isQuizPlay && <ParrainageBanner isMobile={isMobile} />}

                    <div className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 min-[1441px]:px-8 min-[1441px]:py-6">
                        <div className="min-h-[calc(100vh-200px)] rounded-2xl border border-border bg-card p-3 shadow-sm md:p-4 lg:p-5 min-[1441px]:p-6">
                            {children}
                        </div>
                    </div>
                </main>

                {!isQuizPlay && (
                    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 shadow-[0_-8px_24px_rgba(23,63,70,0.1)] backdrop-blur-md md:hidden">
                        <MobileNav />
                    </footer>
                )}
            </div>
        </div>
    );
}
