import { ReactNode, useState } from 'react';
import MainNav from './MainNav';
import { MobileNav } from './MobileNav';
import { Navbar } from './Navbar';
import { useUser } from '@/hooks/useAuth';
const logo = '/assets/logo.png';
import { Menu, X, LogOut } from 'lucide-react';
import { useMediaQuery } from '@mui/system';
import { ParrainageBanner } from '../parrainage/ParrainageBanner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { token, logout } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
    const isLaptop = useMediaQuery('(min-width: 1025px) and (max-width: 1440px)');
    const isDesktop = useMediaQuery('(min-width: 1441px)');

    const isQuizPlay =
        window.location.pathname.startsWith('/quiz/') && window.location.pathname.includes('start');

    if (!token) return <>{children}</>;

    return (
        <div className="min-h-screen flex bg-background text-gray-900">
            {/* ── Sidebar fixe ── */}
            <aside
                className={`
                    hidden
                    ${isLaptop || isDesktop ? 'lg:flex' : 'lg:hidden'}
                    flex-col
                    ${isLaptop ? 'w-60' : 'w-64'}
                    fixed top-0 left-0 h-screen          /* ← fixe, pleine hauteur */
                    border-r border-gray-200 bg-white shadow-sm
                    z-30
                `}
            >
                <Link
                    to="/"
                    className="flex items-center justify-center border-b p-4 flex-shrink-0"
                >
                    <img
                        src={logo}
                        alt="Logo"
                        className={`object-contain ${isLaptop ? 'h-12 w-32' : 'h-14 w-40'} transition-all duration-300`}
                    />
                </Link>
                <Button
                    onClick={logout}
                    className="text-orange-600 hover:bg-orange-50 mx-4 mt-2 bg-transparent"
                >
                    <span>Déconnexion</span>
                    <LogOut className="mr-2 h-4 w-4" />
                </Button>
                <div className="flex-1 overflow-y-auto">
                    <MainNav />
                </div>
            </aside>

            {/* ── Overlay menu mobile/tablette ── */}
            {(isMobile || isTablet) && isMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/25"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl z-50">
                        <div className="flex items-center justify-between p-4 border-b">
                            <img src={logo} alt="Logo" className="object-contain h-10" />
                            <Button
                                onClick={logout}
                                className="text-orange-600 hover:bg-orange-50 bg-transparent"
                            >
                                <span>Déconnexion</span>
                                <LogOut className="mr-2 h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-4 overflow-y-auto h-full">
                            <MainNav onItemClick={() => setIsMenuOpen(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Zone droite : header fixe + contenu scrollable ── */}
            <div
                className={`
                    flex flex-col flex-1 min-w-0
                    ${isLaptop ? 'lg:ml-60' : ''}
                    ${isDesktop ? 'lg:ml-64' : ''}
                `}
            >
                {/* Header fixe */}
                <header
                    className={`
                        fixed top-0 right-0 z-20
                        ${isLaptop ? 'left-60' : ''}
                        ${isDesktop ? 'left-64' : ''}
                        ${!isLaptop && !isDesktop ? 'left-0' : ''}
                        border-b border-gray-200 bg-white shadow-sm
                        flex items-center flex-shrink-0 justify-between
                        ${isMobile ? 'h-12 px-3' : ''}
                        ${isTablet ? 'h-14 px-4' : ''}
                        ${isLaptop || isDesktop ? 'h-16 px-6' : ''}
                        transition-all duration-300
                    `}
                >
                    {(isMobile || isTablet) && !isQuizPlay && (
                        <button
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Ouvrir le menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    )}
                    <div
                        className={`flex-1 flex ${isMobile ? 'justify-center' : 'justify-start'} ${isTablet ? 'ml-2' : ''}`}
                    >
                        <Navbar onMenuToggle={() => setIsMenuOpen(true)} />
                    </div>
                </header>

                {/* Contenu scrollable — padding-top = hauteur du header */}
                <main
                    className={`
                        flex-1 overflow-y-auto bg-slate-100
                        ${isMobile ? 'pt-12 pb-16' : ''}
                        ${isTablet ? 'pt-14' : ''}
                        ${isLaptop || isDesktop ? 'pt-16' : ''}
                    `}
                >
                    {!isQuizPlay &&
                        (isMobile ? <ParrainageBanner isMobile={true} /> : <ParrainageBanner />)}

                    <div
                        className={`
                            ${isMobile ? 'px-3 py-2' : ''}
                            ${isTablet ? 'px-4 py-3' : ''}
                            ${isLaptop ? 'px-6 py-4' : ''}
                            ${isDesktop ? 'px-8 py-6' : ''}
                        `}
                    >
                        <div
                            className={`
                                bg-white rounded-lg shadow-sm min-h-[calc(100vh-200px)]
                                ${isMobile ? 'p-3' : ''}
                                ${isTablet ? 'p-4' : ''}
                                ${isLaptop ? 'p-5' : ''}
                                ${isDesktop ? 'p-6' : ''}
                            `}
                        >
                            {children}
                        </div>
                    </div>
                </main>

                {/* Footer mobile fixe */}
                {!isQuizPlay && isMobile && (
                    <footer className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-md z-50">
                        <MobileNav />
                    </footer>
                )}
            </div>
        </div>
    );
}
