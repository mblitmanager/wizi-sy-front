import { useEffect, useState } from "react";
import { rankingService } from "@/services/rankingService";
import { UserProgress } from "@/types/quiz";

export const useLoadRankings = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  interface Ranking {
    id: number;
    name: string;
    score: number;
  }

  const [rankings, setRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    const fetchProgressAndRankings = async () => {
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
        (rankingsRes || []).map((entry: { stagiaire: { id: string; prenom: string }; totalPoints: number }) => ({
          id: entry.stagiaire?.id ? Number(entry.stagiaire.id) : 0,
          name: entry.stagiaire?.prenom || "Unknown",
          score: entry.totalPoints || 0,
        }))
      );
    };

    fetchProgressAndRankings();
  }, []);
  
  return { userProgress, rankings };
};
