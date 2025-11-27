import { useMemo } from "react";
import { Quiz } from "@/types/quiz";
import { CatalogueFormation } from "@/types/stagiaire";

export const useQuizFiltering = (
  quizzes: unknown[],
  history: unknown[],
  stagiaireCatalogues: CatalogueFormation[],
  userPoints: number = 0 // Add user points parameter
) => {
  return useMemo(() => {
    if (!quizzes.length) return [];

    const asRecord = (v: unknown) =>
      (v as Record<string, unknown> | null) ?? null;

    const getHistoryQuizId = (h: unknown): string | null => {
      const r = asRecord(h);
      if (!r) return null;
      const quiz = asRecord(r["quiz"]);
      const raw = (quiz?.["id"] ?? r["quizId"] ?? r["id"] ?? null) as
        | string
        | number
        | null;
      return raw != null ? String(raw) : null;
    };

    const getQuizId = (q: unknown): string | null => {
      const r = asRecord(q);
      if (!r) return null;
      const raw = (r["id"] ?? r["_id"] ?? null) as string | number | null;
      return raw != null ? String(raw) : null;
    };

    const getQuizFormationId = (q: unknown): number | null => {
      const r = asRecord(q);
      if (!r) return null;
      const formation = asRecord(r["formation"]);
      if (formation && formation["id"]) return Number(formation["id"]);
      if (r["formation_id"]) return Number(r["formation_id"]);
      if (r["formationId"]) return Number(r["formationId"]);
      const formations = r["formations"] as unknown;
      if (Array.isArray(formations) && formations.length > 0) {
        const f0 = asRecord(formations[0]);
        if (f0 && f0["id"]) return Number(f0["id"]);
      }
      return null;
    };

    const getQuizLevel = (q: unknown): string | null => {
      const r = asRecord(q);
      if (!r) return null;
      return (r["niveau"] ?? r["level"] ?? null) as string | null;
    };

    const getQuizTitle = (q: unknown): string => {
      const r = asRecord(q);
      if (!r) return "";
      return (r["titre"] ?? r["title"] ?? "") as string;
    };

    // Normalize level function (same as Flutter)
    const normalizeLevel = (level: string | null): string => {
      if (!level) return "débutant";
      const lvl = level.toLowerCase().trim();
      if (lvl.includes("inter") || lvl.includes("moyen")) return "intermédiaire";
      if (lvl.includes("avancé") || lvl.includes("expert")) return "avancé";
      return "débutant";
    };

    // Filter out played quizzes
    const notPlayedQuizzes = (quizzes as unknown[]).filter((q) => {
      const qid = getQuizId(q);
      if (!qid) return true;
      return !history.some((h) => String(getHistoryQuizId(h)) === String(qid));
    });

    // Get formation IDs
    const formationIds = Array.from(
      new Set(
        stagiaireCatalogues
          .map((item) => item.formation_id)
          .filter((id) => id != null)
          .map((id) => Number(id))
      )
    ).filter(Boolean) as number[];

    // Filter by formation
    const quizzesForFormations = (notPlayedQuizzes as unknown[]).filter((q) => {
      const formationId = getQuizFormationId(q);
      return formationId && formationIds.includes(formationId);
    });

    // Categorize quizzes by level
    const debutant = quizzesForFormations.filter(
      (q) => normalizeLevel(getQuizLevel(q)) === "débutant"
    );
    const intermediaire = quizzesForFormations.filter(
      (q) => normalizeLevel(getQuizLevel(q)) === "intermédiaire"
    );
    const avance = quizzesForFormations.filter(
      (q) => normalizeLevel(getQuizLevel(q)) === "avancé"
    );

    // Apply standardized filtering rules based on points
    let filtered: unknown[] = [];
    if (userPoints < 50) {
      // 0-49 points: Only beginner quizzes
      filtered = debutant;
    } else if (userPoints < 100) {
      // 50-99 points: Beginner + intermediate quizzes
      filtered = [...debutant, ...intermediaire];
    } else {
      // 100+ points: All levels
      filtered = [...debutant, ...intermediaire, ...avance];
    }

    // Fallback: if no quizzes after filtering but original list is not empty
    if (filtered.length === 0 && quizzesForFormations.length > 0) {
      filtered = quizzesForFormations;
    }

    // Sort by level (débutant → intermédiaire → avancé), then alphabetically by title
    filtered.sort((a, b) => {
      const levelOrder: Record<string, number> = {
        "débutant": 1,
        "intermédiaire": 2,
        "avancé": 3,
      };

      const levelA = levelOrder[normalizeLevel(getQuizLevel(a))] ?? 999;
      const levelB = levelOrder[normalizeLevel(getQuizLevel(b))] ?? 999;

      if (levelA !== levelB) {
        return levelA - levelB;
      }

      // Same level: sort alphabetically by title 
      const titleA = getQuizTitle(a).toLowerCase();
      const titleB = getQuizTitle(b).toLowerCase();
      return titleA.localeCompare(titleB);
    });

    return filtered.map((s) => s as Quiz);
  }, [quizzes, history, stagiaireCatalogues, userPoints]);
};
