import React, { useEffect, useState, useRef } from 'react';
import { School, BarChart2, BadgeCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const splash1 = '/assets/splash1.jpeg';
const splash2 = '/assets/splash2.jpeg';
const splash3 = '/assets/splash3.jpeg';
import logonsImg from '@/assets/NS.png';
import wiziLogo from '@/assets/logo.png';

const slides = [
    {
        title: 'Apprentissage Mobile',
        description:
            'Accédez à des leçons courtes et efficaces où que vous soyez. Optimisez votre temps libre pour développer vos compétences.',
        image: splash1,
        icon: School,
        accent: '#F97316',
        tag: '01',
    },
    {
        title: 'Suivi de Progrès',
        description:
            'Visualisez votre évolution avec des statistiques détaillées et des récompenses motivantes pour maintenir votre engagement.',
        image: splash2,
        icon: BarChart2,
        accent: '#F97316',
        tag: '02',
    },
    {
        title: 'Contenu Expert',
        description:
            'Bénéficiez de contenus créés par des experts pour maximiser votre apprentissage et atteindre vos objectifs rapidement.',
        image: splash3,
        icon: BadgeCheck,
        accent: '#F97316',
        tag: '03',
    },
];

export default function OnboardingCarousel() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState('next');
    const [visible, setVisible] = useState(true);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const seen = localStorage.getItem('hasSeenOnboarding');
        if (seen === 'true') return;
    }, []);

    const goTo = (idx, dir = 'next') => {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        setVisible(false);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setCurrent(idx);
            setVisible(true);
            setAnimating(false);
        }, 260);
    };

    const goNext = () => {
        if (current < slides.length - 1) goTo(current + 1, 'next');
        else finishOnboarding();
    };

    const finishOnboarding = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        try {
            navigate('/login');
        } catch (_) {
            window.location.href = '/login';
        }
    };

    const slide = slides[current];
    const Icon = slide.icon;
    const isLast = current === slides.length - 1;

    return (
        <div
            style={{
                minHeight: '100dvh',
                background: '#FAFAF8',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Instrument Sans', 'DM Sans', system-ui, sans-serif",
            }}
        >
            {/* Google Font */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

        .onb-slide-enter {
          animation: slideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .onb-slide-exit {
          animation: slideOut 0.26s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-10px); }
        }
        .onb-img-zoom {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .onb-img-zoom:hover { transform: scale(1.03); }
        .onb-next-btn {
          transition: background 0.18s, transform 0.15s;
        }
        .onb-next-btn:hover { background: #1a1a1a !important; }
        .onb-next-btn:active { transform: scale(0.97); }
        .onb-login-btn {
          transition: background 0.18s, color 0.18s;
        }
        .onb-login-btn:hover { background: #FFF0E6 !important; }
        .onb-dot {
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s;
        }
        .onb-step {
          transition: opacity 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .onb-step:hover { opacity: 0.7; }
      `}</style>

            {/* Header */}
            <header
                style={{
                    padding: '20px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(0,0,0,0.10)',
                    background: '#fff',
                    boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
                    flexShrink: 0,
                    zIndex: 10,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <img
                        src={logonsImg}
                        alt="NS Conseil"
                        style={{ height: 36, width: 'auto', opacity: 0.92 }}
                    />
                    <div style={{ width: 1, height: 28, background: 'rgba(0,0,0,0.12)' }} />
                    <img src={wiziLogo} alt="Wizi Learn" style={{ height: 28, width: 'auto' }} />
                </div>

                <button
                    onClick={finishOnboarding}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: '#999',
                        fontFamily: 'inherit',
                        letterSpacing: '0.02em',
                        padding: '6px 0',
                    }}
                >
                    Passer
                </button>
            </header>

            {/* Main */}
            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                }}
            >
                <div style={{ width: '100%', maxWidth: 860 }}>
                    {/* Progress line */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                className="onb-step"
                                onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                                style={{
                                    flex: 1,
                                    height: 3,
                                    background: i <= current ? '#111' : '#E0DDD6',
                                    border: 'none',
                                    padding: 0,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                }}
                                aria-label={`Aller à l'étape ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Card */}
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 20,
                            border: '1px solid rgba(0,0,0,0.07)',
                            overflow: 'hidden',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            minHeight: 420,
                        }}
                    >
                        {/* Left — Image */}
                        <div
                            style={{
                                position: 'relative',
                                overflow: 'hidden',
                                background: '#F0EDE6',
                            }}
                        >
                            <div
                                className={visible ? 'onb-slide-enter' : 'onb-slide-exit'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    inset: 0,
                                }}
                            >
                                <img
                                    className="onb-img-zoom"
                                    src={slide.image}
                                    alt={slide.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            </div>

                            {/* Tag number overlay */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 20,
                                    left: 20,
                                    background: 'rgba(255,255,255,0.92)',
                                    backdropFilter: 'blur(8px)',
                                    borderRadius: 8,
                                    padding: '6px 12px',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    letterSpacing: '0.12em',
                                    color: '#111',
                                }}
                            >
                                {slide.tag} / {String(slides.length).padStart(2, '0')}
                            </div>
                        </div>

                        {/* Right — Content */}
                        <div
                            style={{
                                padding: '48px 44px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div className={visible ? 'onb-slide-enter' : 'onb-slide-exit'}>
                                {/* Icon */}
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: '#FFF4EC',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 28,
                                    }}
                                >
                                    <Icon size={22} color="#F97316" strokeWidth={1.8} />
                                </div>

                                {/* Title */}
                                <h2
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 600,
                                        color: '#111',
                                        margin: '0 0 14px',
                                        lineHeight: 1.2,
                                        fontFamily: "'Instrument Serif', Georgia, serif",
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {slide.title}
                                </h2>

                                {/* Description */}
                                <p
                                    style={{
                                        fontSize: 15,
                                        color: '#6B6860',
                                        lineHeight: 1.65,
                                        margin: 0,
                                    }}
                                >
                                    {slide.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div style={{ marginTop: 40 }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <button
                                        className="onb-next-btn"
                                        onClick={goNext}
                                        style={{
                                            background: '#111',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 10,
                                            padding: '13px 24px',
                                            fontSize: 14,
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            letterSpacing: '0.01em',
                                        }}
                                    >
                                        {isLast ? 'Se connecter' : 'Continuer'}
                                        <ArrowRight size={16} strokeWidth={2} />
                                    </button>

                                    {!isLast && (
                                        <button
                                            className="onb-login-btn"
                                            onClick={finishOnboarding}
                                            style={{
                                                background: 'transparent',
                                                color: '#F97316',
                                                border: '1.5px solid #FDDCBE',
                                                borderRadius: 10,
                                                padding: '12px 20px',
                                                fontSize: 14,
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                fontFamily: 'inherit',
                                                letterSpacing: '0.01em',
                                            }}
                                        >
                                            Se connecter
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div
                        style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}
                    >
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                className="onb-dot"
                                onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                                style={{
                                    width: i === current ? 24 : 8,
                                    height: 8,
                                    borderRadius: 4,
                                    background: i === current ? '#111' : '#D5D2CB',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                }}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
