import { useEffect, useState } from "react";
import { rankingService } from "@/services/rankingService";
import { UserProgress, LeaderboardEntry } from "@/types/quiz";
import { useUser } from "@/hooks/useAuth";

export const useLoadRankings = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const { user } = useUser();
  interface Ranking {
    id: number;
    name: string;
    score: number;
  }

  const [rankings, setRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    // Skip if user is formateur/formatrice
    const role = user?.role || (user as any)?.user?.role;
    if (role === "formateur" || role === "formatrice") {
      return;
    }

    const fetchProgressAndRankings = async () => {
      try {
        const [progressRes, rankingsRes] = await Promise.all([
          rankingService.getUserProgress(),
          rankingService.getGlobalRanking(),
        ]);

        if (progressRes?.total) {
          setUserProgress({
            totalScore: progressRes.total.points || 0,
            completedQuizzes: progressRes.total.completed_quizzes || 0,
            averageScore: progressRes.total.average_score || 0,
            level: progressRes.total.level || 1,
          });
        }

        setRankings(
          (rankingsRes || []).map((entry: any) => ({
            id: entry.stagiaire?.id
              ? Number(entry.stagiaire.id)
              : entry.id
                ? Number(entry.id)
                : 0,
            name:
              entry.stagiaire?.prenom ||
              entry.firstname ||
              entry.name ||
              "Unknown",
            score:
              entry.totalPoints ??
              entry.points ??
              entry.score ??
              entry.total_points ??
              0,
          })),
        );
      } catch (error) {
        console.error("Error fetching progress and rankings:", error);
      }
    };

    fetchProgressAndRankings();
  }, [user]);

  return { userProgress, rankings };
};
