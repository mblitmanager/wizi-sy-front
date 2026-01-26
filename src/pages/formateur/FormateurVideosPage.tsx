import React, { useEffect, useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Video, 
    Play, 
    Eye, 
    Users, 
    BarChart3, 
    Search, 
    Clock, 
    CheckCircle, 
    Info, 
    ChevronDown, 
    LayoutDashboard,
    Inbox,
    BookOpen,
    Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from "framer-motion";

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
    percentage?: number;
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
    const [selectedFormationId, setSelectedFormationId] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFormations, setExpandedFormations] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/formateur/formations-videos');
            const data = response.data.data || response.data;
            setFormationsWithVideos(data || []);
            
            // Expand all by default
            const expanded: Record<string, boolean> = {};
            (data || []).forEach((g: FormationVideoGroup) => {
                expanded[String(g.formation_id)] = true;
            });
            setExpandedFormations(expanded);
        } catch (err) {
            console.error('Erreur chargement vidéos:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVideoStats = async (videoId: number) => {
        setStatsLoading(true);
        try {
            const response = await api.get(`/formateur/video/${videoId}/stats`);
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

    const toggleFormation = (id: string) => {
        setExpandedFormations(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredFormations = useMemo(() => {
        return formationsWithVideos
            .filter(group => selectedFormationId === 'all' || group.formation_id.toString() === selectedFormationId)
            .map(group => ({
                ...group,
                videos: group.videos.filter(v => 
                    v.titre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))
                )
            })).filter(group => group.videos.length > 0);
    }, [formationsWithVideos, selectedFormationId, searchQuery]);


    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FEB823]"></div>
                        <p className="text-muted-foreground animate-pulse font-bold uppercase text-xs tracking-widest">Chargement bibliothèque...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const totalVideos = formationsWithVideos.reduce((acc, g) => acc + g.videos.length, 0);

    return (
        <Layout>
            <div className="min-h-screen bg-[#F8FAFC] pb-20">
                {/* Hero Section - Suivi Demandes style */}
                <div className="relative overflow-hidden bg-white border-b border-gray-100 px-8 py-12 md:px-12 md:py-16 shadow-sm mb-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEB823]/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-4 flex-1">
                                <Badge className="bg-[#FEB823]/10 text-[#FEB823] border-[#FEB823]/20 py-1 px-3">
                                    <Video className="w-3 h-3 mr-2" /> Bibliothèque Médias
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                    Vos Contenus <span className="text-[#FEB823]">Vidéos</span>
                                </h1>
                                <p className="text-gray-500 font-medium max-w-2xl text-lg leading-relaxed">
                                    Analysez l'engagement de vos stagiaires et gérez votre catalogue pédagogique.
                                </p>
                                
                                <div className="flex flex-wrap gap-4 mt-6">
                                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[180px]">
                                        <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900">{totalVideos}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Vidéos</p>
                                        </div>
                                    </div>
                                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[180px]">
                                        <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                                            <LayoutDashboard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900">{formationsWithVideos.length}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Formations</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
                                <div className="relative group w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#FEB823] transition-colors" />
                                    <Input 
                                        placeholder="Rechercher une leçon..." 
                                        className="pl-12 py-6 bg-gray-50/50 border-gray-100 rounded-2xl focus:ring-[#FEB823]/20 focus:border-[#FEB823] transition-all font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    <select 
                                        className="w-full pl-12 h-14 rounded-2xl bg-gray-50/50 border border-gray-100 font-black text-slate-600 appearance-none focus:ring-[#FEB823]/20 focus:border-[#FEB823] outline-none cursor-pointer shadow-inner"
                                        value={selectedFormationId}
                                        onChange={(e) => setSelectedFormationId(e.target.value)}
                                    >
                                        <option value="all">Toutes les formations</option>
                                        {formationsWithVideos.map(group => (
                                            <option key={group.formation_id} value={group.formation_id.toString()}>
                                                {group.formation_titre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    {filteredFormations.length > 0 ? (
                        filteredFormations.map((group) => (
                            <div key={group.formation_id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Group Header */}
                                <div 
                                    className="flex items-center justify-between mb-8 cursor-pointer group"
                                    onClick={() => toggleFormation(String(group.formation_id))}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-1.5 h-12 bg-[#FEB823] rounded-full group-hover:scale-y-110 transition-transform"></div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-[#FEB823] transition-colors uppercase">
                                                {group.formation_titre}
                                            </h2>
                                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 pl-0.5">
                                                {group.videos.length} Modules Vidéos
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-[#FEB823] hover:bg-amber-50 rounded-xl">
                                        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${expandedFormations[String(group.formation_id)] ? 'rotate-180' : ''}`} />
                                    </Button>
                                </div>

                                <AnimatePresence>
                                    {expandedFormations[String(group.formation_id)] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
                                                {group.videos.map((video) => (
                                                    <motion.div 
                                                        key={video.id} 
                                                        whileHover={{ y: -5 }}
                                                        className="group flex"
                                                    >
                                                        <Card className="overflow-hidden border-none bg-white shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-[#FEB823]/10 transition-all duration-500 rounded-[2.5rem] flex flex-col w-full">
                                                            {/* Video Thumbnail Area */}
                                                            <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                                                                
                                                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                                    <Video className="w-8 h-8 text-slate-300 group-hover:text-[#FEB823] transition-colors" />
                                                                </div>
                                                                
                                                                <div className="absolute top-5 right-5 z-20">
                                                                    <div className="bg-white/90 backdrop-blur-md shadow-lg px-3 py-1.5 rounded-xl text-[9px] font-black text-slate-800 uppercase tracking-widest border border-white">
                                                                        {video.type}
                                                                    </div>
                                                                </div>

                                                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500">
                                                                    <Button 
                                                                        onClick={() => {
                                                                            const finalUrl = video.url.startsWith('http') 
                                                                                ? video.url 
                                                                                : `${import.meta.env.VITE_API_URL_MEDIA}/${video.url}`;
                                                                            window.open(finalUrl, '_blank');
                                                                        }}
                                                                        className="rounded-full w-14 h-14 bg-[#FEB823] hover:bg-[#FE9E00] shadow-2xl shadow-[#FEB823]/40 border-4 border-white"
                                                                    >
                                                                        <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <CardContent className="p-8 flex-1 flex flex-col">
                                                                <div className="flex-1 space-y-3 mb-6">
                                                                    <h3 className="text-lg font-black leading-tight text-slate-900 group-hover:text-[#FE9E00] transition-colors line-clamp-2 uppercase tracking-tight">
                                                                        {video.titre}
                                                                    </h3>
                                                                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-bold">
                                                                        {video.description || 'Découvrez les concepts clés à travers ce support vidéo détaillé.'}
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                                                                    <div className="flex items-center text-[10px] text-slate-300 font-black uppercase tracking-tighter">
                                                                        <Clock className="w-3.5 h-3.5 mr-2 text-slate-200" />
                                                                        {new Date(video.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                    </div>

                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-9 px-4 rounded-xl bg-slate-50 hover:bg-[#FEB823] hover:text-white transition-all font-black text-[9px] uppercase tracking-widest text-[#FEB823]"
                                                                                onClick={() => handleViewStats(video)}
                                                                            >
                                                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                                                Analyses
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        
                                                                        <DialogContent className="max-w-2xl bg-white border-none rounded-[3.5rem] p-0 overflow-hidden shadow-2xl outline-none">
                                                                            <div className="bg-[#FEB823] p-10 pt-16 relative text-white">
                                                                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                                                                <DialogHeader className="relative z-10 flex-row gap-6 items-center">
                                                                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                                                                                        <BarChart3 className="w-8 h-8 text-white" />
                                                                                    </div>
                                                                                    <div className="text-left space-y-1">
                                                                                        <p className="text-white/60 font-black uppercase text-[10px] tracking-[0.2em]">Rapport d'engagement</p>
                                                                                        <DialogTitle className="text-3xl font-black tracking-tight leading-none uppercase">
                                                                                            {selectedVideo?.titre}
                                                                                        </DialogTitle>
                                                                                    </div>
                                                                                </DialogHeader>
                                                                            </div>

                                                                            <div className="p-10 bg-slate-50/50">
                                                                                {statsLoading ? (
                                                                                    <div className="py-20 flex flex-col items-center gap-6">
                                                                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FEB823]"></div>
                                                                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Traitement des données...</p>
                                                                                    </div>
                                                                                ) : videoStats ? (
                                                                                    <div className="space-y-10">
                                                                                        {/* Stats Summary Cards */}
                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                                                                                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl mb-4">
                                                                                                    <Eye className="h-6 w-6" />
                                                                                                </div>
                                                                                                <p className="text-3xl font-black text-slate-900 leading-none mb-1">{videoStats.total_views}</p>
                                                                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Vues totales</p>
                                                                                            </div>

                                                                                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                                                                                <div className="p-3 bg-purple-50 text-purple-500 rounded-xl mb-4">
                                                                                                    <Clock className="h-6 w-6" />
                                                                                                </div>
                                                                                                <p className="text-3xl font-black text-slate-900 leading-none mb-1">
                                                                                                    {Math.floor(videoStats.total_duration_watched / 60)}
                                                                                                </p>
                                                                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Temps (min)</p>
                                                                                            </div>

                                                                                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                                                                                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl mb-4">
                                                                                                    <CheckCircle className="h-6 w-6" />
                                                                                                </div>
                                                                                                <div className="flex items-baseline gap-1 mb-1">
                                                                                                    <p className="text-3xl font-black text-slate-900 leading-none">{videoStats.completion_rate}</p>
                                                                                                    <span className="text-lg font-bold text-slate-300">%</span>
                                                                                                </div>
                                                                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Complétion</p>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Detailed List */}
                                                                                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                                                                                            <div className="flex items-center justify-between mb-8 md:px-2">
                                                                                                <h4 className="text-lg font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                                                                                                    <Users className="w-5 h-5 text-[#FEB823]" />
                                                                                                    Suivi Stagiaires
                                                                                                </h4>
                                                                                                <Badge className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[9px] font-black border-none uppercase">
                                                                                                    {videoStats?.views_by_stagiaire?.length || 0} Visionnage(s)
                                                                                                </Badge>
                                                                                            </div>
                                                                                            
                                                                                            {videoStats?.views_by_stagiaire?.length > 0 ? (
                                                                                                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                                                                                    {videoStats.views_by_stagiaire.map((view) => (
                                                                                                        <div key={view.id} className="group/item bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 p-6 rounded-[1.75rem] transition-all duration-300 border border-transparent hover:border-slate-100">
                                                                                                            <div className="flex items-center justify-between mb-5">
                                                                                                                <div className="flex items-center gap-4">
                                                                                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-[#FEB823] text-lg border border-slate-50 group-hover/item:scale-110 transition-transform">
                                                                                                                        {view.prenom[0]}
                                                                                                                    </div>
                                                                                                                    <div>
                                                                                                                        <p className="text-base font-black text-slate-900 leading-tight uppercase tracking-tight">{view.prenom} {view.nom}</p>
                                                                                                                        <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest mt-1">
                                                                                                                            {Math.floor(view.total_watched / 60)}m visionnés • {view.percentage || 0}%
                                                                                                                        </p>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                {view.completed ? (
                                                                                                                    <div className="bg-emerald-50 text-emerald-500 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100/50">
                                                                                                                        <CheckCircle className="w-3 h-3" /> Terminé
                                                                                                                    </div>
                                                                                                                ) : (
                                                                                                                    <div className="bg-amber-50 text-amber-500 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-amber-100/30">
                                                                                                                        En cours
                                                                                                                    </div>
                                                                                                                )}
                                                                                                            </div>
                                                                                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                                                                <motion.div 
                                                                                                                    initial={{ width: 0 }}
                                                                                                                    animate={{ width: `${Math.min(100, view.percentage || (view.total_watched / 300) * 100)}%` }}
                                                                                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                                                                                    className={`h-full rounded-full ${view.completed ? 'bg-emerald-400' : 'bg-[#FEB823]'}`}
                                                                                                                ></motion.div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="py-20 text-center space-y-4">
                                                                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                                                                                                        <Info className="w-8 h-8 text-slate-200" />
                                                                                                    </div>
                                                                                                    <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Aucune donnée analysée</p>
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
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    ) : (
                        <div className="py-40 text-center max-w-sm mx-auto">
                            <div className="w-32 h-32 bg-white shadow-2xl shadow-slate-200/50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-slate-50 group">
                                <Search className="w-12 h-12 text-slate-200 group-hover:text-[#FEB823] transition-colors" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Aucun résultat</h3>
                            <p className="text-slate-400 mb-10 font-bold uppercase tracking-[0.15em] text-[10px] leading-relaxed px-10">
                                Nous n'avons pas trouvé de leçons <br/> correspondant à votre recherche.
                            </p>
                            <Button onClick={() => {setSearchQuery(''); setSelectedFormationId('all')}} className="rounded-2xl px-10 py-7 h-auto bg-[#FEB823] hover:bg-[#FE9E00] shadow-xl shadow-[#FEB823]/20 font-black uppercase tracking-widest text-xs border-4 border-white transition-all active:scale-95">
                                Réinitialiser les filtres
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(15, 23, 42, 0.05);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(254, 184, 35, 0.3);
                }
            `}} />
        </Layout>
    );
}

export default FormateurVideosPage;
