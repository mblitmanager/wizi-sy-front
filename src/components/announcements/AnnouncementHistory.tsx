import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Announcement, AnnouncementService } from "@/services/AnnouncementService";
import { Users, Star, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

export const AnnouncementHistory = ({ refreshTrigger }: { refreshTrigger?: number }) => {
    const [history, setHistory] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadHistory();
    }, [refreshTrigger]);

    const loadHistory = async () => {
        try {
            const response = await AnnouncementService.getHistory();
            // Laravel pagination returns: { data: [...], current_page: 1, ... }
            // Axios returns: response.data = { data: [...], ... }
            // So we need response.data.data
            setHistory(response.data.data as Announcement[]);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click if any
        setDeletingId(id);
        
        try {
            await AnnouncementService.deleteAnnouncement(id);
            toast.success("Annonce supprimée");
            loadHistory(); // Refresh
        } catch (error) {
            console.error("Failed to delete", error);
            toast.error("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="text-white">Chargement de l'historique...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Historique Récent</h2>
                <button className="text-sm text-yellow-500 hover:text-yellow-400">Voir tout</button>
            </div>

            <div className="space-y-3">
                {history.length === 0 ? (
                    <div className="text-gray-500 text-sm">Aucune annonce trouvée.</div>
                ) : (
                    history.map((item) => (
                        <Card key={item.id} className="p-4     transition-colors relative group">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-white">{item.title}</h3>
                                <div className="flex items-center gap-2">
                                     <span className={`px-2 py-1 rounded text-[10px] font-medium border ${
                                        item.status === 'sent' 
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                    }`}>
                                        {item.status === 'sent' ? (
                                            <span className="flex items-center gap-1"><CheckCircle size={10} /> ENVOYÉ</span>
                                        ) : (
                                            <span className="flex items-center gap-1"><Clock size={10} /> PROGRAMMÉ</span>
                                        )}
                                    </span>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="  ">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Supprimer l'annonce ?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-gray-400">
                                                    {item.status === 'scheduled' 
                                                        ? "Cette annonce est programmée. La supprimer annulera l'envoi."
                                                        : "Cette annonce a déjà été envoyée. Elle sera retirée de votre historique seulement."}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className=" text-white  ">Annuler</AlertDialogCancel>
                                                <AlertDialogAction 
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                    onClick={(e) => handleDelete(item.id, e)}
                                                >
                                                    {deletingId === item.id ? "Suppression..." : "Confirmer"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                                {item.message}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {item.status === 'scheduled' && item.scheduled_at 
                                        ? `Prévu le : ${new Date(item.scheduled_at).toLocaleDateString('fr-FR', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}`
                                        : new Date(item.created_at).toLocaleDateString('fr-FR', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })
                                    }
                                </div>
                                <div className="flex items-center gap-1">
                                    {item.target_audience === 'formateurs' ? <Star size={12} className="text-yellow-500" /> : <Users size={12} />}
                                    <span className={item.target_audience === 'formateurs' ? 'text-yellow-500' : ''}>
                                        {item.target_audience === 'all' && 'Tous les utilisateurs'}
                                        {item.target_audience === 'formateurs' && 'Formateurs'}
                                        {item.target_audience === 'stagiaires' && 'Stagiaires'}
                                        {item.target_audience === 'autres' && 'Autres'}
                                        {item.target_audience === 'specific_users' && 'Spécifique'}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
