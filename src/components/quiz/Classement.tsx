import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStats } from "./classement/ProfileStats";
import { GlobalRanking } from "./classement/GlobalRanking";
import { QuizHistory } from "./classement/QuizHistory";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import type { QuizHistory as QuizHistoryType } from "@/types/quiz";

export function Classement() {
  const [profile, setProfile] = useState<any>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryType[]>([]);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [globalRanking, setGlobalRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    profile: true,
    history: true,
    stats: true,
    ranking: true,
  });
console.log("globalRanking", globalRanking);
console.log("profile", profile);
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mon classement</h1>

      <ProfileStats profile={profile} stats={quizStats} loading={loading.profile || loading.stats} />

      <Tabs defaultValue="ranking" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ranking">Classement global</TabsTrigger>
          <TabsTrigger value="history">Mon historique</TabsTrigger>
        </TabsList>
        <TabsContent value="ranking">
          <GlobalRanking ranking={globalRanking} loading={loading.ranking} currentUserId={profile?.stagiaire?.id?.toString()} />
        </TabsContent>
        <TabsContent value="history">
          <QuizHistory history={quizHistory} loading={loading.history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
