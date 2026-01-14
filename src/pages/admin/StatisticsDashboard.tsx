import React, { useState, useEffect } from 'react';
import { StatCard } from '@/components/statistics/StatCard';
import { LineChart } from '@/components/statistics/LineChart';
import { BarChart } from '@/components/statistics/BarChart';
import { StatisticsService } from '@/services/statistics/StatisticsService';
import { Users, BookOpen, Award, TrendingUp, Download, RefreshCw } from 'lucide-react';
import './StatisticsDashboard.css';

export const StatisticsDashboard = () => {
    const [period, setPeriod] = useState('30d');
    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboard();
    }, [period]);

    const loadDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await StatisticsService.getAdminDashboard(period);
            setDashboard(data);
        } catch (err: any) {
            console.error('Failed to load dashboard:', err);
            setError(err.response?.data?.message || 'Erreur lors du chargement des statistiques');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPdf = async () => {
        try {
            const { data } = await StatisticsService.exportPdf({ period });
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `statistiques-${period}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export PDF failed:', err);
            alert('Erreur lors de l\'export PDF');
        }
    };

    if (loading) {
        return (
            <div className="statistics-dashboard">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="statistics-dashboard">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={loadDashboard} className="retry-button">
                        <RefreshCw size={18} />
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboard) return null;

    const summary = dashboard.summary || {};
    const activeStudents = summary.activeStudents ?? 0;
    const totalStudents = summary.totalStudents ?? 0;
    const totalFormations = summary.totalFormations ?? 0;
    const avgCompletionRaw = summary.averageCompletionRate;
    const avgCompletion = (avgCompletionRaw != null && !isNaN(Number(avgCompletionRaw))) ? Number(avgCompletionRaw).toFixed(1) : '0';

    const quizOverview = dashboard.quizOverview || {};
    const quizTotal = quizOverview.totalQuizzes ?? 0;
    const quizAvgRaw = quizOverview.averageScore;
    const quizAvg = (quizAvgRaw != null && !isNaN(Number(quizAvgRaw))) ? Number(quizAvgRaw).toFixed(1) : '0';
    const quizSuccessRaw = quizOverview.successRate;
    const quizSuccess = (quizSuccessRaw != null && !isNaN(Number(quizSuccessRaw))) ? Number(quizSuccessRaw).toFixed(1) : '0';

    return (
        <div className="statistics-dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Tableau de Bord Statistiques</h1>
                    <p className="dashboard-subtitle">Vue d'ensemble des performances de la plateforme</p>
                </div>
                <div className="dashboard-controls">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="period-selector"
                    >
                        <option value="7d">7 derniers jours</option>
                        <option value="30d">30 derniers jours</option>
                        <option value="90d">90 derniers jours</option>
                        <option value="1y">1 an</option>
                    </select>
                    <button onClick={handleExportPdf} className="export-button">
                        <Download size={18} />
                        Exporter PDF
                    </button>
                    <button onClick={loadDashboard} className="refresh-button">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard
                    title="Étudiants Actifs"
                    value={activeStudents}
                    icon={<Users />}
                    color="#ff6b35"
                    subtitle={`Sur ${totalStudents} inscrits`}
                    trend={{
                        value: 12.5,
                        direction: 'up',
                    }}
                />
                <StatCard
                    title="Formations Totales"
                    value={totalFormations}
                    icon={<BookOpen />}
                    color="#4ecdc4"
                />
                <StatCard
                    title="Taux de Complétion"
                    value={`${avgCompletion}%`}
                    icon={<Award />}
                    color="#f7b731"
                    trend={{
                        value: 5.2,
                        direction: 'up',
                    }}
                />
                <StatCard
                    title="Utilisateurs En Ligne"
                    value={dashboard.onlineUsers ?? 0}
                    icon={<TrendingUp />}
                    color="#5f27cd"
                />
            </div>

            <div className="charts-section">
                <div className="chart-card chart-card-large">
                    <h2>Tendances d'Inscriptions</h2>
                    {dashboard.trends?.enrollments?.length > 0 ? (
                        <LineChart
                            data={dashboard.trends.enrollments}
                            dataKey="count"
                            xAxisKey="date"
                            color="#ff6b35"
                            height={350}
                        />
                    ) : (
                        <p className="no-data">Aucune donnée disponible</p>
                    )}
                </div>

                <div className="chart-card">
                    <h2>Top Formations</h2>
                    {dashboard.topFormations?.length > 0 ? (
                        <div className="top-formations-list">
                            {dashboard.topFormations.slice(0, 5).map((formation: any, index: number) => (
                                <div key={formation.id || index} className="formation-item">
                                    <div className="formation-rank">{index + 1}</div>
                                    <div className="formation-info">
                                        <span className="formation-name">{formation.titre}</span>
                                        <span className="formation-stats">
                                            {formation.students_count} étudiants • {formation.completion_rate?.toFixed(0)}% complété
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">Aucune formation disponible</p>
                    )}
                </div>

                <div className="chart-card">
                    <h2>Aperçu des Quiz</h2>
                    {dashboard.quizOverview ? (
                        <div className="quiz-overview">
                            <div className="quiz-stat-item">
                                <span className="quiz-stat-label">Total Quiz</span>
                                <span className="quiz-stat-value">{dashboard.quizOverview.totalQuizzes || 0}</span>
                            </div>
                            <div className="quiz-stat-item">
                                <span className="quiz-stat-label">Score Moyen</span>
                                <span className="quiz-stat-value">{dashboard.quizOverview.averageScore?.toFixed(1) || 0}/20</span>
                            </div>
                            <div className="quiz-stat-item">
                                <span className="quiz-stat-label">Taux de Réussite</span>
                                <span className="quiz-stat-value">{dashboard.quizOverview.successRate?.toFixed(1) || 0}%</span>
                            </div>
                        </div>
                    ) : (
                        <p className="no-data">Aucune donnée de quiz disponible</p>
                    )}
                </div>

                <div className="chart-card chart-card-large">
                    <h2>Activité Récente</h2>
                    {dashboard.recentActivity?.length > 0 ? (
                        <div className="recent-activity-list">
                            {dashboard.recentActivity.slice(0, 10).map((activity: any, index: number) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-icon">{activity.type === 'login' ? '🔑' : '📚'}</div>
                                    <div className="activity-info">
                                        <span className="activity-user">{activity.user_name}</span>
                                        <span className="activity-action">{activity.action}</span>
                                    </div>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">Aucune activité récente</p>
                    )}
                </div>
            </div>
        </div>
    );
};
