import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from '@/components/statistics/StatCard';
import { BarChart } from '@/components/statistics/BarChart';
import {
    Users,
    TrendingUp,
    Award,
    BarChart3,
    UserPlus,
    MessageSquare,
    Settings,
} from 'lucide-react';
import './CommercialDashboard.css';

import { commercialService, CommercialDashboardStats } from '@/services/commercial/CommercialService';
import { Loader2 } from 'lucide-react';

export const CommercialDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState<CommercialDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await commercialService.getDashboardStats();
                setStats(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching commercial stats:', err);
                setError('Erreur lors du chargement des données. Veuillez réessayer.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#f7931e]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-[#f7931e] text-white rounded-md"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    const { summary, recentSignups, topFormations, signupTrends } = stats!;

    return (
        <div className="commercial-dashboard">
            <header className="dashboard-header">
                <h1>Dashboard Commercial</h1>
                <p className="subtitle">Vue d'ensemble des performances</p>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="dashboard-tabs">
                <TabsList className="tabs-list">
                    <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                    <TabsTrigger value="individual">Individuel</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="tab-content">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <StatCard
                            title="Inscriptions Totales"
                            value={summary.totalSignups}
                            icon={<Users />}
                            color="#ff6b35"
                        />
                        <StatCard
                            title="Ce Mois"
                            value={summary.signupsThisMonth}
                            icon={<UserPlus />}
                            color="#10b981"
                        />
                        <StatCard
                            title="Taux de Conversion"
                            value={`${summary.conversionRate}%`}
                            icon={<TrendingUp />}
                            color="#f7931e"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="charts-row">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Inscriptions (30j)</h3>
                                <p className="chart-subtitle">Évolution quotidienne</p>
                            </div>
                            <BarChart
                                data={signupTrends}
                                dataKey="value"
                                xAxisKey="date"
                                color="#4ecdc4"
                                height={250}
                            />
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Top Formations</h3>
                                <p className="chart-subtitle">Par nombre d'inscriptions</p>
                            </div>
                            <div className="top-formations-list">
                                {topFormations.map((formation, index) => (
                                    <div key={index} className="formation-item">
                                        <div className="formation-info">
                                            <span className="formation-name">{formation.name}</span>
                                            <span className="formation-price">{formation.price > 0 ? `${formation.price}€` : 'Gratuit'}</span>
                                        </div>
                                        <div className="formation-meter">
                                            <div 
                                                className="meter-fill" 
                                                style={{ width: `${(formation.enrollments / topFormations[0].enrollments) * 100}%` }}
                                            />
                                            <span className="meter-value">{formation.enrollments} s.</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="actions-grid">
                            <button className="action-card">
                                <UserPlus className="action-icon" />
                                <span>View All Trainees</span>
                                <span className="action-arrow">→</span>
                            </button>
                            <button className="action-card">
                                <BarChart3 className="action-icon" />
                                <span>Manage Formations</span>
                                <span className="action-arrow">→</span>
                            </button>
                            <button className="action-card">
                                <MessageSquare className="action-icon" />
                                <span>Send Broadcast Message</span>
                                <span className="action-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </TabsContent>

                 <TabsContent value="engagement" className="tab-content">
                    <div className="engagement-overview">
                        <div className="chart-card full-width">
                            <h3>Engagement des Stagiaires</h3>
                            <BarChart
                                data={signupTrends} // Fallback or dedicated metric
                                dataKey="value"
                                xAxisKey="date"
                                color="#f7931e"
                                height={300}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="individual" className="tab-content">
                    <div className="trainees-table-card">
                        <div className="card-header">
                            <h3>Inscriptions Récentes</h3>
                            <div className="header-actions">
                                <button className="btn-secondary">Exporter</button>
                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table className="trainees-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Email</th>
                                        <th>Rôle</th>
                                        <th>Date d'inscription</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSignups.map((user) => (
                                        <tr key={user.id}>
                                            <td className="font-medium">{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button className="text-[#f7931e] hover:underline">Détails</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
