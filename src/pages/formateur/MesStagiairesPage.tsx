import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ChevronRight, Users, Inbox, Mail, Phone } from 'lucide-react';
import { api } from '@/lib/api';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Stagiaire {
  id: number;
  name: string;
  prenom?: string;
  nom?: string;
  email: string;
  telephone?: string;
  image?: string;
  total_points: number;
  completion_rate: number;
}


export default function MesStagiairesPage() {
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [filteredStagiaires, setFilteredStagiaires] = useState<Stagiaire[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStagiaires(stagiaires);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStagiaires(
        stagiaires.filter(
          (s) =>
            s.name?.toLowerCase().includes(query) ||
            s.email?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, stagiaires]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Using the performance endpoint which returns the list of students with stats
      // as used in Flutter app (mapped to /analytics/performance)
      const response = await api.get('/formateur/analytics/performance');
      const data = response.data;
      // API returns { performance: [...], rankings: {...} } or just [...] depend on controller version
      // In FormateurController.ts verified earlier, it returns { performance: [...], rankings: ... }
      const list = data.performance || (Array.isArray(data) ? data : []);
      
      setStagiaires(list);
      setFilteredStagiaires(list);
    } catch (error) {
      console.error('Erreur chargement stagiaires:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-brand-primary" />
              Mes Stagiaires
            </h1>
            <p className="text-muted-foreground">
              Gérez et suivez la progression de vos apprenants.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="p-4 bg-card border-border shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un apprenant par nom ou email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
          </Card>

          {/* List */}
          {loading ? (
             <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <Card key={i} className="p-4 h-20 animate-pulse bg-muted/20" />
               ))}
             </div>
          ) : filteredStagiaires.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="p-4 rounded-full bg-muted/20">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Aucun stagiaire trouvé</h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery ? "Aucun résultat pour votre recherche." : "Vous n'avez pas encore de stagiaires assignés."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredStagiaires.map((stagiaire, index) => (
                  <motion.div
                    key={stagiaire.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="group p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-border hover:border-brand-primary/50"
                      onClick={() => {
                        navigate(`/formateur/stagiaire/${stagiaire.id}`);
                      }}

                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border border-border">
                          <AvatarImage src={stagiaire.image} alt={stagiaire.name} />
                          <AvatarFallback className="bg-brand-primary/10 text-brand-primary-dark font-bold">
                            {stagiaire.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-brand-primary transition-colors">
                            {stagiaire.prenom && stagiaire.nom 
                              ? `${stagiaire.prenom} ${stagiaire.nom}` 
                              : stagiaire.name}
                          </h3>
                          <div className="flex flex-col gap-0.5 mt-1">
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="truncate">{stagiaire.email}</span>
                             </div>
                             {stagiaire.telephone && (
                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="h-3.5 w-3.5" />
                                  <span className="truncate">{stagiaire.telephone}</span>
                               </div>
                             )}
                          </div>
                        </div>


                        <div className="hidden sm:flex flex-col items-end gap-1 mr-4">
                           <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Points</span>
                           <span className="font-bold text-brand-primary-dark">{stagiaire.total_points} XP</span>
                        </div>

                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
