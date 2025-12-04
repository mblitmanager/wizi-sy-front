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

export const CommercialDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data
    const stats = {
        totalTrainees: 84,
        completion: 76,
        avgScore: 88,
    };

    const formationScores = [
        { name: 'Onboard', value: 65 },
        { name: 'AOPIA', value: 88 },
        { name: 'Sales', value: 70 },
        { name: 'Advanced', value: 72 },
    ];

    const completionData = [
        { status: 'Completed', value: 76, color: '#10b981' },
        { status: 'In Progress', value: 19, color: '#f59e0b' },
        { status: 'Not Started', value: 5, color: '#ef4444' },
    ];

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
                            title="Total Trainees"
                            value={stats.totalTrainees}
                            icon={<Users />}
                            color="#ff6b35"
                        />
                        <StatCard
                            title="Completion"
                            value={`${stats.completion}%`}
                            icon={<Award />}
                            color="#10b981"
                        />
                        <StatCard
                            title="Avg. Score"
                            value={`${stats.avgScore}%`}
                            icon={<TrendingUp />}
                            color="#f7931e"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="charts-row">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Average Scores by Formation</h3>
                                <p className="chart-subtitle">Last updated: 2 mins ago</p>
                            </div>
                            <BarChart
                                data={formationScores}
                                dataKey="value"
                                xAxisKey="name"
                                color="#4ecdc4"
                                height={250}
                            />
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Training Completion Status</h3>
                                <p className="chart-subtitle">All assigned trainees</p>
                            </div>
                            <div className="completion-chart">
                                <div className="donut-wrapper">
                                    <svg viewBox="0 0 100 100" className="donut-svg">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="20"
                                            strokeDasharray="189 251"
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div className="donut-center">
                                        <span className="donut-value">{stats.completion}%</span>
                                        <span className="donut-label">Done</span>
                                    </div>
                                </div>
                                <div className="completion-legend">
                                    {completionData.map((item, index) => (
                                        <div key={index} className="legend-item">
                                            <span
                                                className="legend-dot"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="legend-label">{item.status}</span>
                                            <span className="legend-value">({item.value}%)</span>
                                        </div>
                                    ))}
                                </div>
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
                    <div className="placeholder-content">
                        <h3>Engagement Metrics</h3>
                        <p>Statistiques d'engagement à venir...</p>
                    </div>
                </TabsContent>

                <TabsContent value="individual" className="tab-content">
                    <div className="placeholder-content">
                        <h3>Individual Tracking</h3>
                        <p>Suivi individuel des stagiaires à venir...</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
