import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Eye,
  Inbox,
  Plus,
  Search,
  Trash2,
  BookOpen,
  Clock,
  ChevronDown,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizDetailDialog } from "@/components/formateur/quiz/QuizDetailDialog";

type Formation = { id: number; nom?: string | null };

type QuizListItem = {
  id: number;
  titre: string;
  description?: string | null;
  duree?: number | string | null;
  niveau?: string | null;
  status?: string | null;
  nb_questions?: number | null;
  formation_id?: number | null;
  formation?: Formation | null;
};

type QuizQuestion = {
  id: number;
  question: string;
  type: string;
  astuce?: string | null;
  reponses: { id?: number; reponse: string; correct: boolean }[];
};

type QuizDetail = {
  quiz: QuizListItem;
  questions: QuizQuestion[];
};

function getStatusBadge(status?: string | null) {
  const s = (status || "").toLowerCase();
  switch (s) {
    case 'actif':
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase font-black text-[10px]">Validé</Badge>;
    case 'brouillon':
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200 uppercase font-black text-[10px]">En attente</Badge>;
    case 'inactif':
      return <Badge className="bg-slate-100 text-slate-700 border-slate-200 uppercase font-black text-[10px]">Inactif</Badge>;
    default:
      return <Badge className="bg-slate-100 text-slate-700 border-slate-200 uppercase font-black text-[10px]">{s}</Badge>;
  }
}

