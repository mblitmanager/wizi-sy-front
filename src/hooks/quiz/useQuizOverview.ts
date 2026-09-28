import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useStagiaireQuizzes } from "@/hooks/queries/useQuizQueries";
import { useQuizHistory } from "@/hooks/queries/useProfileQueries";
import { useStagiairePoints } from "@/hooks/useClassementPoints";
import {
  LEVEL_THRESHOLDS,
  buildAvailableQuizzes,
  getQuizFormationId,
  normalizeLevel,
  type QuizLevel,
} from "@/components/quiz/quizUtils";
import type { Quiz, QuizHistory } from "@/types/quiz";

/**
 * Données de la page Quiz du stagiaire, calculées une seule fois pour les deux vues.
 *
 * Sources (backend) :
 *  - GET /stagiaire/quizzes  → quiz actifs des formations du stagiaire
 *  - GET /quiz/history       → quiz terminés (table progressions) = statut "joué"
 *  - GET /users/me/points    → total de points et niveaux accessibles
 *
 * Règles reprises du backend et de l'existant :
 *  - niveaux débloqués : < 50 pts débutant, < 100 pts + intermédiaire, sinon tous ;
 *  - parcours : les quiz joués d'abord (du plus récent au plus ancien), puis les autres ;
 *    un quiz n'est jouable que si le précédent a été joué et qu'il contient des questions ;
 *  - liste : tous les quiz non joués des niveaux débloqués sont jouables,
 *    et les quiz déjà joués restent visibles quel que soit le niveau.
 */

export type QuizStatus = "done" | "next" | "open" | "locked";

export interface QuizAttemptSummary {
  correct: number;
  total: number;
  percent: number;
  score: number;
  timeSpent: number;
  completedAt: string | null;
}

export interface QuizItem {
  id: string;
  quiz: Quiz;
  title: string;
  description: string;
  level: QuizLevel;
  levelLabel: string;
  category: string;
  formationId: string | null;
  formationTitle: string;
  questionCount: number;
  points: number;
  played: boolean;
  attempts: number;
  lastAttempt: QuizAttemptSummary | null;
  status: QuizStatus;
}

export interface FormationOption {
  id: string;
  titre: string;
  categorie: string;
  quizCount: number;
}

type QuizWithFormation = Quiz & {
  formation?: { id?: string | number; titre?: string; categorie?: string } | null;
};

interface HistoryEntry {
  attempts: number;
  latest: QuizHistory;
  latestTs: number;
}

const LEVEL_LABELS: Record<QuizLevel, string> = {
  débutant: "Débutant",
  intermédiaire: "Intermédiaire",
  avancé: "Avancé",
};

/** Identifiant du quiz d'une entrée d'historique (`quiz.id` côté backend). */
function historyQuizId(h: QuizHistory): string {
  const raw = h as QuizHistory & { quiz_id?: string | number };
  return String(h.quiz?.id ?? h.quizId ?? raw.quiz_id ?? "");
}

function indexHistory(history: QuizHistory[]): Map<string, HistoryEntry> {
  const byQuiz = new Map<string, HistoryEntry>();
  for (const h of history) {
    const id = historyQuizId(h);
    if (!id) continue;
    const ts = h.completedAt ? Date.parse(h.completedAt) || 0 : 0;
    const current = byQuiz.get(id);
    if (!current) byQuiz.set(id, { attempts: 1, latest: h, latestTs: ts });
    else {
      current.attempts += 1;
      if (ts > current.latestTs) {
        current.latest = h;
        current.latestTs = ts;
      }
    }
  }
  return byQuiz;
}

function toItem(quiz: Quiz, history: Map<string, HistoryEntry>, status: QuizStatus): QuizItem {
  const q = quiz as QuizWithFormation;
  const id = String(quiz.id);
  const entry = history.get(id);
  const level = normalizeLevel(quiz.niveau);
  const questionCount = quiz.questions?.length ?? 0;

  let lastAttempt: QuizAttemptSummary | null = null;
  if (entry) {
    const h = entry.latest;
    const total = Number(h.totalQuestions) || questionCount;
    const correct = Number(h.correctAnswers) || 0;
    lastAttempt = {
      correct,
      total,
      percent: total > 0 ? Math.round((correct / total) * 100) : 0,
      score: Number(h.score) || 0,
      timeSpent: Number(h.timeSpent) || 0,
      completedAt: h.completedAt ?? null,
    };
  }

  return {
    id,
    quiz,
    title: quiz.titre,
    description: quiz.description ?? "",
    level,
    levelLabel: LEVEL_LABELS[level],
    category: q.formation?.categorie || quiz.categorie || "Formation",
    formationId: getQuizFormationId(quiz),
    formationTitle: q.formation?.titre ?? "",
    questionCount,
    points: Number(quiz.points) || 0,
    played: !!entry,
    attempts: entry?.attempts ?? 0,
    lastAttempt,
    status,
  };
}

