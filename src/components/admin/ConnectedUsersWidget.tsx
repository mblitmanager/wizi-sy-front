import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Monitor, Tablet, Users, RefreshCw } from 'lucide-react';
import api from '@/services/api';

interface ConnectedUser {
    id: number;
    name: string;
    email: string;
    client: 'web' | 'android' | 'ios';
    role: string;
    last_activity_at: string;
    duration: string;
    avatar?: string;
}

interface ConnectedUsersStats {
    total: number;
    web: number;
    android: number;
    ios: number;
    users: ConnectedUser[];
}

const platformConfig = {
    web: { icon: Monitor, color: 'bg-blue-500', label: 'Web' },
    android: { icon: Smartphone, color: 'bg-green-500', label: 'Android' },
    ios: { icon: Tablet, color: 'bg-gray-500', label: 'iOS' },
};

export function ConnectedUsersWidget() {
    const [data, setData] = useState<ConnectedUsersStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [platformFilter, setPlatformFilter] = useState<string>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchConnectedUsers = async () => {
        try {
            const params: any = {};
            if (platformFilter !== 'all') params.platform = platformFilter;
            if (roleFilter !== 'all') params.role = roleFilter;

            const response = await api.get<ConnectedUsersStats>('/admin/connected-users', { params });
            setData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching connected users:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConnectedUsers();
    }, [platformFilter, roleFilter]);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(fetchConnectedUsers, 10000); // 10 seconds
        return () => clearInterval(interval);
    }, [autoRefresh, platformFilter, roleFilter]);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Chargement...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Utilisateurs Connectés
                        </CardTitle>
                        <CardDescription>
                            {data?.total || 0} utilisateur{(data?.total || 0) > 1 ? 's' : ''} en ligne
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchConnectedUsers}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(platformConfig).map(([platform, config]) => {
                        const Icon = config.icon;
                        const count = (data as any)?.[platform] || 0;
                        return (
                            <div key={platform} className="flex items-center gap-3 p-3 rounded-lg border">
                                <div className={`p-2 rounded-full ${config.color} text-white`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{count}</div>
                                    <div className="text-sm text-muted-foreground">{config.label}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-4">
                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Plateforme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes plateformes</SelectItem>
                            <SelectItem value="web">Web</SelectItem>
                            <SelectItem value="android">Android</SelectItem>
                            <SelectItem value="ios">iOS</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous rôles</SelectItem>
                            <SelectItem value="stagiaire">Stagiaire</SelectItem>
                            <SelectItem value="formateur">Formateur</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="administrateur">Admin</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="ml-auto flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="auto-refresh"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            className="rounded"
                        />
                        <label htmlFor="auto-refresh" className="text-sm cursor-pointer">
                            Auto-refresh
                        </label>
                    </div>
                </div>

                {/* Users List */}
                <div className="space-y-2">
                    {data?.users && data.users.length > 0 ? (
                        data.users.map((user) => {
                            const platformInfo = platformConfig[user.client];
                            const PlatformIcon = platformInfo?.icon || Monitor;

                            return (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-10 w-10 rounded-full"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-semibold">
                                                    {user.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-muted-foreground">{user.duration}</span>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <PlatformIcon className="h-3 w-3" />
                                            {platformInfo?.label || user.client}
                                        </Badge>
                                        <Badge variant="secondary">{user.role}</Badge>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Aucun utilisateur connecté
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
