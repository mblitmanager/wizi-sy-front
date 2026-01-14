import * as React from 'react';
import { useEffect, useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { challengeService, Challenge } from "@/services/ChallengeService";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const ChallengesPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  const [formData, setFormData] = useState<Partial<Challenge>>({
    titre: '',
    description: '',
    points: 10,
    date_debut: '',
    date_fin: ''
  });

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await challengeService.getAll(1, 100); // Fetch mostly all for now
      setChallenges(data.items);
    } catch (error) {
      toast.error("Erreur lors du chargement des défis");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleOpenModal = (challenge?: Challenge) => {
    if (challenge) {
      setEditingChallenge(challenge);
      setFormData({
        titre: challenge.titre,
        description: challenge.description,
        points: challenge.points,
        date_debut: challenge.date_debut?.split('T')[0],
        date_fin: challenge.date_fin?.split('T')[0]
      });
    } else {
      setEditingChallenge(null);
      setFormData({
        titre: '',
        description: '',
        points: 10,
        date_debut: new Date().toISOString().split('T')[0],
        date_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChallenge) {
        await challengeService.update(editingChallenge.id, formData);
        toast.success("Défi mis à jour avec succès");
      } else {
        await challengeService.create(formData);
        toast.success("Défi créé avec succès");
      }
      setModalOpen(false);
      fetchChallenges();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce défi ?")) {
      try {
        await challengeService.delete(id);
        toast.success("Défi supprimé");
        fetchChallenges();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des Défis</h1>
            <p className="text-muted-foreground">Créez et gérez les challenges pour vos apprenants.</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Défi
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <Award className="h-5 w-5" />
                        </div>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(challenge)}>
                                <Edit className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(challenge.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{challenge.titre}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                        {challenge.description || "Pas de description"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {challenge.date_debut ? format(new Date(challenge.date_debut), 'dd MMM', { locale: fr }) : '?'} 
                                {' - '}
                                {challenge.date_fin ? format(new Date(challenge.date_fin), 'dd MMM', { locale: fr }) : '?'}
                            </span>
                        </div>
                        <div className="ml-auto font-medium text-orange-600 px-2 py-0.5 bg-orange-50 rounded">
                            {challenge.points} pts
                        </div>
                    </div>
                </div>
            ))}
            
            {challenges.length === 0 && !loading && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Aucun défi trouvé. Commencez par en créer un !</p>
                </div>
            )}
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingChallenge ? 'Modifier le défi' : 'Créer un nouveau défi'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre</Label>
                <Input 
                  id="titre" 
                  value={formData.titre} 
                  onChange={(e) => setFormData({...formData, titre: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  rows={3} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input 
                    id="points" 
                    type="number" 
                    min="1"
                    value={formData.points} 
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date_debut">Date de début</Label>
                    <Input 
                        id="date_debut" 
                        type="date" 
                        value={formData.date_debut} 
                        onChange={(e) => setFormData({...formData, date_debut: e.target.value})} 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date_fin">Date de fin</Label>
                    <Input 
                        id="date_fin" 
                        type="date" 
                        value={formData.date_fin} 
                        onChange={(e) => setFormData({...formData, date_fin: e.target.value})} 
                        required 
                    />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ChallengesPage;
