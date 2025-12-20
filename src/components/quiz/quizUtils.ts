import type { Quiz } from "@/types/quiz";

function normalizeLevel(lvl?: string) {
  if (!lvl) return "débutant";
  const l = lvl.toLowerCase();
  if (l.includes("inter") || l.includes("moyen")) return "intermédiaire";
  if (l.includes("avancé") || l.includes("expert")) return "avancé";
  return "débutant";
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

  // Step 1: Filter by formation if provided
  let filtered = all;
  if (formationId) {
    filtered = all.filter((q) => {
      const qfId = (q as any).formationId || (q as any).formation?.id;
      return String(qfId) === String(formationId);
    });
  }

  // Step 2: Separate by normalized level
  const debutant = filtered.filter(
    (q) => normalizeLevel(q.niveau) === "débutant"
  );
  const inter = filtered.filter(
    (q) => normalizeLevel(q.niveau) === "intermédiaire"
  );
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