/** Progression vers le niveau suivant. */
export function getLevelProgress(points: number) {
  const unlocked = LEVEL_THRESHOLDS.filter((t) => points >= t.minPoints);
  const current = unlocked[unlocked.length - 1];
  const next = LEVEL_THRESHOLDS.find((t) => points < t.minPoints) ?? null;
  const percent = next
    ? Math.min(100, Math.round(((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100))
    : 100;
  return { current, next, percent, unlockedCount: unlocked.length };
}

/** Annonce les niveaux débloqués quand les points franchissent un palier pendant la session. */
function useLevelUnlockToast(points: number, ready: boolean) {
  const previous = useRef<number | null>(null);
  useEffect(() => {
    if (!ready) return;
    const before = previous.current;
    previous.current = points;
    if (before === null || points <= before) return;
    if (before < 100 && points >= 100) {
      toast.success("Tous les quiz sont débloqués !", {
        description: "Vous pouvez maintenant participer à tous les quiz, y compris les quiz avancés.",
      });
    } else if (before < 50 && points >= 50) {
      toast.success("Quiz intermédiaires débloqués !", {
        description: "Vous pouvez maintenant participer aux quiz intermédiaires.",
      });
    }
  }, [points, ready]);
}

interface UseQuizOverviewOptions {
  /** Formation choisie par l'utilisateur (ignorée si elle n'a plus de quiz). */
  preferredFormationId?: string | null;
  /** Formation à utiliser à défaut (ex. celle d'un quiz en cours). */
  fallbackFormationId?: string | null;
}

export function useQuizOverview({ preferredFormationId, fallbackFormationId }: UseQuizOverviewOptions = {}) {
  const quizzesQuery = useStagiaireQuizzes();
  const historyQuery = useQuizHistory();
  const pointsQuery = useStagiairePoints();

  const quizzes = quizzesQuery.data;
  const points = pointsQuery.data?.totalPoints ?? 0;
  const historyList = useMemo(
    () => (Array.isArray(historyQuery.data) ? historyQuery.data : []),
    [historyQuery.data]
  );
  const history = useMemo(() => indexHistory(historyList), [historyList]);

  useLevelUnlockToast(points, pointsQuery.isSuccess);

  /** Formations proposées : celles qui ont des quiz (même règle d'accès que les quiz). */
  const formations = useMemo<FormationOption[]>(() => {
    const byId = new Map<string, FormationOption>();
    for (const quiz of quizzes ?? []) {
      const q = quiz as QuizWithFormation;
      const id = getQuizFormationId(quiz);
      if (!id) continue;
      const existing = byId.get(id);
      if (existing) existing.quizCount += 1;
      else
        byId.set(id, {
          id,
          titre: q.formation?.titre || `Formation ${id}`,
          categorie: q.formation?.categorie || quiz.categorie || "",
          quizCount: 1,
        });
    }
    return Array.from(byId.values());
  }, [quizzes]);

  /** Formation affichée : choix de l'utilisateur, sinon repli, sinon la première. */
  const formationId = useMemo(() => {
    const exists = (id?: string | null) => !!id && formations.some((f) => f.id === String(id));
    if (exists(preferredFormationId)) return String(preferredFormationId);
    if (exists(fallbackFormationId)) return String(fallbackFormationId);
    return formations[0]?.id ?? null;
  }, [formations, preferredFormationId, fallbackFormationId]);

  const views = useMemo(() => {
    if (!quizzes) return { path: [] as QuizItem[], todo: [] as QuizItem[], done: [] as QuizItem[] };

    const isPlayed = (q: Quiz) => history.has(String(q.id));
    const playedAt = (q: Quiz) => history.get(String(q.id))?.latestTs ?? 0;
    const available = buildAvailableQuizzes(quizzes, points, formationId);

    // Parcours : joués (plus récents d'abord) puis non joués, sans doublon
    const ordered = [
      ...available.filter(isPlayed).sort((a, b) => playedAt(b) - playedAt(a)),
      ...available.filter((q) => !isPlayed(q)),
    ];
    const seen = new Set<string>();
    const unique = ordered.filter((q) => {
      const id = String(q.id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    const path = unique.map((quiz, i) => {
      const played = isPlayed(quiz);
      const previousPlayed = i === 0 || isPlayed(unique[i - 1]);
      const hasQuestions = (quiz.questions?.length ?? 0) > 0;
      const playable = (previousPlayed || played) && hasQuestions;
      const status: QuizStatus = played ? "done" : playable ? "next" : "locked";
      return toItem(quiz, history, status);
    });

    // Liste : à faire = niveaux débloqués non joués ; terminés = tous les quiz joués de la formation
    const todo = available.filter((q) => !isPlayed(q)).map((q) => toItem(q, history, "open"));
    const done = quizzes
      .filter((q) => isPlayed(q) && (!formationId || getQuizFormationId(q) === String(formationId)))
      .sort((a, b) => playedAt(b) - playedAt(a))
      .map((q) => toItem(q, history, "done"));

    return { path, todo, done };
  }, [quizzes, history, points, formationId]);

  /** Quiz de la formation encore verrouillés par les points (pour informer l'utilisateur). */
  const lockedByLevelCount = useMemo(() => {
    if (!quizzes) return 0;
    const inFormation = quizzes.filter((q) => !formationId || getQuizFormationId(q) === String(formationId));
    return inFormation.length - buildAvailableQuizzes(quizzes, points, formationId).length;
  }, [quizzes, points, formationId]);

  return {
    // Les points conditionnent les niveaux débloqués : on les attend pour ne pas afficher un parcours faux
    isLoading: quizzesQuery.isLoading || historyQuery.isLoading || pointsQuery.isLoading,
    isError: quizzesQuery.isError,
    refetch: () => {
      quizzesQuery.refetch();
      historyQuery.refetch();
      pointsQuery.refetch();
    },
    points,
    pointsLoading: pointsQuery.isLoading,
    formations,
    formationId,
    history: historyList,
    lockedByLevelCount,
    ...views,
  };
}