export default function FormateurQuizManagementPage() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [expandedFormations, setExpandedFormations] = useState<Record<string, boolean>>({});

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [filterNiveau, setFilterNiveau] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterFormationId, setFilterFormationId] = useState<string>("");

  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState<QuizDetail | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "banque de mots",
    astuce: "",
    reponses: [
      { reponse: "", correct: false },
      { reponse: "", correct: false },
    ],
  });

  const [newQuizData, setNewQuizData] = useState({
    titre: "",
    description: "",
    duree: 30,
    niveau: "débutant",
    formation_id: "",
  });

  const fetchQuizzes = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(p));
      params.append("limit", "400"); // Increased limit as requested
      if (search) params.append("search", search);
      if (filterStatus) params.append("status", filterStatus);
      if (filterFormationId) params.append("formation_id", filterFormationId);

      const res = await api.get(`/formateur/quizzes?${params.toString()}`);
      const payload = res.data?.data || res.data;
      const data = Array.isArray(payload) ? payload : (payload.data || []);
      const meta = payload.meta || {};

      setQuizzes(data);
      setPage(meta.page || 1);
      setLastPage(meta.last_page || 1);
      setTotal(meta.total || data.length);
      
      const newExpanded: Record<string, boolean> = {};
      data.forEach((q: QuizListItem) => {
        newExpanded[q.formation_id || 'unassigned'] = true;
      });
      setExpandedFormations(newExpanded);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterFormationId]);

  const fetchFormations = async () => {
    try {
      const res = await api.get(`/formateur/formations`);
      const payload = res.data?.data || res.data;
      setFormations(payload?.formations || payload?.data || payload || []);
    } catch {
      setFormations([]);
    }
  };

  const openDetail = async (id: number) => {
    try {
        const res = await api.get(`/formateur/quizzes/${id}`);
        const payload = res.data?.data || res.data;
        const quiz = payload?.quiz || payload;
        const questions = payload?.questions || quiz?.questions || [];
        setSelectedQuiz({ quiz, questions });
        setDetailOpen(true);
    } catch (error) {
        console.error("Error fetching quiz details:", error);
    }
  };

  const handlePublishQuiz = async () => {
    if (!selectedQuiz) return;
    try {
      await api.patch(`/formateur/quizzes/${selectedQuiz.quiz.id}`, {
        status: "actif",
      });
      openDetail(selectedQuiz.quiz.id);
      fetchQuizzes(page);
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm("Supprimer cette question ?")) return;
    if (!selectedQuiz) return;
    try {
      await api.delete(`/formateur/quizzes/${selectedQuiz.quiz.id}/questions/${id}`);
      openDetail(selectedQuiz.quiz.id);
      fetchQuizzes(page);
    } catch (error) {
      console.error("Erreur lors de la suppression de la question:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes(1);
  }, [fetchQuizzes]);

  useEffect(() => {
    fetchFormations();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    fetchQuizzes(newPage);
  };

  const groupedQuizzes = useMemo(() => {
     let filtered = quizzes;
     if (filterNiveau) {
        filtered = filtered.filter(q => (q.niveau || "").toLowerCase() === filterNiveau.toLowerCase());
     }
     
     const groups: Record<string, { formation: Formation | null, items: QuizListItem[] }> = {};
     filtered.forEach(q => {
        const key = q.formation_id ? String(q.formation_id) : 'unassigned';
        if (!groups[key]) {
           groups[key] = { 
              formation: q.formation || (q.formation_id ? { id: q.formation_id, nom: `Formation #${q.formation_id}` } : null), 
              items: [] 
           };
        }
        groups[key].items.push(q);
     });
     return groups;
  }, [quizzes, filterNiveau]);

  const toggleFormation = (key: string) => {
    setExpandedFormations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateQuiz = async () => {
    try {
        await api.post(`/formateur/quizzes`, {
          titre: newQuizData.titre,
          description: newQuizData.description,
          duree: newQuizData.duree,
          niveau: newQuizData.niveau,
          formation_id: newQuizData.formation_id || null,
        });
        setCreateOpen(false);
        setNewQuizData({ titre: "", description: "", duree: 30, niveau: "débutant", formation_id: "" });
        fetchQuizzes(1);
    } catch (error) {
        console.error("Error creating quiz:", error);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!window.confirm("Supprimer ce quiz ?")) return;
    try {
        await api.delete(`/formateur/quizzes/${quizId}`);
        fetchQuizzes(page);
    } catch (error) {
        console.error("Error deleting quiz:", error);
    }
  };

  const updateReponse = (idx: number, patch: Partial<{ reponse: string; correct: boolean }>) => {
    setCurrentQuestion((prev) => {
      const copy = [...prev.reponses];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, reponses: copy };
    });
  };

  const handleAddQuestion = async () => {
    if (!selectedQuiz) return;
    try {
        await api.post(`/formateur/quizzes/${selectedQuiz.quiz.id}/questions`, {
          question: currentQuestion.text,
          type: currentQuestion.type,
          astuce: currentQuestion.astuce,
          reponses: currentQuestion.reponses,
        });
        setQuestionOpen(false);
        setCurrentQuestion({
          text: "",
          type: "banque de mots",
          astuce: "",
          reponses: [{ reponse: "", correct: false }, { reponse: "", correct: false }],
        });
        openDetail(selectedQuiz.quiz.id);
    } catch (error) {
        console.error("Error adding question:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        <div className="relative overflow-hidden bg-white border-b border-gray-100 px-8 py-12 md:px-12 md:py-16 shadow-sm mb-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEB823]/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-4 flex-1">
                <Badge className="bg-[#FEB823]/10 text-[#FEB823] border-[#FEB823]/20 py-1 px-3">
                  <Clock className="w-3 h-3 mr-2" /> Atelier de Quiz
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  Gestion des <span className="text-[#FEB823]">Évaluations</span>
                </h1>
                <p className="text-gray-500 font-medium max-w-2xl text-lg leading-relaxed">
                  Consultez et organisez vos banques de questions par formation.
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
                <div className="relative group w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#FEB823] transition-colors" />
                  <Input 
                    placeholder="Rechercher un quiz..." 
                    className="pl-12 py-6 bg-gray-50/50 border-gray-100 rounded-2xl focus:ring-[#FEB823]/20 focus:border-[#FEB823] transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select 
                        className="w-full pl-12 h-14 rounded-2xl bg-gray-50/50 border border-gray-100 font-black text-slate-600 appearance-none focus:ring-[#FEB823]/20 focus:border-[#FEB823] outline-none"
                        value={filterFormationId}
                        onChange={(e) => setFilterFormationId(e.target.value)}
                    >
                        <option value="">Toutes les formations</option>
                        {formations.map(f => (
                            <option key={f.id} value={String(f.id)}>{f.titre}</option>
                        ))}
                    </select>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
                <Button 
                    className="bg-[#FEB823] hover:bg-[#FEB823]/90 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-[#FEB823]/20 transition-all hover:scale-105 active:scale-95"
                    onClick={() => setCreateOpen(true)}
                >
                    <Plus className="w-5 h-5 mr-2" /> Nouveau Quiz
                </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {Object.values(groupedQuizzes).length > 0 ? (
            Object.values(groupedQuizzes).map((group) => (
              <Card key={group.formation?.id || 'unassigned'} className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white mb-8">
                <div 
                    className="bg-slate-50/80 px-10 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer"
                    onClick={() => toggleFormation(String(group.formation?.id || 'unassigned'))}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-white border border-slate-200 shadow-sm flex items-center justify-center font-black text-[#FEB823] text-lg">
                      {(group.formation?.nom || 'D')[0]}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg leading-none">
                        {group.formation?.nom || 'Divers / Non assignés'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="border-[#FEB823]/20 text-[#FEB823] font-bold text-[9px] uppercase tracking-widest px-2">
                          {group.items.length} {group.items.length > 1 ? 'Quizzes' : 'Quiz'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                      <ChevronDown className={`transition-transform duration-300 ${expandedFormations[String(group.formation?.id || 'unassigned')] ? 'rotate-180' : ''}`} />
                  </Button>
                </div>

                <AnimatePresence>
                  {expandedFormations[String(group.formation?.id || 'unassigned')] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader className="bg-white">
                            <TableRow className="border-slate-50">
                              <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-300 py-6 pl-10">Titre</TableHead>
                              <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-300 py-6 text-center">Niveau</TableHead>
                              <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-300 py-6 text-center">Statut</TableHead>
                              <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-300 py-6 text-center">Mécanique</TableHead>
                              <TableHead className="font-black text-[9px] uppercase tracking-widest text-slate-300 py-6 pr-10 text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.items.map((q) => (
                              <TableRow key={q.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                <TableCell className="py-6 pl-10">
                                  <div className="flex flex-col">
                                    <span className="font-black text-sm text-slate-800 uppercase tracking-tight">{q.titre}</span>
                                    <span className="text-[11px] font-medium text-slate-400 truncate max-w-xs">{q.description || 'Apprentissage interactif'}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold text-[9px] uppercase px-3">
                                    {q.niveau}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                  {getStatusBadge(q.status)}
                                </TableCell>
                                <TableCell className="py-6 text-center">
                                  <div className="flex items-center justify-center gap-3">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1"><Clock className="w-3 h-3" /> {q.duree}m</span>
                                      <span className="text-[10px] font-black text-[#FEB823] uppercase tracking-tighter bg-[#FEB823]/5 px-2 py-0.5 rounded-lg border border-[#FEB823]/10">{q.nb_questions || 0} Qs</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6 pr-10 text-right">
                                  <div className="flex justify-end gap-2">
                                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-200 hover:text-[#FEB823] hover:bg-[#FEB823]/5" onClick={(e) => { e.stopPropagation(); openDetail(q.id); }}>
                                          <Eye className="h-5 w-5" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-200 hover:text-rose-500 hover:bg-rose-50" onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(q.id); }}>
                                          <Trash2 className="h-5 w-5" />
                                      </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))
          ) : (
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="py-32 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 mb-6"><Inbox className="w-10 h-10 text-slate-200" /></div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Aucun quiz disponible</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Utilisez le bouton "Nouveau Quiz" pour commencer.</p>
              </CardContent>
            </Card>
          )}

          {lastPage > 1 && !loading && (
            <div className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm shadow-slate-100/50 mt-12 mb-10">
              <div className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
                Page <span className="text-slate-900 border-b-2 border-[#FEB823] pb-0.5">{page}</span> sur {lastPage}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-xl px-6 font-black uppercase text-[10px] border-slate-100 text-slate-400 hover:bg-[#FEB823] hover:text-white" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>Précédent</Button>
                <Button className="rounded-xl px-6 font-black uppercase text-[10px] bg-[#FEB823] text-white shadow-lg shadow-[#FEB823]/20 hover:bg-[#FEB823]/90" onClick={() => handlePageChange(page + 1)} disabled={page >= lastPage}>Suivant</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <QuizDetailDialog 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
        selectedQuiz={selectedQuiz} 
        onPublish={handlePublishQuiz} 
        onAddQuestion={() => setQuestionOpen(true)} 
        onDeleteQuestion={handleDeleteQuestion} 
      />
      
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="rounded-[3.5rem] p-0 overflow-hidden outline-none bg-white border-0 max-w-xl shadow-2xl">
              <div className="bg-[#FEB823] p-10 pt-16 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <DialogTitle className="text-3xl font-black uppercase relative z-10">Creer un Nouveau Quiz</DialogTitle>
                <p className="text-white/80 font-bold text-xs uppercase tracking-widest mt-2 relative z-10">Paramétrez votre évaluation interactif</p>
              </div>
              <div className="p-10 space-y-6 bg-slate-50/30">
                  <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Titre du Quiz</Label>
                      <Input value={newQuizData.titre} onChange={(e) => setNewQuizData(p => ({ ...p, titre: e.target.value }))} placeholder="Ex: Maîtrise de React hooks" className="h-16 rounded-[1.5rem] font-bold border-slate-100 focus:ring-[#FEB823]/20 px-6" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Niveau</Label>
                         <select className="w-full h-16 rounded-[1.5rem] px-6 font-bold bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-[#FEB823]/10" value={newQuizData.niveau} onChange={(e) => setNewQuizData(p => ({ ...p, niveau: e.target.value }))}>
                             <option value="débutant">Débutant</option>
                             <option value="intermédiaire">Intermédiaire</option>
                             <option value="avancé">Avancé</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Durée (min)</Label>
                         <Input type="number" value={newQuizData.duree} onChange={(e) => setNewQuizData(p => ({ ...p, duree: Number(e.target.value) }))} className="h-16 rounded-[1.5rem] text-center font-bold border-slate-100" />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Formation associée</Label>
                      <select className="w-full h-16 rounded-[1.5rem] px-6 font-bold bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-[#FEB823]/10" value={newQuizData.formation_id} onChange={(e) => setNewQuizData(p => ({ ...p, formation_id: e.target.value }))}>
                          <option value="">Sélectionner une formation...</option>
                          {formations.map(f => <option key={f.id} value={String(f.id)}>{f.nom}</option>)}
                      </select>
                  </div>

                  <Button className="w-full h-16 rounded-[1.5rem] bg-[#FEB823] text-white font-black uppercase shadow-xl shadow-[#FEB823]/20 hover:bg-[#FEB823]/90 transition-all active:scale-[0.98] mt-4" onClick={handleCreateQuiz}>Générer le module</Button>
              </div>
          </DialogContent>
      </Dialog>

      <Dialog open={questionOpen} onOpenChange={setQuestionOpen}>
        <DialogContent className="rounded-[3.5rem] p-0 overflow-hidden outline-none bg-white border-0 max-w-2xl shadow-2xl">
          <div className="bg-[#FEB823] p-10 pt-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <DialogTitle className="text-3xl font-black uppercase relative z-10">Nouvelle Question</DialogTitle>
            <p className="text-white/80 font-bold text-xs uppercase tracking-widest mt-2 relative z-10">Enrichissez votre banque pédagogique</p>
          </div>
          
          <div className="p-10 space-y-6 bg-slate-50/30 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Enoncé de la question</Label>
              <Textarea 
                value={currentQuestion.text} 
                onChange={(e) => setCurrentQuestion(p => ({ ...p, text: e.target.value }))} 
                placeholder="Saisissez votre question ici..." 
                className="min-h-[100px] rounded-[1.5rem] font-bold border-slate-100 focus:ring-[#FEB823]/20 px-6 py-4" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Note Pédagogique (Astuce)</Label>
              <Input 
                value={currentQuestion.astuce} 
                onChange={(e) => setCurrentQuestion(p => ({ ...p, astuce: e.target.value }))} 
                placeholder="Un conseil pour aider le stagiaire..." 
                className="h-14 rounded-[1.25rem] font-bold border-slate-100 focus:ring-[#FEB823]/20 px-6" 
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Réponses possibles</Label>
              {currentQuestion.reponses.map((r, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <Input 
                    value={r.reponse} 
                    onChange={(e) => updateReponse(idx, { reponse: e.target.value })} 
                    placeholder={`Option ${idx + 1}`} 
                    className="h-14 rounded-[1.25rem] font-bold border-slate-100 flex-1 px-6" 
                  />
                  <Button 
                    type="button"
                    variant={r.correct ? "default" : "outline"}
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${r.correct ? 'bg-[#FEB823] hover:bg-[#FEB823]/90 border-none' : 'border-slate-100 text-slate-300'}`}
                    onClick={() => updateReponse(idx, { correct: !r.correct })}
                  >
                    <CheckCircle2 className={`w-6 h-6 ${r.correct ? 'text-white' : 'text-slate-200'}`} />
                  </Button>
                  {currentQuestion.reponses.length > 2 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-200 hover:text-rose-500"
                      onClick={() => setCurrentQuestion(p => ({ ...p, reponses: p.reponses.filter((_, i) => i !== idx) }))}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl border-dashed border-2 text-slate-400 font-bold uppercase text-[10px] hover:bg-slate-50"
                onClick={() => setCurrentQuestion(p => ({ ...p, reponses: [...p.reponses, { reponse: "", correct: false }] }))}
              >
                + Ajouter une option
              </Button>
            </div>

            <Button 
              className="w-full h-16 rounded-[1.5rem] bg-[#FEB823] text-white font-black uppercase shadow-xl shadow-[#FEB823]/20 hover:bg-[#FEB823]/90 transition-all active:scale-[0.98] mt-6" 
              onClick={handleAddQuestion}
              disabled={!currentQuestion.text || currentQuestion.reponses.filter(r => r.correct).length === 0}
            >
              Enregistrer la question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
