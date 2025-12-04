import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { History, Calendar, Filter, ChevronLeft, ChevronRight, Bell, Mail } from 'lucide-react';

interface Notification {
    id: string;
    type: 'email' | 'push';
    message: string;
    subject?: string;
    segment?: string;
    recipientCount: number;
    sentAt: string;
    status: 'sent' | 'failed' | 'pending';
}

const NotificationHistory: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'all' | 'email' | 'push'>('all');
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/notification-history');
                if (!res.ok) throw new Error('Failed to fetch history');
                const data: Notification[] = await res.json();
                setNotifications(data);
                setFilteredNotifications(data);
            } catch (e) {
                console.error(e);
                // Mock data
                const mockData: Notification[] = [
                    {
                        id: '1',
                        type: 'email',
                        subject: 'Nouvelle formation disponible',
                        message: 'Découvrez notre nouvelle formation React avancé',
                        segment: 'Tous',
                        recipientCount: 156,
                        sentAt: '2025-12-03T10:30:00',
                        status: 'sent',
                    },
                    {
                        id: '2',
                        type: 'push',
                        message: 'N\'oubliez pas de compléter votre quiz quotidien !',
                        segment: 'Stagiaires',
                        recipientCount: 145,
                        sentAt: '2025-12-03T09:00:00',
                        status: 'sent',
                    },
                    {
                        id: '3',
                        type: 'email',
                        subject: 'Mise à jour importante',
                        message: 'Nouvelles fonctionnalités ajoutées à la plateforme',
                        segment: 'Commerciaux',
                        recipientCount: 12,
                        sentAt: '2025-12-02T14:20:00',
                        status: 'sent',
                    },
                    {
                        id: '4',
                        type: 'push',
                        message: 'Rappel : Réunion d\'équipe demain à 10h',
                        segment: 'Formateurs',
                        recipientCount: 8,
                        sentAt: '2025-12-02T16:45:00',
                        status: 'sent',
                    },
                    {
                        id: '5',
                        type: 'email',
                        subject: 'Félicitations pour vos progrès !',
                        message: 'Vous avez complété 50% de votre formation',
                        segment: 'Stagiaires',
                        recipientCount: 89,
                        sentAt: '2025-12-01T11:15:00',
                        status: 'sent',
                    },
                ];
                setNotifications(mockData);
                setFilteredNotifications(mockData);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    useEffect(() => {
        const filtered = filterType === 'all'
            ? notifications
            : notifications.filter(n => n.type === filterType);
        setFilteredNotifications(filtered);
        setPage(1);
    }, [filterType, notifications]);

    const paginatedNotifications = filteredNotifications.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `Il y a ${diffMins}min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    };

    if (loading) {
        return (
            <Card className="mt-6">
                <CardContent className="p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-orange-500 border-t-transparent"></div>
                        <span className="ml-3 text-gray-600">Chargement de l'historique…</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-orange-200 shadow-lg bg-gradient-to-br from-white to-orange-50/20 mt-6">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Historique des notifications
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
                            <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                <SelectItem value="email">E-mails uniquement</SelectItem>
                                <SelectItem value="push">Notifications push</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                        <History className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Aucune notification dans l'historique</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Timeline */}
                        <div className="relative">
                            {paginatedNotifications.map((notif, index) => {
                                const Icon = notif.type === 'email' ? Mail : Bell;
                                const isLast = index === paginatedNotifications.length - 1;

                                return (
                                    <div key={notif.id} className="relative pl-8 pb-6">
                                        {/* Timeline line */}
                                        {!isLast && (
                                            <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 to-amber-200" />
                                        )}

                                        {/* Timeline dot */}
                                        <div className={`absolute left-0 top-1 p-2 rounded-full ${notif.type === 'email'
                                                ? 'bg-gradient-to-br from-orange-500 to-amber-600'
                                                : 'bg-gradient-to-br from-amber-500 to-yellow-600'
                                            }`}>
                                            <Icon className="w-3 h-3 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="bg-white border border-orange-100 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex-1">
                                                    {notif.subject && (
                                                        <h4 className="font-semibold text-gray-800 mb-1">{notif.subject}</h4>
                                                    )}
                                                    <p className="text-sm text-gray-600">{notif.message}</p>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        notif.type === 'email'
                                                            ? 'bg-orange-50 text-orange-700 border-orange-300'
                                                            : 'bg-amber-50 text-amber-700 border-amber-300'
                                                    }
                                                >
                                                    {notif.type === 'email' ? 'E-mail' : 'Push'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(notif.sentAt)}
                                                </div>
                                                <div>→ {notif.segment}</div>
                                                <div>{notif.recipientCount} destinataire(s)</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-orange-100">
                                <p className="text-sm text-gray-600">
                                    Page {page} sur {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="border-orange-300"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="border-orange-300"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default NotificationHistory;
