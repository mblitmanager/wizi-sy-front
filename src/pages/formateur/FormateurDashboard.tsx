import React from 'react';
import { Layout } from '@/components/layout/Layout';
import FormateurDashboardStats from '@/components/formateur/FormateurDashboardStats';
import InactiveStagiairesTable from '@/components/formateur/InactiveStagiairesTable';
import FormateurStatsFormations from '@/components/formateur/FormateurStatsFormations';
import FormateurStatsFormateurs from '@/components/formateur/FormateurStatsFormateurs';
import { OnlineStagiairesCard } from '@/components/formateur/OnlineStagiairesCard';
import TrainerPerformanceStats from '@/components/formateur/TrainerPerformanceStats';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

export function FormateurDashboard() {
    return (
        <Layout>
            <div className="min-h-screen bg-[#050505] text-white">
                <motion.div 
                    className="container mx-auto py-10 px-6 space-y-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8">
                        <div>
                            <motion.h1 
                                className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 bg-clip-text text-transparent"
                                variants={itemVariants}
                            >
                                Dashboard Formateur
                            </motion.h1>
                            <motion.p 
                                className="text-gray-400 mt-3 text-lg font-light max-w-2xl"
                                variants={itemVariants}
                            >
                                Pilotez la réussite de vos stagiaires avec une vue d'ensemble élégante et performante.
                            </motion.p>
                        </div>
                        <motion.div variants={itemVariants} className="mt-6 md:mt-0">
                            <div className="bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 text-xs font-medium text-yellow-500 flex items-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                                Monitoring en temps réel
                            </div>
                        </motion.div>
                    </div>

                    {/* Principal Stats Section */}
                    <section>
                        <motion.div variants={itemVariants}>
                            <FormateurDashboardStats />
                        </motion.div>
                    </section>

                    {/* Middle Section: Insights & Online Presence */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
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
                    <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-1">
                        <div className="bg-[#0a0a0a] rounded-[22px] p-8 backdrop-blur-sm">
                            <motion.div className="flex items-center justify-between mb-8" variants={itemVariants}>
                                <div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                        Performance & Classements
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Analyse détaillée des scores et progressions.</p>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <TrainerPerformanceStats />
                            </motion.div>
                        </div>
                    </section>

                    {/* Alerts/Tables Section */}
                    <section className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl">
                        <motion.div variants={itemVariants}>
                            <InactiveStagiairesTable />
                        </motion.div>
                    </section>
                </motion.div>
            </div>
        </Layout>
    );
}

export default FormateurDashboard;
