import React from 'react';
import {
    BarChart as RechartsBar,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface BarChartProps {
    data: Array<{ [key: string]: any }>;
    dataKey?: string;
    xAxisKey?: string;
    color?: string;
    height?: number;
    showLegend?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
    data,
    dataKey = 'value',
    xAxisKey = 'name',
    color = '#4ecdc4',
    height = 300,
    showLegend = false,
}) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsBar data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                <XAxis
                    dataKey={xAxisKey}
                    stroke="#7f8c8d"
                    style={{ fontSize: '0.75rem' }}
                />
                <YAxis stroke="#7f8c8d" style={{ fontSize: '0.75rem' }} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #ecf0f1',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                />
                {showLegend && <Legend />}
                <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
            </RechartsBar>
        </ResponsiveContainer>
    );
};
