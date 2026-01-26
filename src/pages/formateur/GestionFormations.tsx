import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { BookOpen, Users, Clock, Video, Eye, UserPlus, Search, X, Check, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Formation {
  id: number;
  titre: string;
  description?: string;
  categorie: string;
  duree?: string;
  image_url?: string;
  nb_stagiaires?: number;
  nb_videos?: number;
  duree_estimee?: number;
}

interface Stagiaire {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  progress?: number;
}

interface FormationStats {
  student_count?: number;
  avg_score?: number;
  total_completions?: number;
  total_stagiaires?: number;
  completed?: number;
  in_progress?: number;
  not_started?: number;
}

export default function GestionFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [unassignedStagiaires, setUnassignedStagiaires] = useState<Stagiaire[]>([]);
  const [selectedStagiaires, setSelectedStagiaires] = useState<number[]>([]);
  const [formationStagiaires, setFormationStagiaires] = useState<Stagiaire[]>([]);
  const [formationStats, setFormationStats] = useState<FormationStats | null>(null);

  useEffect(() => {
    loadFormations();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredFormations(
        formations.filter(
          (f) =>
            f.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.categorie?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredFormations(formations);
    }
  }, [searchQuery, formations]);

  const loadFormations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/formateur/formations/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormations(res.data.formations || []);
      setFilteredFormations(res.data.formations || []);
    } catch (error) {
      console.error('Error loading formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = async (formation: Formation) => {
    setSelectedFormation(formation);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API_URL}/formateur/stagiaires/unassigned/${formation.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnassignedStagiaires(res.data.stagiaires || []);
      setAssignDialogOpen(true);
    } catch (error) {
      console.error('Error loading unassigned:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedFormation) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/formateur/formations/${selectedFormation.id}/assign`,
        { stagiaire_ids: selectedStagiaires },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignDialogOpen(false);
      setSelectedStagiaires([]);
      loadFormations();
    } catch (error) {
      console.error('Error assigning:', error);
    }
  };

  const handleViewDetails = async (formation: Formation) => {
    setSelectedFormation(formation);
    try {
      const token = localStorage.getItem('token');
      const [stagRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/formateur/formations/${formation.id}/stagiaires`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/formateur/formations/${formation.id}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setFormationStagiaires(stagRes.data.stagiaires || []);
      setFormationStats(statsRes.data || null);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error loading details:', error);
    }
  };

  const toggleStagiaire = (id: number) => {
    setSelectedStagiaires((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
            <p className="text-sm text-gray-500 mt-1">Gérez vos catalogues et assignations</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-full w-20" />
                  <div className="h-6 bg-gray-100 rounded-full w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredFormations.map((formation, index) => (
                <motion.div
                  key={formation.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 p-5 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
                      <BookOpen className="h-5 w-5 text-orange-500" />
                    </div>
                    <Badge variant="outline" className="text-xs font-medium text-gray-500 border-gray-200">
                      {formation.categorie || 'Général'}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {formation.titre}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{formation.nb_stagiaires || 0} stagiaires</span>
                    </div>
                    {formation.nb_videos && (
                      <div className="flex items-center gap-1">
                        <Video className="h-3.5 w-3.5" />
                        <span>{formation.nb_videos} vidéos</span>
                      </div>
                    )}
                    {formation.duree && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formation.duree}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleViewDetails(formation)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Détails
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs bg-orange-500 hover:bg-orange-600"
                      onClick={() => handleAssignClick(formation)}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                      Assigner
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFormations.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune formation trouvée</h3>
            <p className="text-sm text-gray-500">Modifiez votre recherche ou ajoutez de nouvelles formations.</p>
          </div>
        )}
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-orange-500" />
              Assigner des stagiaires
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-4">
            Formation: <span className="font-medium text-gray-900">{selectedFormation?.titre}</span>
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {unassignedStagiaires.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucun stagiaire disponible</p>
            ) : (
              unassignedStagiaires.map((stagiaire) => (
                <div
                  key={stagiaire.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleStagiaire(stagiaire.id)}
                >
                  <Checkbox checked={selectedStagiaires.includes(stagiaire.id)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {stagiaire.prenom} {stagiaire.nom}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{stagiaire.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              onClick={handleAssign}
              disabled={selectedStagiaires.length === 0}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Assigner ({selectedStagiaires.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              {selectedFormation?.titre}
            </DialogTitle>
          </DialogHeader>

          {/* Stats Grid */}
          {formationStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-700">{formationStats.student_count || formationStats.total_stagiaires || 0}</p>
                <p className="text-xs text-blue-600 font-medium">Total</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <Target className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-700">{formationStats.total_completions || formationStats.completed || 0}</p>
                <p className="text-xs text-green-600 font-medium">Terminé</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
                <TrendingUp className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-700">{formationStats.in_progress || 0}</p>
                <p className="text-xs text-amber-600 font-medium">En cours</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <BarChart3 className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-700">{formationStats.avg_score?.toFixed(1) || 0}%</p>
                <p className="text-xs text-purple-600 font-medium">Moyenne</p>
              </div>
            </div>
          )}

          {/* Stagiaires List */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              Stagiaires inscrits ({formationStagiaires.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {formationStagiaires.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Aucun stagiaire inscrit</p>
              ) : (
                formationStagiaires.map((stagiaire) => (
                  <div key={stagiaire.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                      {stagiaire.prenom?.[0]}{stagiaire.nom?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {stagiaire.prenom} {stagiaire.nom}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={stagiaire.progress || 0} className="h-1.5 flex-1" />
                        <span className="text-xs text-gray-500 font-medium">{stagiaire.progress || 0}%</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                setDetailsDialogOpen(false);
                if (selectedFormation) handleAssignClick(selectedFormation);
              }}
            >
              <UserPlus className="h-4 w-4 mr-1.5" />
              Ajouter des stagiaires
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
