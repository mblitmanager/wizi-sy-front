import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, TrendingDown, Search, Phone, MessageSquare } from 'lucide-react';
import { StatCard } from '@/components/statistics/StatCard';
import './FormateurDashboard.css';

interface Trainee {
    id: number;
    name: string;
    formation: string;
    avatar?: string;
    status: 'on-track' | 'in-progress' | 'needs-attention' | 'completed';
    progress: number;
    lastQuizScore?: number;
    quizPerformance?: number[];
}

const MOCK_TRAINEES: Trainee[] = [
    {
        id: 1,
        name: 'Eleanor Pena',
        formation: 'Sales Fundamentals',
        status: 'on-track',
        progress: 85,
        lastQuizScore: 85,
        quizPerformance: [65, 70, 75, 80, 85]
    },
    {
        id: 2,
        name: 'Cameron Williamson',
        formation: 'Advanced Negotiation',
        status: 'in-progress',
        progress: 40,
        quizPerformance: [50, 45, 40, 42, 40]
    },
    {
        id: 3,
        name: 'Jane Cooper',
        formation: 'Product Knowledge',
        status: 'needs-attention',
        progress: 25,
        lastQuizScore: 45,
        quizPerformance: [55, 50, 48, 46, 45]
    },
    {
        id: 4,
        name: 'Robert Fox',
        formation: 'Client Relations',
        status: 'completed',
        progress: 100,
        quizPerformance: [80, 85, 88, 92, 95]
    },
];

export const FormateurDashboard = () => {
    const [trainees, setTrainees] = useState<Trainee[]>(MOCK_TRAINEES);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const filteredTrainees = trainees.filter(trainee =>
        trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainee.formation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalTrainees = trainees.length;
    const averageScore = Math.round(
        trainees.reduce((sum, t) => sum + (t.lastQuizScore || t.progress), 0) / trainees.length
    );

    const getStatusConfig = (status: Trainee['status']) => {
        switch (status) {
            case 'on-track':
                return { label: 'On Track', color: '#10b981', bgColor: '#d1fae5' };
            case 'in-progress':
                return { label: 'In Progress', color: '#f59e0b', bgColor: '#fef3c7' };
            case 'needs-attention':
                return { label: 'Needs Attention', color: '#ef4444', bgColor: '#fee2e2' };
            case 'completed':
                return { label: 'Completed', color: '#10b981', bgColor: '#d1fae5' };
        }
    };

    return (
        <div className="formateur-dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Dashboard Formateur</h1>
                    <p className="subtitle">Suivez la progression de vos stagiaires</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Total Stagiaires"
                    value={totalTrainees}
                    icon={<Users />}
                    color="#ff6b35"
                    subtitle={`+2 cette semaine`}
                    trend={{ value: 6, direction: 'up' }}
                />
                <StatCard
                    title="Score Moyen"
                    value={`${averageScore}%`}
                    icon={<TrendingUp />}
                    color="#f7931e"
                    subtitle="Sur tous les quiz"
                    trend={{ value: 5, direction: 'down' }}
                />
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <div className="search-box">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher un stagiaire..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Trainees List */}
            <div className="trainees-list">
                {filteredTrainees.map((trainee) => {
                    const statusConfig = getStatusConfig(trainee.status);

                    return (
                        <div key={trainee.id} className="trainee-card">
                            <div className="trainee-header">
                                <div className="trainee-info">
                                    <div className="trainee-avatar">
                                        {trainee.avatar ? (
                                            <img src={trainee.avatar} alt={trainee.name} />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {trainee.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="trainee-details">
                                        <h3 className="trainee-name">{trainee.name}</h3>
                                        <p className="trainee-formation">{trainee.formation}</p>
                                        {trainee.lastQuizScore && (
                                            <p className="last-quiz-score">
                                                Last Quiz Score: {trainee.lastQuizScore}%
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button className="details-btn">→</button>
                            </div>

                            <div className="trainee-status">
                                <span
                                    className="status-badge"
                                    style={{
                                        color: statusConfig.color,
                                        backgroundColor: statusConfig.bgColor,
                                    }}>
                                    {trainee.status === 'on-track' && '✓'}
                                    {trainee.status === 'in-progress' && '📊'}
                                    {trainee.status === 'needs-attention' && '!'}
                                    {trainee.status === 'completed' && '✔'}
                                    {' '}{statusConfig.label}
                                </span>

                                <div className="action-buttons">
                                    <button className="action-btn" title="Appeler">
                                        <Phone size={18} />
                                    </button>
                                    <button className="action-btn" title="Message">
                                        <MessageSquare size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="progress-section">
                                <div className="progress-header">
                                    <span className="progress-label">Overall Progress</span>
                                    <span className="progress-value">{trainee.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${trainee.progress}%`,
                                            backgroundColor: statusConfig.color,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
