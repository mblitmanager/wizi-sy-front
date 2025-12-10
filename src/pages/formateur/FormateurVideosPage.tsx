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

export function FormateurVideosPage() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
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
            const response = await axios.get(`${API_URL}/formateur/videos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVideos(response.data.videos);
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
            setVideoStats(response.data);
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
                <div className="container mx-auto py-6 px-4">
                    <p className="text-center">Chargement...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto py-6 px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Bibliothèque Vidéos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Accès complet aux vidéos et statistiques de visionnage
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((video) => (
                        <Card key={video.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <Video className="h-5 w-5 text-purple-600" />
                                        <CardTitle className="text-base line-clamp-2">
                                            {video.titre}
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {video.description || 'Aucune description'}
                                </p>

                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{video.type}</Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        {new Date(video.created_at).toLocaleDateString()}
                                    </Badge>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
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
                                                className="flex-1"
                                                onClick={() => handleViewStats(video)}
                                            >
                                                <BarChart3 className="h-4 w-4 mr-1" />
                                                Stats
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Statistiques - {selectedVideo?.titre}
                                                </DialogTitle>
                                            </DialogHeader>

                                            {statsLoading ? (
                                                <p>Chargement...</p>
                                            ) : videoStats ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <Card>
                                                            <CardContent className="pt-6">
                                                                <div className="text-center">
                                                                    <Eye className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                                                                    <p className="text-2xl font-bold">{videoStats.total_views}</p>
                                                                    <p className="text-xs text-gray-500">Vues Totales</p>
                                                                </div>
                                                            </CardContent>
                                                        </Card>

                                                        <Card>
                                                            <CardContent className="pt-6">
                                                                <div className="text-center">
                                                                    <Video className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                                                                    <p className="text-2xl font-bold">
                                                                        {Math.floor(videoStats.total_duration_watched / 60)}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">Minutes Visionnées</p>
                                                                </div>
                                                            </CardContent>
                                                        </Card>

                                                        <Card>
                                                            <CardContent className="pt-6">
                                                                <div className="text-center">
                                                                    <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
                                                                    <p className="text-2xl font-bold">
                                                                        {videoStats.completion_rate}%
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">Taux Complétion</p>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>

                                                    {videoStats.views_by_stagiaire.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Vues par Stagiaire</h4>
                                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                                {videoStats.views_by_stagiaire.map((view: any) => (
                                                                    <div
                                                                        key={view.id}
                                                                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                                                    >
                                                                        <span className="text-sm">
                                                                            {view.prenom} {view.nom}
                                                                        </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge variant={view.completed ? 'default' : 'secondary'}>
                                                                                {view.completed ? 'Complété' : 'En cours'}
                                                                            </Badge>
                                                                            <span className="text-xs text-gray-500">
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

                {videos.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-gray-500">
                            Aucune vidéo disponible
                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
}

export default FormateurVideosPage;
