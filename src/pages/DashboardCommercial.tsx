import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell, TrendingUp, Users, LayoutDashboard } from 'lucide-react';
import EmailSender from '@/components/EmailSender';
import NotificationSender from '@/components/NotificationSender';
import StatsDashboard from '@/components/StatsDashboard';
import OnlineUsersList from '@/components/OnlineUsersList';
import NotificationHistory from '@/components/NotificationHistory';
import { useUser } from '@/hooks/useAuth';
import { hasCommercialAccess } from '@/utils/rolePermissions';

const DashboardCommercial: React.FC = () => {
    const { user } = useUser();

    // Redirect if no access
    if (!hasCommercialAccess(user?.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
                    <p className="text-gray-600">Vous n'avez pas accès à cette page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white border-b border-orange-200 sticky top-0 z-10 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    Interface Commerciale
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Gestion des communications et statistiques
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-semibold">{user?.name}</span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overview section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                        Vue d'ensemble
                    </h2>
                    <StatsDashboard />
                    <div className="mt-6">
                        <OnlineUsersList />
                    </div>
                </motion.section>

                {/* Communications section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-orange-600" />
                        Communications
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <EmailSender />
                        <NotificationSender />
                    </div>
                </motion.section>

                {/* History section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-600" />
                        Historique
                    </h2>
                    <NotificationHistory />
                </motion.section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-orange-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-gray-600">
                        © 2025 Wizi Learn - Interface Commerciale
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default DashboardCommercial;
