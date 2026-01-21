import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import {
  CheckCircle2,
  Download,
  Eye,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

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
  reponses: { id?: number; reponse: string; correct: boolean }[];
};

type QuizDetail = {
  quiz: QuizListItem;
  questions: QuizQuestion[];
};

function statusBadgeVariant(
  status?: string | null
): "default" | "secondary" | "destructive" | "outline" {
  const s = (status || "").toLowerCase();
  if (s === "actif" || s === "active") return "default";
  if (s === "inactif" || s === "brouillon") return "secondary";
  if (s === "archive" || s === "archivé") return "outline";
  return "secondary";
}

export default function FormateurQuizManagementPage() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);

  // Filters (Laravel index style)
  const [search, setSearch] = useState("");
  const [filterNiveau, setFilterNiveau] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterFormationId, setFilterFormationId] = useState<string>("");

  // dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState<QuizDetail | null>(null);

  const [newQuizData, setNewQuizData] = useState({
    titre: "",
    description: "",
    duree: 30,
    niveau: "débutant",
    formation_id: "",
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "banque de mots",
    reponses: [
      { reponse: "", correct: false },
      { reponse: "", correct: false },
    ],
  });

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/formateur/quizzes`);
      const payload = res.data?.data || res.data;
      setQuizzes(payload?.quizzes || payload || []);
    } finally {
      setLoading(false);
    }
  };

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
    const res = await api.get(`/formateur/quizzes/${id}`);
    const payload = res.data?.data || res.data;
    const quiz = payload?.quiz || payload;
    const questions = payload?.questions || quiz?.questions || [];
    setSelectedQuiz({ quiz, questions });
    setDetailOpen(true);
  };

  useEffect(() => {
    fetchQuizzes();
    fetchFormations();
  }, []);

  const filteredQuizzes = useMemo(() => {
    const s = search.trim().toLowerCase();
    return quizzes.filter((q) => {
      const okSearch =
        !s ||
        (q.titre || "").toLowerCase().includes(s) ||
        (q.description || "").toLowerCase().includes(s);
      const okNiveau =
        !filterNiveau ||
        (q.niveau || "").toLowerCase() === filterNiveau.toLowerCase();
      const okStatus =
        !filterStatus ||
        (q.status || "").toLowerCase() === filterStatus.toLowerCase();
      const okFormation =
        !filterFormationId ||
        String(q.formation_id || q.formation?.id || "") ===
          String(filterFormationId);
      return okSearch && okNiveau && okStatus && okFormation;
    });
  }, [quizzes, search, filterNiveau, filterStatus, filterFormationId]);

  const handleCreateQuiz = async () => {
    await api.post(`/formateur/quizzes`, {
      titre: newQuizData.titre,
      description: newQuizData.description,
      duree: newQuizData.duree,
      niveau: newQuizData.niveau,
      formation_id: newQuizData.formation_id || null,
    });
    setCreateOpen(false);
    setNewQuizData({
      titre: "",
      description: "",
      duree: 30,
      niveau: "débutant",
      formation_id: "",
    });
    await fetchQuizzes();
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!window.confirm("Supprimer ce quiz ?")) return;
    await api.delete(`/formateur/quizzes/${quizId}`);
    await fetchQuizzes();
  };

  const handlePublishQuiz = async () => {
    if (!selectedQuiz) return;
    await api.post(`/formateur/quizzes/${selectedQuiz.quiz.id}/publish`, {});
    setDetailOpen(false);
    await fetchQuizzes();
  };

  const updateReponse = (
    idx: number,
    patch: Partial<{ reponse: string; correct: boolean }>
  ) => {
    setCurrentQuestion((prev) => {
      const copy = [...prev.reponses];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, reponses: copy };
    });
  };

  const handleAddQuestion = async () => {
    if (!selectedQuiz) return;
    await api.post(`/formateur/quizzes/${selectedQuiz.quiz.id}/questions`, {
      question: currentQuestion.text,
      type: currentQuestion.type,
      reponses: currentQuestion.reponses,
    });
    setQuestionOpen(false);
    setCurrentQuestion({
      text: "",
      type: "banque de mots",
      reponses: [
        { reponse: "", correct: false },
        { reponse: "", correct: false },
      ],
    });
    await openDetail(selectedQuiz.quiz.id);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!selectedQuiz) return;
    if (!window.confirm("Supprimer cette question ?")) return;
    await api.delete(
      `/formateur/quizzes/${selectedQuiz.quiz.id}/questions/${questionId}`
    );
    await openDetail(selectedQuiz.quiz.id);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto py-8 px-4 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight">
                Gestion des Quiz
              </h1>
              <p className="text-muted-foreground">
                Inspiré des pages Laravel admin (index / create / edit / show).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="border-border"
                onClick={() => alert("À brancher: export")}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button
                variant="outline"
                className="border-border"
                onClick={() => alert("À brancher: import")}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
              <Button
                className="bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau quiz
              </Button>
            </div>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher (titre / description)…"
                  className="pl-9 bg-background border-border"
                />
              </div>
              <select
                className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                value={filterFormationId}
                onChange={(e) => setFilterFormationId(e.target.value)}
              >
                <option value="">Toutes les formations</option>
                {formations.map((f) => (
                  <option key={f.id} value={String(f.id)}>
                    {f.nom || `Formation #${f.id}`}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={filterNiveau}
                  onChange={(e) => setFilterNiveau(e.target.value)}
                >
                  <option value="">Niveau</option>
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
                <select
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Statut</option>
                  <option value="actif">Actif</option>
                  <option value="brouillon">Brouillon</option>
                  <option value="inactif">Inactif</option>
                  <option value="archive">Archivé</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Liste des quiz</CardTitle>
              <Badge
                variant="secondary"
                className="bg-secondary text-secondary-foreground"
              >
                {filteredQuizzes.length} quiz(s)
              </Badge>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 text-center text-muted-foreground">
                  Chargement…
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  Aucun quiz trouvé
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-border">
                        <th className="py-3 pr-4 font-semibold">Titre</th>
                        <th className="py-3 pr-4 font-semibold">Niveau</th>
                        <th className="py-3 pr-4 font-semibold">Statut</th>
                        <th className="py-3 pr-4 font-semibold">Durée</th>
                        <th className="py-3 pr-4 font-semibold">Questions</th>
                        <th className="py-3 text-right font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuizzes.map((q) => (
                        <tr
                          key={q.id}
                          className="border-b border-border/60 hover:bg-muted/40"
                        >
                          <td className="py-3 pr-4">
                            <div className="font-semibold text-foreground">
                              {q.titre}
                            </div>
                            {q.description ? (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {q.description}
                              </div>
                            ) : null}
                          </td>
                          <td className="py-3 pr-4">{q.niveau || "-"}</td>
                          <td className="py-3 pr-4">
                            <Badge variant={statusBadgeVariant(q.status)}>
                              {(q.status || "brouillon").toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4">{q.duree ?? "-"} min</td>
                          <td className="py-3 pr-4">{q.nb_questions ?? 0}</td>
                          <td className="py-3 text-right">
                            <div className="inline-flex gap-2">
                              <Button
                                variant="outline"
                                className="border-border"
                                onClick={() => openDetail(q.id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Détails
                              </Button>
                              <Button
                                variant="outline"
                                className="border-border text-destructive hover:text-destructive"
                                onClick={() => handleDeleteQuiz(q.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Créer un nouveau quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={newQuizData.titre}
                onChange={(e) =>
                  setNewQuizData((p) => ({ ...p, titre: e.target.value }))
                }
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newQuizData.description}
                onChange={(e) =>
                  setNewQuizData((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-background border-border"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Niveau</Label>
                <select
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  value={newQuizData.niveau}
                  onChange={(e) =>
                    setNewQuizData((p) => ({ ...p, niveau: e.target.value }))
                  }
                >
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Durée (min)</Label>
                <Input
                  type="number"
                  value={newQuizData.duree}
                  onChange={(e) =>
                    setNewQuizData((p) => ({
                      ...p,
                      duree: Number(e.target.value),
                    }))
                  }
                  className="bg-background border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Formation associée</Label>
              <select
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                value={newQuizData.formation_id}
                onChange={(e) =>
                  setNewQuizData((p) => ({
                    ...p,
                    formation_id: e.target.value,
                  }))
                }
              >
                <option value="">—</option>
                {formations.map((f) => (
                  <option key={f.id} value={String(f.id)}>
                    {f.nom || `Formation #${f.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="border-border"
              onClick={() => setCreateOpen(false)}
            >
              Annuler
            </Button>
            <Button
              className="bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90"
              disabled={!newQuizData.titre.trim()}
              onClick={handleCreateQuiz}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-3">
              <span className="line-clamp-1">
                {selectedQuiz?.quiz.titre || "Détails du quiz"}
              </span>
              {selectedQuiz?.quiz.status !== "actif" ? (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handlePublishQuiz}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Publier
                </Button>
              ) : null}
            </DialogTitle>
          </DialogHeader>

          {selectedQuiz ? (
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
                <h3 className="font-bold">Questions</h3>
                <Button
                  variant="outline"
                  className="border-border"
                  onClick={() => setQuestionOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle question
                </Button>
              </div>

              {selectedQuiz.questions.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                  Aucune question ajoutée
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
                            className="border-border text-destructive hover:text-destructive"
                            onClick={() => handleDeleteQuestion(q.id)}
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
                                  <Badge className="bg-green-600 text-white">
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
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              Chargement…
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={questionOpen} onOpenChange={setQuestionOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Ajouter une question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Texte de la question</Label>
              <Textarea
                value={currentQuestion.text}
                onChange={(e) =>
                  setCurrentQuestion((p) => ({ ...p, text: e.target.value }))
                }
                className="bg-background border-border"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                value={currentQuestion.type}
                onChange={(e) =>
                  setCurrentQuestion((p) => ({ ...p, type: e.target.value }))
                }
              >
                <option value="question audio">Question audio</option>
                <option value="remplir le champ vide">Remplir le champ vide</option>
                <option value="carte flash">Carte flash</option>
                <option value="correspondance">Correspondance</option>
                <option value="choix multiples">Choix multiples</option>
                <option value="rearrangement">Rearrangement</option>
                <option value="vrai/faux">Vrai / Faux</option>
                <option value="banque de mots">Banque de mots</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Réponses</Label>
              <div className="space-y-2">
                {currentQuestion.reponses.map((r, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      value={r.reponse}
                      onChange={(e) =>
                        updateReponse(idx, { reponse: e.target.value })
                      }
                      placeholder={`Réponse #${idx + 1}`}
                      className="bg-background border-border"
                    />
                    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={r.correct}
                        onChange={(e) =>
                          updateReponse(idx, { correct: e.target.checked })
                        }
                      />
                      Correct
                    </label>
                    {currentQuestion.reponses.length > 2 ? (
                      <Button
                        variant="outline"
                        className="border-border"
                        onClick={() =>
                          setCurrentQuestion((p) => ({
                            ...p,
                            reponses: p.reponses.filter((_, i) => i !== idx),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="border-border"
                onClick={() =>
                  setCurrentQuestion((p) => ({
                    ...p,
                    reponses: [...p.reponses, { reponse: "", correct: false }],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une réponse
              </Button>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="border-border"
              onClick={() => setQuestionOpen(false)}
            >
              Annuler
            </Button>
            <Button
              className="bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90"
              disabled={
                !currentQuestion.text.trim() ||
                currentQuestion.reponses.some((x) => !x.reponse.trim())
              }
              onClick={handleAddQuestion}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

