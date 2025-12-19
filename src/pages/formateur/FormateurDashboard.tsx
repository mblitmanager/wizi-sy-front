import React from 'react';
import { Layout } from '@/components/layout/Layout';
import FormateurDashboardStats from '@/components/formateur/FormateurDashboardStats';
import InactiveStagiairesTable from '@/components/formateur/InactiveStagiairesTable';
import FormateurStatsFormations from '@/components/formateur/FormateurStatsFormations';
import FormateurStatsFormateurs from '@/components/formateur/FormateurStatsFormateurs';
import OnlineStagiairesCard from '@/components/formateur/OnlineStagiairesCard';
import TrainerPerformanceStats from '@/components/formateur/TrainerPerformanceStats';

export function FormateurDashboard() {
    return (
        <Layout>
            <div className="container mx-auto py-6 px-4 space-y-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard Formateur
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Suivez la progression de vos stagiaires
                    </p>
                </div>

                {/* Stats Cards */}
                <FormateurDashboardStats />

                {/* Stagiaires en ligne + Stats par Formation/Formateurs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    <OnlineStagiairesCard />
                    <FormateurStatsFormations />
                    <FormateurStatsFormateurs />
                </div>

                {/* Performance et Classements Personnalisés */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Performance & Classements
                    </h2>
                    <TrainerPerformanceStats />
                </div>

                {/* Alertes Stagiaires Inactifs */}
                <div className="mt-8">
                    <InactiveStagiairesTable />
                </div>
            </div>
        </Layout>
    );
}

export default FormateurDashboard;
