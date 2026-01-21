import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Play, Eye, Users, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface VideoItem {
    id: number;
    titre: string;
    description: string;
    url: string;
    type: string;
    created_at: string;
}

interface VideoStats {
    video_id: number;
    total_views: number;
    total_duration_watched: number;
    completion_rate: number;
    views_by_stagiaire: any[];
}

interface FormationVideoGroup {
    formation_id: number;
    formation_titre: string;
    videos: VideoItem[];
}

export function FormateurVideosPage() {
    const [formationsWithVideos, setFormationsWithVideos] = useState<FormationVideoGroup[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [videoStats, setVideoStats] = useState<VideoStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/formateur/formations-videos`, { // Nouvelle API
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data.data || response.data; // La réponse de l'API contient un champ 'data'
            setFormationsWithVideos(data || []); // Stocker directement le tableau de FormationVideoGroup
        } catch (err) {
            console.error('Erreur chargement vidéos:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVideoStats = async (videoId: number) => {
        setStatsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/formateur/video/${videoId}/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVideoStats(response.data.data || response.data);
        } catch (err) {
            console.error('Erreur chargement stats:', err);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleViewStats = (video: VideoItem) => {
        setSelectedVideo(video);
        fetchVideoStats(video.id);
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto py-6 px-4 bg-background text-foreground">
                    <p className="text-center">Chargement...</p>
                </div>
            </Layout>
        );
    }

    // Vérifier si toutes les formations ont des vidéos, ou si aucune formation n'a de vidéo.
    const hasAnyVideos = formationsWithVideos.some(group => group.videos.length > 0);

    return (
        <Layout>
            <div className="container mx-auto py-6 px-4 bg-background">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground">
                        Bibliothèque Vidéos
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Accès complet aux vidéos et statistiques de visionnage par formation
                    </p>
                </div>

                {hasAnyVideos ? (
                    <div className="space-y-8">
                        {formationsWithVideos.map((formationGroup) => (
                            <div key={formationGroup.formation_id}>
                                <h2 className="text-2xl font-bold text-foreground mb-4">
                                    {formationGroup.formation_titre}
                                </h2>
                                {formationGroup.videos.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {formationGroup.videos.map((video) => (
                                            <Card key={video.id} className="hover:shadow-lg transition-shadow bg-card border border-border">
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Video className="h-5 w-5 text-primary" />
                                                            <CardTitle className="text-base line-clamp-2 text-foreground">
                                                                {video.titre}
                                                            </CardTitle>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {video.description || 'Aucune description'}
                                                    </p>

                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="bg-background text-foreground border-border">{video.type}</Badge>
                                                        <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                                                            {new Date(video.created_at).toLocaleDateString()}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex-1 border-border bg-card text-foreground hover:bg-background hover:text-primary"
                                                            onClick={() => window.open(video.url, '_blank')}
                                                        >
                                                            <Play className="h-4 w-4 mr-1" />
                                                            Voir
                                                        </Button>

                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="flex-1 border-border bg-card text-foreground hover:bg-background hover:text-primary"
                                                                    onClick={() => handleViewStats(video)}
                                                                >
                                                                    <BarChart3 className="h-4 w-4 mr-1" />
                                                                    Stats
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-2xl bg-card border-border text-foreground">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-foreground">
                                                                        Statistiques - {selectedVideo?.titre}
                                                                    </DialogTitle>
                                                                </DialogHeader>

                                                                {statsLoading ? (
                                                                    <p className="text-muted-foreground">Chargement...</p>
                                                                ) : videoStats ? (
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-3 gap-4">
                                                                            <Card className="bg-background border-border">
                                                                                <CardContent className="pt-6">
                                                                                    <div className="text-center">
                                                                                        <Eye className="h-8 w-8 mx-auto text-primary mb-2" />
                                                                                        <p className="text-2xl font-bold text-foreground">{videoStats.total_views}</p>
                                                                                        <p className="text-xs text-muted-foreground">Vues Totales</p>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>

                                                                            <Card className="bg-background border-border">
                                                                                <CardContent className="pt-6">
                                                                                    <div className="text-center">
                                                                                        <Video className="h-8 w-8 mx-auto text-primary mb-2" />
                                                                                        <p className="text-2xl font-bold text-foreground">
                                                                                            {Math.floor(videoStats.total_duration_watched / 60)}
                                                                                        </p>
                                                                                        <p className="text-xs text-muted-foreground">Minutes Visionnées</p>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>

                                                                            <Card className="bg-background border-border">
                                                                                <CardContent className="pt-6">
                                                                                    <div className="text-center">
                                                                                        <Users className="h-8 w-8 mx-auto text-primary mb-2" />
                                                                                        <p className="text-2xl font-bold text-foreground">
                                                                                            {videoStats.completion_rate}%
                                                                                        </p>
                                                                                        <p className="text-xs text-muted-foreground">Taux Complétion</p>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>
                                                                        </div>

                                                                        {videoStats?.views_by_stagiaire?.length > 0 && (
                                                                            <div>
                                                                                <h4 className="font-semibold mb-2 text-foreground">Vues par Stagiaire</h4>
                                                                                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                                                                                    {videoStats.views_by_stagiaire.map((view: any) => (
                                                                                        <div
                                                                                            key={view.id}
                                                                                            className="flex items-center justify-between p-2 bg-background rounded border border-border"
                                                                                        >
                                                                                            <span className="text-sm text-foreground">
                                                                                                {view.prenom} {view.nom}
                                                                                            </span>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <Badge variant={view.completed ? 'default' : 'secondary'} className={view.completed ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'}>
                                                                                                    {view.completed ? 'Complété' : 'En cours'}
                                                                                                </Badge>
                                                                                                <span className="text-xs text-muted-foreground">
                                                                                                    {Math.floor(view.total_watched / 60)}min
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : null}
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">Aucune vidéo pour cette formation.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card className="bg-card border-border">
                        <CardContent className="py-12 text-center text-muted-foreground">
                            Aucune vidéo disponible pour vos formations.
                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
}

export default FormateurVideosPage;
