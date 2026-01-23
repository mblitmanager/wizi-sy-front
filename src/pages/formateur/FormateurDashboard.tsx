import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import FormateurDashboardStats from '@/components/formateur/FormateurDashboardStats';
import InactiveStagiairesTable from '@/components/formateur/InactiveStagiairesTable';
import FormateurStatsFormations from '@/components/formateur/FormateurStatsFormations';
import FormateurStatsFormateurs from '@/components/formateur/FormateurStatsFormateurs';
import { OnlineStagiairesCard } from '@/components/formateur/OnlineStagiairesCard';
import TrainerPerformanceStats from '@/components/formateur/TrainerPerformanceStats';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5 }
    }
};

export function FormateurDashboard() {
    useEffect(() => {
        // Set page title for SEO/UX
        document.title = "Dashboard Formateur | Wizi Learn";
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-brand-background text-slate-900 selection:bg-brand-primary/20">
                <motion.div 
                    className="container mx-auto py-12 px-6 lg:px-8 space-y-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200/60 pb-10 relative">
                        <div className="space-y-4">
                            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 shadow-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
                                <span className="text-[10px] font-black text-brand-primary-dark uppercase tracking-widest leading-none">Perspective Formateur</span>
                            </motion.div>
                            
                            <motion.h1 
                                className="text-4xl md:text-5xl font-black tracking-tight text-slate-900"
                                variants={itemVariants}
                            >
                                Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary-dark to-brand-primary">Analytique</span>
                            </motion.h1>
                            
                            <motion.p 
                                className="text-slate-500 mt-2 text-lg font-medium max-w-2xl leading-relaxed"
                                variants={itemVariants}
                            >
                                Supervisez l'engagement et l'excellence académique de vos cohortes en un coup d'œil.
                            </motion.p>
                        </div>

                        {/* <motion.div variants={itemVariants} className="mt-8 md:mt-0">
                            <div className="bg-white rounded-2xl p-4 shadow-xl shadow-brand-primary/5 border border-slate-100 flex items-center gap-4 transition-transform hover:scale-105 duration-300">
                                <div className="p-3 bg-brand-primary/10 rounded-xl">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary-accent opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Système Actif</p>
                                    <p className="text-xs font-bold text-slate-700">Flux de données synchronisé</p>
                                </div>
                            </div>
                        </motion.div> */}
                    </div>

                    {/* Principal Stats Section */}
                    <section className="relative">
                        <motion.div variants={itemVariants} className="relative z-10">
                            <FormateurDashboardStats />
                        </motion.div>
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -z-0 pointer-events-none" />
                    </section>

                    {/* Middle Section: Insights & Online Presence */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
                        <motion.div className="lg:col-span-4" variants={itemVariants}>
                            <OnlineStagiairesCard />
                        </motion.div>
                        <motion.div className="lg:col-span-4" variants={itemVariants}>
                            <FormateurStatsFormations />
                        </motion.div>
                        <motion.div className="lg:col-span-4" variants={itemVariants}>
                            <FormateurStatsFormateurs />
                        </motion.div>
                    </div>

                    {/* Performance Section */}
                    <section className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary-accent/30 to-brand-primary/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-brand-primary/5 border border-slate-100 space-y-10">
                            <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-4" variants={itemVariants}>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                        Performance & <span className="text-brand-primary-dark">Engagement</span>
                                    </h2>
                                    <p className="text-slate-500 font-medium mt-2">Corrélation entre temps de connexion et réussite aux examens.</p>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <TrainerPerformanceStats />
                            </motion.div>
                        </div>
                    </section>

                    {/* Alerts/Tables Section */}
                    <section className="relative">
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <div className="h-64 w-64 bg-slate-900 rounded-full blur-3xl" />
                            </div>
                            <div className="relative z-10">
                                <InactiveStagiairesTable />
                            </div>
                        </motion.div>
                    </section>
                </motion.div>
            </div>
        </Layout>
    );
}

export default FormateurDashboard;
