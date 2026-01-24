import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { 
  CheckCircle2, 
  Inbox, 
  Plus, 
  Trash2, 
  Sparkles, 
  Clock, 
  Target, 
  BookOpen, 
  Lightbulb,
  FileText,
  X,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type QuizQuestion = {
  id: number;
  question: string;
  type: string;
  astuce?: string | null;
  reponses: { id?: number; reponse: string; correct: boolean }[];
};

type QuizListItem = {
  id: number;
  titre: string;
  description?: string | null;
  duree?: number | string | null;
  niveau?: string | null;
  status?: string | null;
  nb_questions?: number | null;
  formation_id?: number | null;
};

type QuizDetail = {
  quiz: QuizListItem;
  questions: QuizQuestion[];
};

interface QuizDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuiz: QuizDetail | null;
  loading?: boolean;
  onPublish: () => void;
  onAddQuestion: () => void;
  onDeleteQuestion: (id: number) => void;
}

export function QuizDetailDialog({
  open,
  onOpenChange,
  selectedQuiz,
  loading = false,
  onPublish,
  onAddQuestion,
  onDeleteQuestion,
}: QuizDetailDialogProps) {
  if (!selectedQuiz && !loading) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#F8FAFC] border-0 text-slate-900 rounded-[3rem] shadow-2xl p-0 overflow-hidden outline-none">
        
        {/* Header Section (Suivi Demandes Style) */}
        <div className="relative overflow-hidden bg-white border-b border-gray-100 p-10 pt-16 shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEB823]/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                    <Badge className="bg-[#FEB823]/10 text-[#FEB823] border-[#FEB823]/20 py-1 px-3">
                        <ClipboardList className="w-3 h-3 mr-2" /> Détails de l'Atelier
                    </Badge>
                    <DialogTitle className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        {selectedQuiz?.quiz.titre || "Focus Quiz"} <span className="text-[#FEB823]">Pédagogique</span>
                    </DialogTitle>
                    {selectedQuiz?.quiz.description && (
                        <p className="text-gray-500 font-medium max-w-2xl text-base leading-relaxed italic">
                           "{selectedQuiz.quiz.description}"
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {selectedQuiz?.quiz.status !== "actif" && !loading && (
                        <Button
                            className="bg-[#FEB823] hover:bg-[#FEB823]/90 text-white font-black px-6 h-12 rounded-2xl shadow-xl shadow-[#FEB823]/20 transition-all hover:scale-105 active:scale-95"
                            onClick={onPublish}
                            disabled={loading}
                        >
                            <CheckCircle2 className="w-5 h-5 mr-2" /> Publier le Quiz
                        </Button>
                    )}
                    <button 
                        onClick={() => onOpenChange(false)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </div>
        </div>

        <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading || !selectedQuiz ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 border-4 border-[#FEB823]/20 border-t-[#FEB823] rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Extraction des données...</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Info Stats Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex items-center gap-4 transition-transform hover:scale-105">
                     <div className="w-12 h-12 bg-[#FEB823]/10 rounded-2xl flex items-center justify-center text-[#FEB823]"><Target className="w-6 h-6" /></div>
                     <div><p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Niveau</p><p className="font-black text-slate-800 text-sm">{selectedQuiz.quiz.niveau || "Standard"}</p></div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex items-center gap-4 transition-transform hover:scale-105">
                     <div className="w-12 h-12 bg-[#FEB823]/10 rounded-2xl flex items-center justify-center text-[#FEB823]"><Clock className="w-6 h-6" /></div>
                     <div><p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Timer</p><p className="font-black text-slate-800 text-sm">{selectedQuiz.quiz.duree ?? "-"} minutes</p></div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex items-center gap-4 transition-transform hover:scale-105">
                     <div className="w-12 h-12 bg-[#FEB823]/10 rounded-2xl flex items-center justify-center text-[#FEB823]"><BookOpen className="w-6 h-6" /></div>
                     <div><p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Statut</p><p className="font-black text-[#FEB823] text-sm uppercase">{(selectedQuiz.quiz.status || "brouillon")}</p></div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex items-center gap-4 transition-transform hover:scale-105">
                     <div className="w-12 h-12 bg-[#FEB823]/10 rounded-2xl flex items-center justify-center text-[#FEB823]"><FileText className="w-6 h-6" /></div>
                     <div><p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Questions</p><p className="font-black text-slate-800 text-sm">{selectedQuiz.questions.length} Items</p></div>
                  </div>
              </div>

              {/* Questions Area */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Banque Digitale</h3>
                    <Button
                        variant="ghost"
                        className="rounded-2xl text-[#FEB823] font-black uppercase text-[10px] tracking-widest hover:bg-[#FEB823]/5 flex items-center gap-2"
                        onClick={onAddQuestion}
                    >
                        <Plus className="w-4 h-4" /> Ajouter une question
                    </Button>
                </div>

                {selectedQuiz.questions.length === 0 ? (
                  <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white/50 border-dashed border-2 border-slate-100">
                      <CardContent className="py-20 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 mb-4"><Inbox className="w-8 h-8 text-slate-200" /></div>
                          <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Aucune donnée pédagogique injectée.</p>
                      </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <AnimatePresence>
                      {selectedQuiz.questions.map((q, idx) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          key={q.id}
                          className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-white hover:border-[#FEB823]/20 hover:shadow-xl transition-all duration-300 relative"
                        >
                          <div className="flex flex-col space-y-6">
                            <div className="flex items-start justify-between gap-6">
                              <div className="flex items-start gap-4 flex-1">
                                 <div className="w-12 h-12 bg-[#FEB823] text-white rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-[#FEB823]/20">
                                    {idx + 1}
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="text-lg font-black text-slate-900 leading-snug uppercase tracking-tight">
                                      {q.question}
                                    </h4>
                                    <Badge variant="outline" className="border-slate-100 text-slate-300 uppercase text-[9px] font-black rounded-lg bg-slate-50/50">
                                      {q.type}
                                    </Badge>
                                 </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-slate-100 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                onClick={() => onDeleteQuestion(q.id)}
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>

                            {/* Options Grid (Suivi Demandes Palette) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-16">
                              {q.reponses.map((r, ridx) => (
                                <div
                                  key={r.id ?? `${q.id}-${ridx}`}
                                  className={`rounded-2xl border-2 p-5 transition-all duration-300 flex items-center justify-between gap-3 ${
                                    r.correct
                                      ? "border-[#FEB823]/30 bg-[#FEB823]/5 text-[#FEB823]"
                                      : "border-slate-50 bg-slate-50/50 text-slate-400"
                                  }`}
                                >
                                  <span className="font-black text-sm uppercase">
                                    {r.reponse}
                                  </span>
                                  {r.correct && (
                                    <CheckCircle2 className="w-5 h-5" />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Pedagogical Tip (Yellow Accent) */}
                            {q.astuce && (
                              <div className="mt-4 pl-0 md:pl-16">
                                 <div className="bg-[#FEB823]/10 rounded-2xl p-5 flex items-start gap-4 border border-[#FEB823]/10">
                                    <Lightbulb className="w-6 h-6 text-[#FEB823] shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                       <p className="text-[9px] text-[#FEB823] font-black uppercase tracking-[0.2em] leading-none">Note Pédagogique</p>
                                       <p className="text-sm text-slate-600 font-bold italic leading-relaxed">"{q.astuce}"</p>
                                    </div>
                                 </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Modal Footer Area (Suivi Demandes Aesthetics) */}
        <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4 text-slate-300">
              <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                 <FileText className="w-4 h-4 opacity-50" /> ID: {selectedQuiz?.quiz.id || '---'}
              </div>
              <div className="h-4 w-px bg-slate-100" />
              <p className="font-black text-[10px] uppercase tracking-widest italic opacity-50">Intégrité des données vérifiée</p>
           </div>
           <Button variant="ghost" className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 hover:text-[#FEB823] hover:bg-[#FEB823]/5 rounded-xl h-12 px-10 transition-all" onClick={() => onOpenChange(false)}>
              Fermer la vue
           </Button>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 20px;
            border: 2px solid #F8FAFC;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
