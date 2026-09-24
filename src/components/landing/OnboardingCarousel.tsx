import { useEffect, useRef, useState } from 'react';
import {
    ArrowRight,
    BarChart3,
    BadgeCheck,
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logonsImg from '@/assets/NS.png';
import wiziLogo from '@/assets/logo.png';

const slides = [
    {
        eyebrow: 'APPRENDRE À SON RYTHME',
        title: 'Des compétences qui avancent avec vous.',
        description: 'Des leçons courtes, des quiz utiles et un parcours clair pour transformer chaque moment disponible en progrès concret.',
        image: '/assets/splash1.jpeg',
        icon: BookOpen,
        tag: '01',
    },
    {
        eyebrow: 'MESURER SES PROGRÈS',
        title: 'Voyez vos progrès prendre forme.',
        description: 'Suivez vos résultats, identifiez vos points forts et gardez le cap grâce à des objectifs visibles et motivants.',
        image: '/assets/splash2.jpeg',
        icon: BarChart3,
        tag: '02',
    },
    {
        eyebrow: 'APPRENDRE AVEC CONFIANCE',
        title: 'Un contenu pensé pour réussir.',
        description: 'Des ressources sélectionnées par des experts pour développer des compétences professionnelles durables.',
        image: '/assets/splash3.jpeg',
        icon: BadgeCheck,
        tag: '03',
    },
];

export default function OnboardingCarousel() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [isChanging, setIsChanging] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const slide = slides[current];
    const Icon = slide.icon;

    useEffect(() => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    const finishOnboarding = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        navigate('/login');
    };

    const goTo = (index: number) => {
        if (isChanging || index === current) return;
        setIsChanging(true);
        timeoutRef.current = setTimeout(() => {
            setCurrent(index);
            setIsChanging(false);
        }, 180);
    };

    const goNext = () => {
        if (current === slides.length - 1) finishOnboarding();
        else goTo(current + 1);
    };

    const goPrevious = () => goTo(current === 0 ? slides.length - 1 : current - 1);

    return (
        <section className="landing-hero relative overflow-hidden">
            <style>{`
                .landing-hero { background: radial-gradient(circle at 8% 18%, rgba(246,196,84,.22), transparent 28%), linear-gradient(135deg, #eaf2f0 0%, #f7f4eb 100%); }
                .landing-hero-card { animation: landingCardIn .65s cubic-bezier(.22,1,.36,1) both; }
                @keyframes landingCardIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
                .landing-image { transition: transform .8s cubic-bezier(.22,1,.36,1); }
                .landing-hero-card:hover .landing-image { transform: scale(1.035); }
                @media (max-width: 767px) { .landing-hero-card { grid-template-columns: 1fr !important; } }
                @media (prefers-reduced-motion: reduce) { .landing-hero-card, .landing-image { animation: none; transition: none; } }
            `}</style>

            <header className="relative z-10 border-b border-[#cbded9] bg-[#fbfaf6]/85 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <img src={logonsImg} alt="NS Conseil" className="h-9 w-auto sm:h-10" />
                        <span className="h-8 w-px bg-[#cbded9]" />
                        <img src={wiziLogo} alt="Wizi Learn" className="h-9 w-auto sm:h-9" />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8587] sm:block">Plateforme de formation</span>
                        <button onClick={finishOnboarding} className="text-sm font-semibold text-[#173f46] transition hover:text-[#b47700]">Passer</button>
                    </div>
                </div>
            </header>

            <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pb-24 lg:pt-20">
                <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#b47700]">VOTRE PARCOURS COMMENCE ICI</p>
                        <p className="max-w-xl text-sm leading-6 text-[#526b70] sm:text-base">Une expérience d’apprentissage simple, concrète et conçue pour vous faire progresser.</p>
                    </div>
                    <div className="hidden items-center gap-2 text-sm font-semibold text-[#173f46] sm:flex"><GraduationCap className="h-5 w-5 text-[#d18a00]" /> Apprendre autrement</div>
                </div>

                <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#d5e4e0]">
                    <div className="h-full rounded-full bg-[#173f46] transition-all duration-500" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
                </div>

                <div className="landing-hero-card grid min-h-[520px] overflow-hidden rounded-[2rem] border border-[#cbded9] bg-[#fbfaf6] shadow-[0_28px_70px_rgba(23,63,70,.16)] md:grid-cols-[1.12fr_.88fr]">
                    <div className="relative min-h-[300px] overflow-hidden bg-[#dceae6] md:min-h-0">
                        <img src={slide.image} alt={slide.title} className="landing-image absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#173f46]/75 via-transparent to-transparent" />
                        <div className="absolute left-5 top-5 rounded-lg bg-[#fbfaf6]/90 px-3 py-2 text-xs font-bold tracking-[0.16em] text-[#173f46]">{slide.tag} / 03</div>
                        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white sm:bottom-8 sm:left-8 sm:right-8">
                            <div><p className="mb-1 text-xs font-bold tracking-[0.18em] text-[#f6c454]">WIZI LEARN</p><p className="text-sm font-medium text-white/90">Développez vos compétences professionnelles.</p></div>
                            <div className="hidden rounded-xl border border-white/25 bg-white/10 p-3 backdrop-blur-sm sm:block"><CheckCircle2 className="h-6 w-6 text-[#f6c454]" /></div>
                        </div>
                    </div>

                    <div className={`flex flex-col justify-between px-7 py-9 transition-opacity duration-200 sm:px-10 sm:py-12 lg:px-14 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
                        <div>
                            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1d2] text-[#d18a00]"><Icon className="h-7 w-7" strokeWidth={1.8} /></div>
                            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#b47700]">{slide.eyebrow}</p>
                            <h1 className="max-w-lg font-poppins text-3xl font-semibold leading-tight text-[#173f46] sm:text-4xl lg:text-[2.75rem]">{slide.title}</h1>
                            <p className="mt-5 max-w-lg text-base leading-7 text-[#526b70]">{slide.description}</p>
                        </div>
                        <div className="mt-10 flex flex-wrap items-center gap-3">
                            <button onClick={goNext} className="inline-flex h-12 items-center gap-3 rounded-xl bg-[#173f46] px-5 text-sm font-bold text-white shadow-lg shadow-[#173f46]/20 transition hover:bg-[#245963]">{current === slides.length - 1 ? 'Accéder à la plateforme' : 'Découvrir le parcours'}<ArrowRight className="h-4 w-4" /></button>
                            {current < slides.length - 1 && <button onClick={finishOnboarding} className="h-12 rounded-xl border border-[#e8c978] px-5 text-sm font-semibold text-[#b47700] transition hover:bg-[#fff4dc]">Se connecter</button>}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <div className="flex gap-2"><button onClick={goPrevious} aria-label="Étape précédente" className="rounded-full border border-[#cbded9] bg-[#fbfaf6] p-2 text-[#173f46] transition hover:bg-[#fff4dc]"><ChevronLeft className="h-4 w-4" /></button><button onClick={goNext} aria-label="Étape suivante" className="rounded-full border border-[#cbded9] bg-[#fbfaf6] p-2 text-[#173f46] transition hover:bg-[#fff4dc]"><ChevronRight className="h-4 w-4" /></button></div>
                </div>
            </div>
        </section>
    );
}
