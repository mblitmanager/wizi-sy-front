import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, Calendar, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stats {
    signups?: number;
    activeSessions?: number;
    revenue?: number;
    completedCourses?: number;
    [key: string]: number | undefined;
}

interface ChartData {
    date: string;
    value: number;
}

const StatsDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats>({});
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('7d');
    const [metric, setMetric] = useState('signups');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/stats?range=${timeRange}&metric=${metric}`);
                if (!res.ok) throw new Error('Failed to fetch stats');
                const responseData = await res.json();
                const data = responseData.data || responseData;
                setStats(data.summary || {});
                setChartData(data.chartData || []);
            } catch (e) {
                console.error(e);
                setError('Erreur lors du chargement des statistiques');
                // Mock data for demonstration
                setStats({
                    signups: 156,
                    activeSessions: 42,
                    revenue: 12450,
                    completedCourses: 89,
                });
                setChartData([
                    { date: '01/12', value: 20 },
                    { date: '02/12', value: 25 },
                    { date: '03/12', value: 22 },
                    { date: '04/12', value: 30 },
                    { date: '05/12', value: 28 },
                    { date: '06/12', value: 35 },
                    { date: '07/12', value: 42 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [timeRange, metric]);

    const statCards = [
        {
            title: 'Inscriptions',
            value: stats.signups || 0,
            icon: Users,
            color: 'from-orange-500 to-amber-600',
            bgColor: 'from-orange-50 to-amber-50/30',
        },
        {
            title: 'Sessions actives',
            value: stats.activeSessions || 0,
            icon: Activity,
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'from-yellow-50 to-orange-50/30',
        },
        {
            title: 'Revenu (€)',
            value: stats.revenue?.toLocaleString() || 0,
            icon: DollarSign,
            color: 'from-amber-500 to-yellow-600',
            bgColor: 'from-amber-50 to-yellow-50/30',
        },
        {
            title: 'Formations complétées',
            value: stats.completedCourses || 0,
            icon: TrendingUp,
            color: 'from-orange-600 to-amber-500',
            bgColor: 'from-orange-50 to-amber-50/30',
        },
    ];

    if (loading && !stats.signups) {
        return (
            <Card className="mt-6">
                <CardContent className="p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                        <span className="ml-3 text-gray-600">Chargement des statistiques…</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-6 space-y-4"
        >
            {/* Header with filters */}
            <Card className="border-orange-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Tableau de bord statistique
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/20 hover:bg-white/30 text-white border-0"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exporter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="w-40 border-orange-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">7 derniers jours</SelectItem>
                                    <SelectItem value="30d">30 derniers jours</SelectItem>
                                    <SelectItem value="90d">90 derniers jours</SelectItem>
                                    <SelectItem value="1y">1 an</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Select value={metric} onValueChange={setMetric}>
                            <SelectTrigger className="w-56 border-orange-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="signups">Inscriptions</SelectItem>
                                <SelectItem value="activeSessions">Sessions actives</SelectItem>
                                <SelectItem value="revenue">Revenu</SelectItem>
                                <SelectItem value="completedCourses">Formations complétées</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Stat cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={index}
                            className={`border-orange-200 shadow-lg bg-gradient-to-br ${stat.bgColor} hover:scale-105 transition-transform cursor-pointer`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                        <p className="text-3xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Chart */}
            <Card className="border-orange-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg text-gray-700">Évolution dans le temps</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" />
                            <XAxis dataKey="date" stroke="#f97316" />
                            <YAxis stroke="#f97316" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff7ed',
                                    border: '1px solid #fed7aa',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#f97316"
                                strokeWidth={3}
                                dot={{ fill: '#f97316', r: 5 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default StatsDashboard;
