import React from 'react';
import {
    LineChart as RechartsLine,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface LineChartProps {
    data: Array<{ [key: string]: any }>;
    dataKey?: string;
    xAxisKey?: string;
    color?: string;
    height?: number;
    showLegend?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
    data,
    dataKey = 'value',
    xAxisKey = 'date',
    color = '#ff6b35',
    height = 300,
    showLegend = false,
}) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsLine data={data}>
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
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={3}
                    dot={{ fill: color, r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </RechartsLine>
        </ResponsiveContainer>
    );
};
