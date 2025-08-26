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

export function buildAvailableQuizzes(all: Quiz[] | undefined, userPoints: number, selectedFormationId?: string | null) {
  if (!all) return [] as Quiz[];

  const debutant = all.filter((q) => normalizeLevel(q.niveau) === "débutant");
  const inter = all.filter((q) => normalizeLevel(q.niveau) === "intermédiaire");
  const avance = all.filter((q) => normalizeLevel(q.niveau) === "avancé");

  let result: Quiz[] = [];
  if (userPoints < 10) {
    result = debutant.slice(0, 2);
  } else if (userPoints < 20) {
    result = debutant.slice(0, 4);
  } else if (userPoints < 40) {
    result = [...debutant, ...inter.slice(0, 2)];
  } else if (userPoints < 60) {
    result = [...debutant, ...inter];
  } else if (userPoints < 80) {
    result = [...debutant, ...inter, ...avance.slice(0, 2)];
  } else if (userPoints < 100) {
    result = [...debutant, ...inter, ...avance.slice(0, 4)];
  } else {
    result = [...debutant, ...inter, ...avance];
  }

  if (selectedFormationId) {
    result = result.filter((q) => String((q as MaybeWithFormation).formationId) === String(selectedFormationId));
  }

  return result;
}
