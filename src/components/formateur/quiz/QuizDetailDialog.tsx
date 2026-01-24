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
  X
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
      <DialogContent className="max-w-4xl bg-white border-0 text-slate-900 rounded-[3rem] shadow-2xl p-0 overflow-hidden outline-none">
        
        {/* Premium Header */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 pt-12 text-white relative h-64 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-[120px] animate-pulse" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-500/30 px-3 py-1 text-xs uppercase tracking-widest font-bold">
                 Intelligence de Quiz
              </Badge>
              <DialogTitle className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                {selectedQuiz?.quiz.titre || "Focus Quiz"}
              </DialogTitle>
              {selectedQuiz?.quiz.description && (
                <p className="text-indigo-100/70 text-sm font-medium max-w-2xl line-clamp-2 italic">
                  "{selectedQuiz.quiz.description}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {selectedQuiz?.quiz.status !== "actif" && !loading && (
                <Button
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 h-12 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                  onClick={onPublish}
                  disabled={loading}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Déployer
                </Button>
              )}
              <button 
                onClick={() => onOpenChange(false)}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-indigo-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 bg-slate-50/50 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading || !selectedQuiz ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">Synchronisation neurale...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-3xl border border-indigo-50 shadow-sm flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <Target className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Niveau</p>
                      <p className="font-bold text-slate-700">{selectedQuiz.quiz.niveau || "Standard"}</p>
                   </div>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-indigo-50 shadow-sm flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <Clock className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Temps</p>
                      <p className="font-bold text-slate-700">{selectedQuiz.quiz.duree ?? "-"} min</p>
                   </div>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-indigo-50 shadow-sm flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <BookOpen className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Status</p>
                      <p className="font-bold text-slate-700 italic">{(selectedQuiz.quiz.status || "brouillon").toUpperCase()}</p>
                   </div>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-indigo-50 shadow-sm flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <FileText className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Items</p>
                      <p className="font-bold text-slate-700">{selectedQuiz.questions.length} Questions</p>
                   </div>
                </div>
              </div>

              {/* Questions Area */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Banque de Questions</h3>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black px-2 border-0">
                      {selectedQuiz.questions.length} total
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-2xl border-indigo-100 bg-white text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all h-10 shadow-sm"
                    onClick={onAddQuestion}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un Item
                  </Button>
                </div>

                {selectedQuiz.questions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-indigo-100 gap-4 shadow-inner bg-slate-50/20">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 shadow-sm border border-slate-100">
                      <Inbox className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-black text-slate-800">Cerveau vide</h3>
                      <p className="text-sm text-slate-400 font-medium">Commencez par injecter votre première question.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <AnimatePresence>
                      {selectedQuiz.questions.map((q, idx) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          key={q.id}
                          className="group bg-white rounded-[2.5rem] p-8 border border-transparent hover:border-indigo-500/10 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 relative overflow-hidden shadow-sm"
                        >
                          <div className="flex flex-col space-y-6">
                            <div className="flex items-start justify-between gap-6">
                              <div className="flex items-start gap-4 flex-1">
                                 <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-indigo-200">
                                    {idx + 1}
                                 </div>
                                 <div className="space-y-2">
                                    <h4 className="text-lg font-black text-slate-800 leading-snug">
                                      {q.question}
                                    </h4>
                                    <Badge variant="outline" className="border-slate-100 text-slate-400 uppercase text-[9px] font-black rounded-lg bg-slate-50/50">
                                      {q.type}
                                    </Badge>
                                 </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                onClick={() => onDeleteQuestion(q.id)}
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-14">
                              {q.reponses.map((r, ridx) => (
                                <div
                                  key={r.id ?? `${q.id}-${ridx}`}
                                  className={`rounded-2xl border-2 p-4 transition-all duration-300 ${
                                    r.correct
                                      ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 shadow-sm"
                                      : "border-slate-50 bg-slate-50/30 text-slate-500"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="font-bold text-sm">
                                      {r.reponse}
                                    </span>
                                    {r.correct && (
                                      <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                                         <CheckCircle2 className="w-3 h-3 text-white" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Astuce Section */}
                            {q.astuce && (
                              <div className="mt-4 pl-0 md:pl-14">
                                 <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3 border border-amber-100 group-hover:bg-amber-100/50 transition-colors">
                                    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                       <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest leading-none">Astuce Pédagogique</p>
                                       <p className="text-sm text-amber-800/80 font-medium italic">"{q.astuce}"</p>
                                    </div>
                                 </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Background Decor */}
                          <Lightbulb className="absolute -right-6 -bottom-6 w-24 h-24 text-slate-50 opacity-10 -rotate-12 group-hover:rotate-0 transition-all duration-700 group-hover:opacity-20 pointer-events-none" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Modal Footer Area */}
        <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-tighter">
                 <FileText className="w-4 h-4" /> ID: {selectedQuiz?.quiz.id || '---'}
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-tighter">
                 <Clock className="w-4 h-4" /> Analyse en temps réel
              </div>
           </div>
           <Button variant="ghost" className="font-black text-xs uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-xl h-12 px-8" onClick={() => onOpenChange(false)}>
              Fermer la vue détaillée
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
            border: 2px solid #f8fafc;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
