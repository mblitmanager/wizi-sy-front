import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import type { LeaderboardEntry } from '@/types/quiz';

interface StagiaireDetailsModalProps {
    stagiaire: LeaderboardEntry | null;
    isOpen: boolean;
    onClose: () => void;
}

interface StagiaireDetails {
    id: number;
    firstname: string;
    name: string;
    avatar?: string;
    rang: number;
    totalPoints: number;
    formations: Array<{
        id: number;
        titre: string;
    }>;
    formateurs: Array<{
        id: number;
        prenom: string;
        nom: string;
        image?: string;
    }>;
    quizStats: {
        totalCompleted: number;
        totalQuiz: number;
        pourcentageReussite: number;
        byLevel: {
            debutant: { completed: number; total: number };
            intermediaire: { completed: number; total: number };
            expert: { completed: number; total: number };
        };
        lastActivity?: string;
    };
}

export function StagiaireDetailsModal({ stagiaire, isOpen, onClose }: StagiaireDetailsModalProps) {
    const [details, setDetails] = useState<StagiaireDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && stagiaire) {
            fetchDetails();
        }
    }, [isOpen, stagiaire]);

    const fetchDetails = async () => {
        if (!stagiaire) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stagiaires/${stagiaire.id}/details`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des détails');
            }

            const data = await response.json();
            setDetails(data);
        } catch (err) {
            console.error('Error fetching stagiaire details:', err);
            setError('Impossible  de charger les détails');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Jamais';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchDetails}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : details ? (
                    <>
                        {/* Header */}
                        <DialogHeader>
                            <div className="flex items-start gap-6">
                                <UserAvatar
                                    imageUrl={details.avatar}
                                    name={details.firstname}
                                    size="xl"
                                    variant={details.rang === 1 ? 'gold' : details.rang === 2 ? 'silver' : details.rang === 3 ? 'bronze' : 'default'}
                                />
                                <div className="flex-1">
                                    <DialogTitle className="text-2xl font-bold mb-1">
                                        {details.firstname} {details.name}
                                    </DialogTitle>
                                    <p className="text-gray-600 mb-3">
                                        Position #{details.rang} • {details.totalPoints} points
                                    </p>
                                    <ScoreDisplay score={details.totalPoints} variant="gold" />
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6 mt-6">
                            {/* Formations */}
                            {details.formations && details.formations.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        Formations
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {details.formations.map((formation) => (
                                            <Badge key={formation.id} variant="secondary" className="text-sm py-1.5 px-3">
                                                {formation.titre}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Formateurs */}
                            {details.formateurs && details.formateurs.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Formateurs</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {details.formateurs.map((formateur) => (
                                            <div key={formateur.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                                                <UserAvatar
                                                    imageUrl={formateur.image}
                                                    name={formateur.prenom}
                                                    size="sm"
                                                />
                                                <span className="text-sm font-medium">
                                                    {formateur.prenom} {formateur.nom}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats Quiz */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Statistiques Quiz
                                </h3>

                                {/* Cards stats */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm font-medium text-gray-600">Total Points</span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-900">{details.totalPoints}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-medium text-gray-600">Quiz Complétés</span>
                                        </div>
                                        <p className="text-2xl font-bold text-green-900">
                                            {details.quizStats.totalCompleted}/{details.quizStats.totalQuiz}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-5 h-5 text-purple-600" />
                                            <span className="text-sm font-medium text-gray-600">Taux de Réussite</span>
                                        </div>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {details.quizStats.pourcentageReussite}%
                                        </p>
                                    </div>
                                </div>

                                {/* Par niveau */}
                                <div className="space-y-3">
                                    <QuizLevelProgress
                                        level="Débutant"
                                        completed={details.quizStats.byLevel.debutant.completed}
                                        total={details.quizStats.byLevel.debutant.total}
                                        color="green"
                                    />
                                    <QuizLevelProgress
                                        level="Intermédiaire"
                                        completed={details.quizStats.byLevel.intermediaire.completed}
                                        total={details.quizStats.byLevel.intermediaire.total}
                                        color="orange"
                                    />
                                    <QuizLevelProgress
                                        level="Expert"
                                        completed={details.quizStats.byLevel.expert.completed}
                                        total={details.quizStats.byLevel.expert.total}
                                        color="red"
                                    />
                                </div>

                                {/* Dernière activité */}
                                {details.quizStats.lastActivity && (
                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>Dernière activité : {formatDate(details.quizStats.lastActivity)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

// Composant pour afficher la progression par niveau
interface QuizLevelProgressProps {
    level: string;
    completed: number;
    total: number;
    color: 'green' | 'orange' | 'red';
}

function QuizLevelProgress({ level, completed, total, color }: QuizLevelProgressProps) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    const colorClasses = {
        green: 'bg-green-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{level}</span>
                <span className="text-sm text-gray-600">
                    {completed}/{total}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${colorClasses[color]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
