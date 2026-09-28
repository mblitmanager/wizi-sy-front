import type { Quiz } from "@/types/quiz";

export type QuizLevel = "débutant" | "intermédiaire" | "avancé";

/** Paliers de déblocage, identiques à RankingController::getUserPoints côté backend. */
export const LEVEL_THRESHOLDS: { level: QuizLevel; label: string; minPoints: number }[] = [
  { level: "débutant", label: "Débutant", minPoints: 0 },
  { level: "intermédiaire", label: "Intermédiaire", minPoints: 50 },
  { level: "avancé", label: "Avancé", minPoints: 100 },
];

export function normalizeLevel(lvl?: string): QuizLevel {
  if (!lvl) return "débutant";
  const l = lvl.toLowerCase();
  if (l.includes("inter") || l.includes("moyen")) return "intermédiaire";
  if (l.includes("avanc") || l.includes("expert")) return "avancé";
  return "débutant";
}

/** Identifiant de formation d'un quiz, quelle que soit la forme renvoyée par l'API. */
export function getQuizFormationId(q: Quiz): string | null {
  const any = q as Quiz & {
    formationId?: string | number | null;
    formation?: { id?: string | number } | null;
  };
  const id = any.formationId || any.formation?.id || q.formations?.[0]?.id;
  return id ? String(id) : null;
}

/**
 * Filters quizzes based on user points using simplified 3-tier system
 * < 50 points: beginner only
 * 50-99 points: beginner + intermediate
 * >= 100 points: all levels
 */
export function buildAvailableQuizzes(
  all: Quiz[] | undefined,
  userPoints: number,
  formationId?: string | number | null
) {
  if (!all) return [] as Quiz[];

  // Step 1: Filter by formation if provided (quiz sans formation exclu)
  const filtered = formationId
    ? all.filter((q) => getQuizFormationId(q) === String(formationId))
    : all;

  // Step 2: Separate by normalized level
  const debutant = filtered.filter((q) => normalizeLevel(q.niveau) === "débutant");
  const inter = filtered.filter((q) => normalizeLevel(q.niveau) === "intermédiaire");
  const avance = filtered.filter((q) => normalizeLevel(q.niveau) === "avancé");

  // Simplified 3-tier quiz filtering system
  if (userPoints < 50) {
    return debutant;
  } else if (userPoints < 100) {
    return [...debutant, ...inter];
  } else {
    return [...debutant, ...inter, ...avance];
  }
}
