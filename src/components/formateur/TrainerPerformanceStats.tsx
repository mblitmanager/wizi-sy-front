import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Trophy, MousePointerClick, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import FormateurService, { TrainerPerformanceResponse, StudentDetails } from '@/services/FormateurService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle2, XCircle, Clock, Smartphone, Globe } from 'lucide-react';

const TrainerPerformanceStats = () => {
    const [data, setData] = useState<TrainerPerformanceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [details, setDetails] = useState<StudentDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await FormateurService.getStudentsPerformance();
                setData(res);
            } catch (err) {
                console.error('Error fetching trainer performance:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleViewDetails = async (id: number) => {
        setSelectedStudentId(id);
        setLoadingDetails(true);
        try {
            const res = await FormateurService.getStagiaireStats(id);
            setDetails(res);
        } catch (err) {
            console.error('Error fetching student details:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeDetails = () => {
        setSelectedStudentId(null);
        setDetails(null);
    };

    if (loading || !data) {
        return <div className="p-4 text-center">Chargement des statistiques...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ranking: Most Quizzes */}
                <Card className="border-amber-200 bg-amber-50/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-700">
                            <Trophy className="h-5 w-5" />
                            Top Quizzers (Plus de Quiz)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.rankings.most_quizzes.map((student, idx) => (
                                <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-white/50 border border-amber-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="font-bold text-amber-600">#{idx + 1}</div>
                                        <div>
                                            <div className="font-medium text-sm">{student.name}</div>
                                            <div className="text-xs text-muted-foreground">{student.email}</div>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                        {student.total_quizzes} quiz
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Ranking: Most Active */}
                <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                            <MousePointerClick className="h-5 w-5" />
                            Top Actifs (Plus de Connexions)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.rankings.most_active.map((student, idx) => (
                                <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-white/50 border border-blue-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="font-bold text-blue-600">#{idx + 1}</div>
                                        <div>
                                            <div className="font-medium text-sm">{student.name}</div>
                                            <div className="text-xs text-muted-foreground">{student.email}</div>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                        {student.total_logins} connexions
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Performance Détaillée des Stagiaires
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Stagiaire</TableHead>
                                <TableHead className="text-center">Dernier Quiz</TableHead>
                                <TableHead className="text-center">Quiz Totaux</TableHead>
                                <TableHead className="text-center">Connexions</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.performance.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{student.name}</div>
                                            <div className="text-xs text-muted-foreground">{student.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {student.last_quiz_at ? (
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm">
                                                    {format(new Date(student.last_quiz_at), 'dd MMM yyyy', { locale: fr })}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(student.last_quiz_at), 'HH:mm')}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">Aucun quiz</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{student.total_quizzes}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{student.total_logins}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge 
                                            variant="secondary" 
                                            className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                                            onClick={() => handleViewDetails(student.id)}
                                        >
                                            Détails
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Details Modal */}
            <Dialog open={selectedStudentId !== null} onOpenChange={(open) => !open && closeDetails()}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Détails du Stagiaire</DialogTitle>
                    </DialogHeader>
                    {loadingDetails ? (
                        <div className="py-12 text-center text-muted-foreground">
                            Chargement des détails...
                        </div>
                    ) : details ? (
                        <div className="space-y-6 pt-4">
                            {/* Student Info */}
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                    {details.stagiaire.prenom[0]}{details.stagiaire.nom[0]}
                                </div>
                                <div>
                                    <div className="font-semibold">{details.stagiaire.prenom} {details.stagiaire.nom}</div>
                                    <div className="text-sm text-muted-foreground">{details.stagiaire.email}</div>
                                </div>
                            </div>

                            {/* Quiz Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg border border-amber-100 bg-amber-50/50">
                                    <div className="text-xs font-medium text-amber-700 flex items-center gap-1 mb-1">
                                        <Trophy className="h-3.5 w-3.5" /> Quiz Totaux
                                    </div>
                                    <div className="text-xl font-bold text-amber-900">{details.quiz_stats.total_quiz}</div>
                                </div>
                                <div className="p-3 rounded-lg border border-green-100 bg-green-50/50">
                                    <div className="text-xs font-medium text-green-700 flex items-center gap-1 mb-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Score Moyen
                                    </div>
                                    <div className="text-xl font-bold text-green-900">{details.quiz_stats.avg_score}%</div>
                                </div>
                                <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                                    <div className="text-xs font-medium text-blue-700 flex items-center gap-1 mb-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Réponses Correctes
                                    </div>
                                    <div className="text-sm font-bold text-blue-900">
                                        {details.quiz_stats.total_correct} / {details.quiz_stats.total_questions}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/50">
                                    <div className="text-xs font-medium text-purple-700 flex items-center gap-1 mb-1">
                                        <Trophy className="h-3.5 w-3.5" /> Meilleur Score
                                    </div>
                                    <div className="text-xl font-bold text-purple-900">{details.quiz_stats.best_score}%</div>
                                </div>
                            </div>

                            {/* Activity Info */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-900">Activité Récente</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Clock className="h-4 w-4" /> Dernière activité
                                        </span>
                                        <span className="font-medium">{details.activity.last_activity}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Globe className="h-4 w-4" /> Statut
                                        </span>
                                        <Badge variant={details.activity.is_online ? "default" : "secondary"}>
                                            {details.activity.is_online ? "En ligne" : "Hors ligne"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Smartphone className="h-4 w-4" /> Dernière plateforme
                                        </span>
                                        <span className="font-medium capitalize">{details.activity.last_client || 'Inconnue'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-red-500">
                            Erreur de chargement.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TrainerPerformanceStats;
