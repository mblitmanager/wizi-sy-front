import type { Quiz } from "@/types/quiz";

function normalizeLevel(lvl?: string) {
  if (!lvl) return "débutant";
  const l = lvl.toLowerCase();
  if (l.includes("inter") || l.includes("moyen")) return "intermédiaire";
  if (l.includes("avancé") || l.includes("expert")) return "avancé";
  return "débutant";
}

interface MaybeWithFormation {
  formationId?: string | number;
}

export function buildAvailableQuizzes(
  all: Quiz[] | undefined,
  userPoints: number,
  selectedFormationId?: string | null
) {
  if (!all) return [] as Quiz[];

  const debutant = all.filter((q) => normalizeLevel(q.niveau) === "débutant");
  const inter = all.filter((q) => normalizeLevel(q.niveau) === "intermédiaire");
  const avance = all.filter((q) => normalizeLevel(q.niveau) === "avancé");

  // Simplified 3-tier quiz filtering system:
  // < 50 points: beginner only
  // 50-99 points: beginner + intermediate
  // >= 100 points: all levels
  let result: Quiz[] = [];
  if (userPoints < 50) {
    result = debutant;
  } else if (userPoints < 100) {
    result = [...debutant, ...inter];
  } else {
    result = [...debutant, ...inter, ...avance];
  }

  if (selectedFormationId) {
    result = result.filter(
      (q) =>
        String((q as MaybeWithFormation).formationId) ===
        String(selectedFormationId)
    );
  }

  return result;
}
