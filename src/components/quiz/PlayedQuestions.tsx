import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import type { PlayedQuestion, Question } from '@/types/quiz';

export default function PlayedQuestions({
  playedQuestions,
  questions,
}: {
  playedQuestions: PlayedQuestion[];
  questions: Question[];
}) {
  if (!playedQuestions || playedQuestions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500 font-medium italic">Aucune question jouée disponible</p>
      </div>
    );
  }

  const questionMap = new Map<string | number, Question>();
  questions.forEach((q) => questionMap.set(q.id, q));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {playedQuestions.map((pq, idx) => {
        const q = questionMap.get(pq.question_id);
        const selected = pq.selectedAnswers || [];
        const correctAnswers = (q?.reponses || []).filter((r) => r.isCorrect).map((r) => r.text);
        const selectedTexts = (q?.reponses || []).filter((r) => selected.includes(r.id)).map((r) => r.text);
        const isCorrect = correctAnswers.length > 0 && selectedTexts.some((s) => correctAnswers.includes(s));

        return (
          <motion.div
            key={String(pq.question_id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="h-full p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${isCorrect ? 'text-emerald-700 bg-emerald-50/50 border-emerald-100' : 'text-rose-700 bg-rose-50/50 border-rose-100'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                  
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-3">
                    {q?.text || 'Question inconnue'}
                  </h4>

                  <div className="space-y-2">
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Votre réponse</p>
                      <p className={`text-xs font-semibold ${isCorrect ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {selectedTexts.length ? selectedTexts.join(', ') : 'Aucune réponse'}
                      </p>
                    </div>

                    {!isCorrect && (
                      <div className="bg-emerald-50/50 rounded-lg p-2.5 border border-emerald-100/50">
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Bonne réponse</p>
                        <p className="text-xs font-bold text-emerald-700">
                          {correctAnswers.length ? correctAnswers.join(', ') : 'Non disponible'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
