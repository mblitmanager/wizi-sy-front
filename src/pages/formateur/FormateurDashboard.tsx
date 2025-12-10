import React from 'react';
import { Layout } from '@/components/layout/Layout';
import FormateurDashboardStats from '@/components/formateur/FormateurDashboardStats';
import InactiveStagiairesTable from '@/components/formateur/InactiveStagiairesTable';

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

                {/* Alertes Stagiaires Inactifs */}
                <div className="mt-8">
                    <InactiveStagiairesTable />
                </div>
            </div>
        </Layout>
    );
}

export default FormateurDashboard;
