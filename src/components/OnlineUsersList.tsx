import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Search, Clock, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
    id: string;
    name: string;
    role?: string;
    onlineDuration?: number; // in minutes
}

const OnlineUsersList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Simple polling implementation
    useEffect(() => {
        let isMounted = true;
        const fetchOnline = async () => {
            try {
                const res = await fetch('/api/online-users');
                if (!res.ok) throw new Error('Failed to fetch online users');
                const data: User[] = await res.json();
                if (isMounted) {
                    setUsers(data);
                    setFilteredUsers(data);
                }
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setError('Erreur lors du chargement');
                    // Mock data
                    const mockUsers: User[] = [
                        { id: '1', name: 'Marie Dupont', role: 'commercial', onlineDuration: 45 },
                        { id: '2', name: 'Jean Martin', role: 'formateur', onlineDuration: 120 },
                        { id: '3', name: 'Sophie Bernard', role: 'stagiaire', onlineDuration: 15 },
                        { id: '4', name: 'Lucas Petit', role: 'stagiaire', onlineDuration: 60 },
                        { id: '5', name: 'Emma Durand', role: 'commercial', onlineDuration: 30 },
                    ];
                    setUsers(mockUsers);
                    setFilteredUsers(mockUsers);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchOnline();
        const interval = setInterval(fetchOnline, 15000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const filtered = users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleBadgeColor = (role?: string) => {
        switch (role?.toLowerCase()) {
            case 'commercial':
                return 'bg-orange-100 text-orange-700 border-orange-300';
            case 'formateur':
                return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'admin':
                return 'bg-red-100 text-red-700 border-red-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const formatDuration = (minutes?: number) => {
        if (!minutes) return 'À l\'instant';
        if (minutes < 60) return `${minutes}min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
    };

    if (loading) {
        return (
            <Card className="mt-6">
                <CardContent className="p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-orange-500 border-t-transparent"></div>
                        <span className="ml-3 text-gray-600">Chargement…</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
        >
            <Card className="border-orange-200 shadow-lg bg-gradient-to-br from-white to-orange-50/20 mt-6">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Utilisateurs en ligne
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
                            <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
                            {users.length} en ligne
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    {/* Search bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-orange-200 focus:border-orange-400"
                        />
                    </div>

                    {/* Users list */}
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">
                                {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur en ligne'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 p-3 bg-white hover:bg-orange-50 rounded-lg border border-orange-100 transition-colors cursor-pointer group"
                                >
                                    {/* Avatar */}
                                    <Avatar className="w-10 h-10 border-2 border-orange-200 group-hover:border-orange-400 transition-colors">
                                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white font-semibold">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* User info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                                            <Circle className="w-2 h-2 fill-green-500 text-green-500 flex-shrink-0" />
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {user.role && (
                                                <Badge variant="outline" className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role}
                                                </Badge>
                                            )}
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {formatDuration(user.onlineDuration)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default OnlineUsersList;
