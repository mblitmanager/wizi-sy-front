import { useMemo } from "react";
import dayjs from "dayjs";
import { Quiz } from "@/types/quiz";
import { CatalogueFormation } from "@/types/stagiaire";

export const useQuizFiltering = (
  quizzes: unknown[],
  history: unknown[],
  stagiaireCatalogues: CatalogueFormation[]
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

    // Group quizzes by formation
    const quizzesByFormation = (notPlayedQuizzes as unknown[]).reduce(
      (acc, q) => {
        const formationId = getQuizFormationId(q);
        if (formationId && formationIds.includes(formationId)) {
          if (!acc[formationId]) acc[formationId] = [];
          (acc[formationId] as unknown[]).push(q);
        }
        return acc;
      },
      {} as Record<number, unknown[]>
    );

    // Shuffle helper
    const shuffle = <T,>(arr: T[]) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      return a;
    };

    // Logic for selecting quizzes
    if (formationIds.length) {
      const dayIndex = dayjs()
        .tz("Europe/Paris")
        .diff(dayjs("1970-01-01"), "day");
      const chosenIndex = Math.abs(dayIndex) % formationIds.length;
      const chosenFormationId = formationIds[chosenIndex];

      const chosenQuizzes = (quizzesByFormation[chosenFormationId] ||
        []) as unknown[];
      const shuffledChosen = shuffle(chosenQuizzes);
      const selected = shuffledChosen.slice(0, 3);

      if (selected.length >= 3) return selected.map((s) => s as Quiz);

      const remainingNeeded = 3 - selected.length;
      const otherFormationIds = formationIds.filter(
        (id) => id !== chosenFormationId
      );
      const pool = otherFormationIds.flatMap(
        (id) => (quizzesByFormation[id] || []) as unknown[]
      );
      const shuffledPool = shuffle(pool);
      const fillers = shuffledPool.slice(0, remainingNeeded);

      return [...selected, ...fillers].slice(0, 3).map((s) => s as Quiz);
    }

    // Fallback
    const globalPool = shuffle(notPlayedQuizzes as unknown[]).slice(0, 3);
    return globalPool.map((s) => s as Quiz);
  }, [quizzes, history, stagiaireCatalogues]);
};
