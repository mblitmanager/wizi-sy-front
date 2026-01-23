import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, Inbox, Plus, Trash2 } from "lucide-react";

type QuizQuestion = {
  id: number;
  question: string;
  type: string;
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
      <DialogContent className="max-w-3xl bg-card border-border text-foreground overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span className="line-clamp-1">
              {selectedQuiz?.quiz.titre || "Détails du quiz"}
            </span>
            {selectedQuiz?.quiz.status !== "actif" ? (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={onPublish}
                disabled={loading}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Publier
              </Button>
            ) : null}
          </DialogTitle>
        </DialogHeader>

        {loading || !selectedQuiz ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Spinner className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Chargement du quiz...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <Card className="bg-background border-border">
              <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Niveau</div>
                  <div className="font-semibold">
                    {selectedQuiz.quiz.niveau || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Durée</div>
                  <div className="font-semibold">
                    {selectedQuiz.quiz.duree ?? "-"} min
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Statut</div>
                  <div className="font-semibold">
                    {(selectedQuiz.quiz.status || "brouillon").toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                  <div className="font-semibold">
                    {selectedQuiz.questions.length}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h3 className="font-bold">Questions ({selectedQuiz.questions.length})</h3>
              <Button
                variant="outline"
                className="border-border"
                onClick={onAddQuestion}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle question
              </Button>
            </div>

            {selectedQuiz.questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                <Inbox className="h-10 w-10 text-muted-foreground/80" />
                <h3 className="text-lg font-semibold">Aucune question</h3>
                <p className="text-sm text-muted-foreground">
                  Ajoutez votre première question à ce quiz.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedQuiz.questions.map((q, idx) => (
                  <Card key={q.id} className="bg-background border-border">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base flex items-start justify-between gap-3">
                        <span className="line-clamp-2">
                          {idx + 1}. {q.question}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-border text-destructive hover:text-destructive"
                          onClick={() => onDeleteQuestion(q.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="border-border">
                          {q.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.reponses.map((r, ridx) => (
                          <div
                            key={r.id ?? `${q.id}-${ridx}`}
                            className={`rounded-md border px-3 py-2 text-sm ${
                              r.correct
                                ? "border-green-500/40 bg-green-500/10"
                                : "border-border bg-card"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-foreground">
                                {r.reponse}
                              </span>
                              {r.correct ? (
                                <Badge className="bg-green-600 text-white text-[10px] h-5 px-1.5">
                                  Correct
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
