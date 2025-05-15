import { UserProgress, QuizStats, QuizHistory } from "@/types/quiz";
import { ProfileStats } from "@/components/quiz/classement/ProfileStats";
import React, { useEffect, useState } from "react";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";

interface StatsSummaryProps {
  userProgress: UserProgress | null;
}

// Define types for profile and ranking
interface StagiaireProfile {
  stagiaire: {
    id: number | string;
    prenom: string;
    image?: string | null;
    // ...other fields as needed
  };
  // ...other fields as needed
}

interface GlobalRankingEntry {
  id: number | string;
  name: string;
  image?: string | null;
  score: number;
  quizCount: number;
  averageScore: number;
  rang: number;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ userProgress }) => {
  // Hooks must be called unconditionally
  const [profile, setProfile] = useState<StagiaireProfile | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [globalRanking, setGlobalRanking] = useState<GlobalRankingEntry[]>([]);
  const [loading, setLoading] = useState({
    profile: true,
    history: true,
    stats: true,
    ranking: true,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await quizSubmissionService.getStagiaireProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading((prev) => ({ ...prev, profile: false }));
      }
    };

    const fetchQuizStats = async () => {
      try {
        const stats = await quizSubmissionService.getQuizStats();
        setQuizStats(stats);
      } catch (error) {
        console.error("Error fetching quiz stats:", error);
      } finally {
        setLoading((prev) => ({ ...prev, stats: false }));
      }
    };

    const fetchGlobalRanking = async () => {
      try {
        const ranking = await quizSubmissionService.getGlobalClassement();
        const mappedRanking = (ranking || []).map((item: any) => ({
          id: item.stagiaire.id,
          name: item.stagiaire.prenom,
          image: item.stagiaire.image,
          score: item.totalPoints,
          quizCount: item.quizCount,
          averageScore: item.averageScore,
          rang: item.rang,
        }));
        setGlobalRanking(mappedRanking);
      } catch (error) {
        console.error("Error fetching global ranking:", error);
      } finally {
        setLoading((prev) => ({ ...prev, ranking: false }));
      }
    };

    const fetchQuizHistory = async () => {
      try {
        const history = await quizSubmissionService.getQuizHistory();
        setQuizHistory(history);
      } catch (error) {
        console.error("Error fetching quiz history:", error);
      } finally {
        setLoading((prev) => ({ ...prev, history: false }));
      }
    };

    fetchProfileData();
    fetchQuizStats();
    fetchGlobalRanking();
    fetchQuizHistory();
  }, []);

  // Don't render if no userProgress
  if (!userProgress) return null;

  // Calcul des stats utilisateur à partir du classement global
  const userEntry = globalRanking.find(
    (entry) => entry.id?.toString() === profile?.stagiaire?.id?.toString()
  );
  const stats = userEntry
    ? {
        totalScore: userEntry.score || 0,
        totalQuizzes: userEntry.quizCount || 0,
        averageScore: userEntry.averageScore || 0,
      }
    : {
        totalScore: 0,
        totalQuizzes: 0,
        averageScore: 0,
      };

  return (
    <div className="w-full">
      <ProfileStats
        profile={profile}
        stats={stats}
        loading={loading.profile || loading.ranking}
      />
    </div>
  );
};

export default StatsSummary;
