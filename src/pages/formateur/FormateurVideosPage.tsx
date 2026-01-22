import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Play, Eye, Users, BarChart3, Search, Clock, CheckCircle, Info, ChevronRight, LayoutDashboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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

interface StagiaireView {
    id: number;
    prenom: string;
    nom: string;
    completed: boolean;
    total_watched: number;
}

interface VideoStats {
    video_id: number;
    total_views: number;
    total_duration_watched: number;
    completion_rate: number;
    views_by_stagiaire: StagiaireView[];
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
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/formateur/formations-videos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data.data || response.data;
            setFormationsWithVideos(data || []);
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

    const filteredFormations = formationsWithVideos.map(group => ({
        ...group,
        videos: group.videos.filter(v => 
            v.titre.toLowerCase().includes(searchQuery.toLowerCase()) || 
            v.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(group => group.videos.length > 0);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FEB823]"></div>
                        <p className="text-muted-foreground animate-pulse font-medium">Chargement de votre bibliothèque...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const totalVideos = formationsWithVideos.reduce((acc, g) => acc + g.videos.length, 0);

    return (
        <Layout>
            <div className="min-h-screen bg-[#F8FAFC]">
                {/* Hero Section - Light Version */}
                <div className="relative overflow-hidden bg-white border-b border-gray-100 mb-8 px-6 py-12 md:px-12 md:py-16 shadow-sm">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#FEB823]/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]"></div>
                    
                    <div className="relative z-10 max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex-1">
                                <Badge className="mb-4 bg-[#FEB823]/10 text-[#FE9E00] border-[#FEB823]/20 hover:bg-[#FEB823]/20 py-1 px-3">
                                    <Video className="w-3 h-3 mr-2" /> Espace Formateur
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                                    Bibliothèque <span className="text-[#FEB823]">Vidéos</span>
                                </h1>
                                <p className="text-gray-500 text-lg max-w-2xl mb-8 leading-relaxed font-medium">
                                    Analysez l'engagement de vos stagiaires et gérez votre contenu pédagogique en toute simplicité.
                                </p>

                                <div className="flex flex-wrap gap-4 mb-8">
                                    <div className="flex items-center gap-4 bg-white shadow-sm border border-gray-100 rounded-3xl p-5 min-w-[200px]">
                                        <div className="p-3 bg-[#FEB823]/10 rounded-2xl text-[#FEB823]">
                                            <Video className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black text-gray-900">{totalVideos}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Vidéos publiées</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white shadow-sm border border-gray-100 rounded-3xl p-5 min-w-[200px]">
                                        <div className="p-3 bg-blue-50/50 rounded-2xl text-blue-500 font-bold">
                                            <LayoutDashboard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black text-gray-900">{formationsWithVideos.length}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Formations actives</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Tool */}
                            <div className="w-full md:w-96 shrink-0 mb-2">
                                <div className="relative group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#FEB823] transition-colors" />
                                    <Input 
                                        type="text"
                                        placeholder="Filtrer une leçon..."
                                        className="pl-14 py-8 bg-gray-50/50 border-gray-100 text-gray-900 placeholder:text-gray-300 rounded-[2rem] focus:ring-[#FEB823]/30 focus:border-[#FEB823] transition-all duration-300 text-lg font-medium shadow-inner"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    {filteredFormations.length > 0 ? (
                        <div className="space-y-16 pb-20">
                            {filteredFormations.map((formationGroup) => (
                                <div key={formationGroup.formation_id} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 bg-[#FEB823] rounded-full"></div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight capitalize">
                                                {formationGroup.formation_titre}
                                            </h2>
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-none px-4 py-1.5 rounded-full font-bold">
                                                {formationGroup.videos.length} leçons
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {formationGroup.videos.map((video) => (
                                            <div key={video.id} className="group flex">
                                                <Card className="overflow-hidden border-gray-100 bg-white hover:border-[#FEB823]/30 hover:shadow-2xl hover:shadow-[#FEB823]/10 transition-all duration-500 rounded-[2.5rem] flex flex-col w-full">
                                                    {/* Video Thumbnail */}
                                                    <div className="aspect-[16/10] bg-gray-50 relative overflow-hidden flex items-center justify-center">
                                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                        <Video className="w-16 h-16 text-gray-100 group-hover:scale-110 group-hover:text-[#FEB823]/20 transition-all duration-500" />
                                                        
                                                        <div className="absolute top-5 right-5 z-10">
                                                            <div className="bg-white shadow-xl px-3 py-1.5 rounded-2xl text-[10px] font-black text-gray-800 uppercase tracking-widest border border-gray-50">
                                                                {video.type}
                                                            </div>
                                                        </div>

                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500">
                                                            <Button 
                                                                onClick={() => window.open(video.url, '_blank')}
                                                                className="rounded-full w-16 h-16 bg-[#FEB823] hover:bg-[#FE9E00] shadow-2xl shadow-[#FEB823]/40 border-4 border-white"
                                                            >
                                                                <Play className="w-7 h-7 fill-white text-white translate-x-0.5" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <CardContent className="p-8 flex-1 flex flex-col">
                                                        <div className="flex-1 space-y-3 mb-6">
                                                            <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-[#FE9E00] transition-colors line-clamp-2">
                                                                {video.titre}
                                                            </h3>
                                                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed font-medium">
                                                                {video.description || 'Découvrez les concepts clés à travers ce support vidéo détaillé.'}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                                            <div className="flex items-center text-xs text-gray-300 font-bold">
                                                                <Clock className="w-4 h-4 mr-2" />
                                                                {new Date(video.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </div>

                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-10 px-5 rounded-2xl bg-gray-50 hover:bg-[#FEB823] hover:text-white transition-all font-black text-[10px] uppercase tracking-widest text-[#FEB823]"
                                                                        onClick={() => handleViewStats(video)}
                                                                    >
                                                                        <BarChart3 className="h-4 w-4 mr-2" />
                                                                        Stats
                                                                    </Button>
                                                                </DialogTrigger>
                                                                
                                                                <DialogContent className="max-w-2xl bg-white border-none rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                                                                    <div className="bg-[#FEB823] p-10 relative text-white">
                                                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                                                        <DialogHeader className="relative z-10 flex-row gap-6 items-center">
                                                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/20">
                                                                                <Video className="w-8 h-8 text-white" />
                                                                            </div>
                                                                            <div className="text-left space-y-1">
                                                                                <DialogTitle className="text-3xl font-black tracking-tight leading-none">
                                                                                    {selectedVideo?.titre}
                                                                                </DialogTitle>
                                                                                <p className="text-white/70 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                                                                                    Analytiques d'engagement <div className="w-1 h-1 bg-white/40 rounded-full"></div> {selectedVideo?.type}
                                                                                </p>
                                                                            </div>
                                                                        </DialogHeader>
                                                                    </div>

                                                                    <div className="p-10 bg-[#F8FAFC]">
                                                                        {statsLoading ? (
                                                                            <div className="py-20 flex flex-col items-center gap-6">
                                                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FEB823]"></div>
                                                                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Calcul des métriques...</p>
                                                                            </div>
                                                                        ) : videoStats ? (
                                                                            <div className="space-y-10">
                                                                                {/* Stats Cards */}
                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
                                                                                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
                                                                                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl mb-4">
                                                                                            <Eye className="h-6 w-6" />
                                                                                        </div>
                                                                                        <p className="text-3xl font-black text-gray-900 leading-none mb-1">{videoStats.total_views}</p>
                                                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Vues</p>
                                                                                    </div>

                                                                                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
                                                                                        <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl mb-4">
                                                                                            <Clock className="h-6 w-6" />
                                                                                        </div>
                                                                                        <p className="text-3xl font-black text-gray-900 leading-none mb-1">
                                                                                            {Math.floor(videoStats.total_duration_watched / 60)}
                                                                                        </p>
                                                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Minutes</p>
                                                                                    </div>

                                                                                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
                                                                                        <div className="p-3 bg-green-50 text-green-500 rounded-2xl mb-4">
                                                                                            <CheckCircle className="h-6 w-6" />
                                                                                        </div>
                                                                                        <div className="flex items-baseline gap-1 mb-1">
                                                                                            <p className="text-3xl font-black text-gray-900 leading-none">{videoStats.completion_rate}</p>
                                                                                            <span className="text-lg font-bold text-gray-300">%</span>
                                                                                        </div>
                                                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Rétention</p>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Students Table */}
                                                                                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                                                                                    <div className="flex items-center justify-between mb-8">
                                                                                        <h4 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                                                                            <Users className="w-6 h-6 text-[#FEB823]" />
                                                                                            Activités Stagiaires
                                                                                        </h4>
                                                                                        <div className="bg-gray-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                                                            {videoStats?.views_by_stagiaire?.length || 0} Elèves
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    {videoStats?.views_by_stagiaire?.length > 0 ? (
                                                                                        <div className="space-y-6 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                                                                                            {videoStats.views_by_stagiaire.map((view) => (
                                                                                                <div key={view.id} className="group/item bg-[#F8FAFC]/50 hover:bg-white hover:shadow-lg hover:shadow-gray-200/40 p-5 rounded-[2rem] transition-all duration-300 border border-transparent hover:border-gray-50">
                                                                                                    <div className="flex items-center justify-between mb-4">
                                                                                                        <div className="flex items-center gap-4">
                                                                                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-[#FEB823] text-lg border border-gray-50">
                                                                                                                {view.prenom[0]}
                                                                                                            </div>
                                                                                                            <div>
                                                                                                                <p className="text-base font-black text-gray-900">{view.prenom} {view.nom}</p>
                                                                                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-0.5">
                                                                                                                    {Math.floor(view.total_watched / 60)}m d'écoute
                                                                                                                </p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {view.completed ? (
                                                                                                            <div className="bg-green-50 text-green-500 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                                                                                <CheckCircle className="w-3 h-3" /> Terminé
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <div className="bg-gray-100 text-gray-400 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                                                                                                Partiel
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100/30">
                                                                                                        <div 
                                                                                                            className={`h-full rounded-full transition-all duration-1000 ${view.completed ? 'bg-green-400' : 'bg-[#FEB823]'}`}
                                                                                                            style={{ width: `${Math.min(100, (view.total_watched / 300) * 100)}%` }}
                                                                                                        ></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="py-20 text-center space-y-4">
                                                                                            <Info className="w-10 h-10 text-gray-100 mx-auto" />
                                                                                            <p className="text-gray-300 italic font-bold uppercase tracking-widest text-[10px]">Aucune donnée disponible</p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-40 text-center max-w-sm mx-auto">
                            <div className="w-32 h-32 bg-white shadow-xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-gray-50">
                                <Search className="w-12 h-12 text-[#FEB823] opacity-50" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4">Oups ! <br/> Aucune leçon trouvée</h3>
                            <p className="text-gray-400 mb-10 font-bold uppercase tracking-widest text-[10px]">
                                Vérifiez l'orthographe ou essayez un <br/> nom de formation différent.
                            </p>
                            <Button onClick={() => setSearchQuery('')} className="rounded-[1.5rem] px-10 py-7 h-auto bg-[#FEB823] hover:bg-[#FE9E00] shadow-xl shadow-[#FEB823]/30 font-black uppercase tracking-widest text-xs border-4 border-white">
                                Réinitialiser
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(254, 184, 35, 0.2);
                }
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');
            `}} />
        </Layout>
    );
}

export default FormateurVideosPage;
