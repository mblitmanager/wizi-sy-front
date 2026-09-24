import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useAuth';

const slideUp = {
    hidden: { y: 18, opacity: 0 },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
    }),
};

const items = [
    {
        step: '01',
        title: 'Choisissez un quiz',
        description:
            'Sélectionnez parmi nos quiz disponibles, adaptés à votre formation et à votre niveau.',
        accent: 'orange',
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        step: '02',
        title: 'Testez vos connaissances',
        description:
            'Répondez aux questions dans différents formats : QCM, vrai/faux, remplir les blancs et plus encore.',
        accent: 'indigo',
        icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
        step: '03',
        title: 'Suivez votre progression',
        description:
            'Consultez vos statistiques, comparez vos performances et remportez des défis pour gagner des points.',
        accent: 'green',
        icon: <TrendingUp className="h-5 w-5" />,
    },
];

const accentMap: Record<string, { icon: string; step: string; bg: string }> = {
    orange: {
        icon: 'text-orange-500 bg-orange-500/10',
        step: 'text-orange-500',
        bg: 'hover:bg-orange-500/5',
    },
    indigo: {
        icon: 'text-indigo-500 bg-indigo-500/10',
        step: 'text-indigo-500',
        bg: 'hover:bg-indigo-500/5',
    },
    green: {
        icon: 'text-green-600 bg-green-500/10',
        step: 'text-green-600',
        bg: 'hover:bg-green-500/5',
    },
};

export function HowItWorks() {
    const { user } = useUser();
    const target = user ? '/quiz' : '/login';

    return (
        <section className="border-b border-[#d3e2de] bg-[#f7f4eb] py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                    <motion.p
                        className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#b47700]"
                        variants={slideUp}
                        custom={0}
                    >
                        Fonctionnement
                    </motion.p>
                    <motion.h2
                        className="mb-4 font-poppins text-3xl font-semibold text-[#173f46] md:text-4xl"
                        variants={slideUp}
                        custom={1}
                    >
                        Comment ça marche
                    </motion.h2>
                    <motion.p
                        className="mx-auto max-w-lg text-base leading-relaxed text-[#526b70]"
                        variants={slideUp}
                        custom={2}
                    >
                        Une approche simple et efficace pour améliorer vos compétences grâce à notre
                        plateforme de quiz.
                    </motion.p>
                </motion.div>

                {/* Cards — equal height via grid + flex */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {items.map((item, index) => {
                        const a = accentMap[item.accent];
                        return (
                            <Link
                                key={index}
                                to={target}
                                className="block h-full"
                                aria-label={item.title}
                            >
                                <motion.div
                                    className={`h-full flex flex-col border border-[#d3e2de] rounded-2xl p-8 bg-[#fbfaf6]/90 shadow-sm transition-all duration-250 cursor-pointer ${a.bg}`}
                                    initial="hidden"
                                    animate="visible"
                                    variants={slideUp}
                                    custom={index + 1}
                                    whileHover={{ y: -4 }}
                                >
                                    {/* Icon */}
                                    <div
                                        className={`w-11 h-11 rounded-lg flex items-center justify-center mb-6 ${a.icon}`}
                                    >
                                        {item.icon}
                                    </div>

                                    {/* Step label */}
                                    <p
                                        className={`text-[11px] font-medium tracking-widest uppercase mb-1.5 ${a.step}`}
                                    >
                                        Étape {item.step}
                                    </p>

                                    {/* Title */}
                                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                                        {item.title}
                                    </h3>

                                    {/* Description — pushes to fill remaining height */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                                        {item.description}
                                    </p>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
