import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useNavigation } from '@/hooks/useNavigation';
import MainNav from './MainNav';
import { MobileNav } from './MobileNav';
import { Navbar, UserAvatar, getRoleLabel, getUserDisplayName } from './Navbar';
import { useUser } from '@/hooks/useAuth';
import { ParrainageBanner } from '../parrainage/ParrainageBanner';
import { BrandLogos } from './BrandLogos';

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

/** Titre de la page courante, déduit du menu (affiché dans l'en-tête). */
function useCurrentPageTitle(pathname: string): string | null {
    const { items } = useNavigation();
    return useMemo(() => {
        const all = [...items.mainSections.flatMap((s) => s.items), ...items.profile, ...items.help];
        const exact = all.find((item) => item.href === pathname);
        if (exact) return exact.title;
        // Sous-page : on retient l'entrée de menu la plus spécifique qui la contient
        const parent = all
            .filter((item) => item.href !== '/' && pathname.startsWith(`${item.href}/`))
            .sort((a, b) => b.href.length - a.href.length)[0];
        return parent?.title ?? null;
    }, [items, pathname]);
}

/** Bloc utilisateur + déconnexion en pied de sidebar. */
function SidebarFooter() {
    const { user, logout } = useUser();
    if (!user) return null;

    return (
        <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-xl p-2">
                <Link to="/profile" className="flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <UserAvatar user={user} />
                    <span className="min-w-0 leading-tight">
                        <span className="block truncate text-sm font-semibold text-foreground">{getUserDisplayName(user)}</span>
                        <span className="block truncate text-xs text-muted-foreground">{getRoleLabel(user.role)}</span>
                    </span>
                </Link>
                <button
                    onClick={logout}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Déconnexion"
                    title="Déconnexion"
                >
                    <LogOut className="h-[18px] w-[18px]" />
                </button>
            </div>
        </div>
    );
}

/*
 * Breakpoints :
 *   mobile  < 768px   header 14, menu burger, barre de navigation en bas
 *   tablet  768-1023  header 16, menu burger
 *   laptop  1024-1440 sidebar 64
 *   desktop > 1440    sidebar 72
 */
function AppLayout({ children }: LayoutProps) {
    const { token } = useUser();
    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const pageTitle = useCurrentPageTitle(pathname);

    const isQuizPlay = pathname.startsWith('/quiz/') && pathname.includes('start');

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Menu mobile : fermeture au clavier et blocage du scroll de la page
    useEffect(() => {
        if (!isMenuOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMenuOpen(false);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [isMenuOpen]);

    if (!token) return <>{children}</>;

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* ── Sidebar fixe (laptop et plus) ── */}
            <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex min-[1441px]:w-72">
                <Link to="/" className="flex h-16 flex-shrink-0 items-center border-b border-sidebar-border px-5" aria-label="Accueil">
                    <BrandLogos size="h-9" />
                </Link>
                <div className="flex-1 overflow-y-auto">
                    <MainNav />
                </div>
                <SidebarFooter />
            </aside>

            {/* ── Menu coulissant mobile/tablette ── */}
            <div
                className={`fixed inset-0 z-50 lg:hidden ${isMenuOpen ? '' : 'pointer-events-none'}`}
                aria-hidden={!isMenuOpen}
            >
                <div
                    className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-200 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                />
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu"
                    className={`absolute inset-y-0 left-0 flex w-[19rem] max-w-[85vw] flex-col bg-sidebar shadow-2xl transition-transform duration-200 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-sidebar-border px-4">
                        <BrandLogos size="h-8" />
                        <button
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Fermer le menu"
                            tabIndex={isMenuOpen ? 0 : -1}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {isMenuOpen && <MainNav onItemClick={() => setIsMenuOpen(false)} />}
                    </div>
                    {isMenuOpen && <SidebarFooter />}
                </div>
            </div>

            {/* ── Zone droite : header fixe + contenu ── */}
            <div className="flex min-w-0 flex-1 flex-col lg:ml-64 min-[1441px]:ml-72">
                <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card/85 px-3 backdrop-blur-lg supports-[backdrop-filter]:bg-card/75 md:h-16 md:px-4 lg:left-64 lg:px-6 min-[1441px]:left-72 min-[1441px]:px-8">
                    {!isQuizPlay && (
                        <button
                            className="-ml-1 rounded-lg p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Ouvrir le menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    )}
                    <Link to="/" className="flex items-center lg:hidden" aria-label="Accueil">
                        <BrandLogos size="h-7" compact={isMobile} />
                    </Link>
                    {pageTitle && (
                        <h1 className="ml-2 hidden truncate font-poppins text-lg font-semibold text-foreground md:block lg:ml-0">
                            {pageTitle}
                        </h1>
                    )}
                    <div className="ml-auto">
                        <Navbar onMenuToggle={() => setIsMenuOpen(true)} />
                    </div>
                </header>

                {/* Contenu — padding-top = hauteur du header */}
                <main className="flex-1 bg-background pb-20 pt-14 md:pb-0 md:pt-16">
                    {!isQuizPlay && <ParrainageBanner isMobile={isMobile} />}

                    <div className="px-3 py-3 md:px-4 md:py-4 lg:px-6 lg:py-6 min-[1441px]:px-8">
                        <div className="mx-auto min-h-[calc(100vh-8rem)] max-w-[1400px] rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-sm)] animate-in fade-in duration-200 md:p-5 lg:p-6">
                            {children}
                        </div>
                    </div>
                </main>

                {!isQuizPlay && (
                    <footer className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
                        <MobileNav />
                    </footer>
                )}
            </div>
        </div>
    );
}
