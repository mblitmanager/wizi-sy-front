import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import useOnlineStatus from '@/hooks/useOnlineStatus';
// Optimisation du chargement des images avec le composant next/image (public/ path)
import { WifiOff } from 'lucide-react';
import { DownloadCloud } from 'lucide-react';
import OnboardingCarousel from '@/components/landing/OnboardingCarousel';
import HowItWorks from '@/components/landing/HowItWorks';
import CategoriesSection from '@/components/landing/CategoriesSection';

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
};
const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: 'beforeChildren',
        },
    },
};

export default function LandingPage() {
    const isOnline = useOnlineStatus();

    // Onboarding carousel extracted to a dedicated component

    return (
        <Layout>
            <div
                className=""
                style={{
                    background:
                        'linear-gradient(135deg, #eaf2f0 0%, rgba(246,196,84,0.16) 46%, #f7f4eb 100%)',
                }}
            >
                {/* Offline Alert */}
                {!isOnline && (
                    <Alert variant="destructive" className="mb-4 mx-4 mt-4">
                        <WifiOff className="h-4 w-4" />
                        <AlertTitle>Vous êtes hors ligne</AlertTitle>
                        <AlertDescription>
                            Certaines fonctionnalités peuvent être limitées. Les données affichées
                            peuvent ne pas être à jour.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Onboarding / Splash-like Section (extracted component) */}
                <OnboardingCarousel />
                {/* Download / Telechargement Section (preserved) */}
                <section className="border-y border-[#cbded9] bg-[#173f46] px-5 py-10 sm:px-8 lg:px-12">
                    <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center">
                        <div className="flex items-center gap-4 text-white">
                            <div className="rounded-2xl bg-[#f6c454] p-3 text-[#173f46]"><DownloadCloud className="h-7 w-7" /></div>
                            <div>
                                <p className="mb-1 text-xs font-bold tracking-[0.18em] text-[#f6c454]">APPRENDRE PARTOUT</p>
                                <h3 className="text-xl font-bold">Votre formation vous suit partout.</h3>
                                <p className="mt-1 text-sm text-[#d7e8e5]">Disponible sur Android et iOS, même pendant vos déplacements.</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/application/wizi-learn.apk"
                                download
                                className="flex items-center gap-2 rounded-xl bg-[#f6c454] px-4 py-3 text-sm font-bold text-[#173f46] transition hover:bg-[#ffe082]"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 4.75 4.39 9.11 6.13 10.78.37.36.99.36 1.36 0C14.61 18.11 19 13.75 19 9c0-3.87-3.13-7-7-7zm-1 13H7v2h4v-2z" />
                                </svg>
                                Android
                            </a>
                            <a
                                href="https://apps.apple.com/mg/app/wizi-learn/id6752468866"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16.5 1.5C15.12 2.13 14.15 3.5 14 5c1.64.17 3.27-.86 4.03-2.28C17.74 2.1 16.5 1.5 16.5 1.5zM12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                                </svg>
                                iOS
                            </a>
                        </div>
                    </div>
                </section>
                {/* Main landing content - kept as 'main-landing' so we can scroll to it after onboarding */}
                <div id="main-landing">
                    {/* How It Works Section */}
                    <HowItWorks />

                    {/* Categories Section */}
                    <CategoriesSection />
                </div>
            </div>
        </Layout>
    );
}
