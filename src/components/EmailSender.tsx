import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Send, Users, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
}

const EmailSender: React.FC = React.memo(() => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserList, setShowUserList] = useState(false);

    // Fetch users list
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const data: User[] = await res.json();
                    setUsers(data);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUser = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const selectAll = () => {
        setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    };

    const clearAll = () => {
        setSelectedUsers(new Set());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUsers.size === 0) {
            setStatus('error');
            return;
        }
        setStatus('sending');
        try {
            const res = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userIds: Array.from(selectedUsers),
                    subject,
                    message
                }),
            });
            if (!res.ok) throw new Error('Network response was not ok');
            setStatus('sent');
            setSubject('');
            setMessage('');
            setSelectedUsers(new Set());
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <Card className="border-orange-200 shadow-lg bg-gradient-to-br from-white to-orange-50/30">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Envoyer un e‑mail ciblé
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User selection */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Destinataires ({selectedUsers.size})
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowUserList(!showUserList)}
                                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                            >
                                {showUserList ? 'Masquer' : 'Sélectionner'}
                            </Button>
                        </div>

                        {showUserList && (
                            <div className="border border-orange-200 rounded-lg p-3 bg-white space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Rechercher un utilisateur..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 border-orange-200 focus:border-orange-400"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={selectAll}
                                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                                    >
                                        Tout sélectionner
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={clearAll}
                                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                                    >
                                        Tout désélectionner
                                    </Button>
                                </div>

                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {filteredUsers.map((user) => (
                                        <label
                                            key={user.id}
                                            className="flex items-center gap-3 p-2 hover:bg-orange-50 rounded cursor-pointer transition-colors"
                                        >
                                            <Checkbox
                                                checked={selectedUsers.has(user.id)}
                                                onCheckedChange={() => toggleUser(user.id)}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                            {user.role && (
                                                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                                                    {user.role}
                                                </span>
                                            )}
                                        </label>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <p className="text-center text-gray-500 text-sm py-4">
                                            Aucun utilisateur trouvé
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Objet
                        </label>
                        <Input
                            type="text"
                            placeholder="Objet de l'e‑mail"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="border-orange-200 focus:border-orange-400"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Message
                        </label>
                        <Textarea
                            placeholder="Écrivez votre message ici..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="border-orange-200 focus:border-orange-400 min-h-32"
                        />
                    </div>

                    {/* Submit button */}
                    <Button
                        type="submit"
                        disabled={status === 'sending' || selectedUsers.size === 0}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-6 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {status === 'sending' ? 'Envoi en cours...' : `Envoyer à ${selectedUsers.size} destinataire(s)`}
                    </Button>

                    {/* Status messages */}
                    {status === 'sent' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            ✓ E‑mail envoyé avec succès !
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            ✗ Erreur lors de l'envoi. Veuillez réessayer.
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
});

EmailSender.displayName = 'EmailSender';

export default EmailSender;
