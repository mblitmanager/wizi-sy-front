import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Send, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationSender: React.FC = () => {
    const [segment, setSegment] = useState('all');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('/api/notify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ segment, message }),
            });
            if (!res.ok) throw new Error('Network response was not ok');
            setStatus('sent');
            setMessage('');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const segmentLabels: Record<string, { label: string; count?: string }> = {
        all: { label: 'Tous les utilisateurs', count: '∞' },
        commercial: { label: 'Commerciaux', count: '12' },
        formateur: { label: 'Formateurs', count: '8' },
        stagiaire: { label: 'Stagiaires', count: '156' },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="border-yellow-200 shadow-lg bg-gradient-to-br from-white to-yellow-50/30 mt-6">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Envoyer une notification ciblée
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Segment selection */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Segment cible
                            </label>
                            <Select value={segment} onValueChange={setSegment}>
                                <SelectTrigger className="border-yellow-300 focus:border-yellow-500 bg-white">
                                    <SelectValue placeholder="Sélectionner un segment" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(segmentLabels).map(([key, { label, count }]) => (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center justify-between w-full gap-4">
                                                <span>{label}</span>
                                                {count && (
                                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                                                        {count}
                                                    </span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 mt-1">
                                {segmentLabels[segment]?.label} - {segmentLabels[segment]?.count || '0'} utilisateur(s)
                            </p>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Message de la notification
                            </label>
                            <Textarea
                                placeholder="Écrivez le contenu de la notification..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className="border-yellow-300 focus:border-yellow-500 min-h-32"
                            />
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-500">
                                    {message.length} caractères
                                </p>
                                {message.length > 100 && (
                                    <p className="text-xs text-amber-600">
                                        ⚠ Les longs messages peuvent être tronqués sur mobile
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Preview */}
                        {message && (
                            <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-xs font-semibold text-gray-600 mb-2">Aperçu de la notification</p>
                                <div className="flex items-start gap-3 bg-white p-3 rounded shadow-sm">
                                    <Bell className="w-5 h-5 text-amber-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">{message}</p>
                                        <p className="text-xs text-gray-400 mt-1">À l'instant</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit button */}
                        <Button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold py-6 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {status === 'sending' ? 'Envoi en cours...' : 'Envoyer la notification'}
                        </Button>

                        {/* Status messages */}
                        {status === 'sent' && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-in fade-in slide-in-from-top-2">
                                ✓ Notification envoyée avec succès !
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
                                ✗ Erreur lors de l'envoi. Veuillez réessayer.
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default NotificationSender;
