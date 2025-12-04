import React from 'react';
import './StatCard.css';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
    color?: string;
    subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    color = '#ff6b35',
    subtitle,
}) => {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="stat-content">
                <h3 className="stat-title">{title}</h3>
                <p className="stat-value">{value}</p>
                {subtitle && <p className="stat-subtitle">{subtitle}</p>}
                {trend && (
                    <span className={`stat-trend trend-${trend.direction}`}>
                        {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
        </div>
    );
};
