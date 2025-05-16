import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStats } from "./classement/ProfileStats";
import { GlobalRanking } from "./classement/GlobalRanking";
import { QuizHistory } from "./classement/QuizHistory";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import type { QuizHistory as QuizHistoryType } from "@/types/quiz";
import useAdvert from "../publiciter/useAdvert";
import AdvertBanner from "../publiciter/AdvertBanner";

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

  const { isVisible, message, closeAdvert } = useAdvert(
    "Je parraine et je gagne 50 € !"
  );

  return (
    <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <h1 className="text-3xl text-blue-custom-100 font-bold mb-8">
        Mon classement
      </h1>
      {isVisible && <AdvertBanner message={message} onClose={closeAdvert} />}
      {/* Statistiques */}
      <div className="w-full">
        <ProfileStats
          profile={profile}
          stats={stats}
          loading={loading.profile || loading.ranking}
        />
      </div>
      <hr className="mn-2" />
      <div className="mt-2 h-[calc(100vh-35rem)] overflow-y-auto p-4">
        {/* Tabs */}
        <Tabs defaultValue="ranking" className="mt-6">
          <TabsList className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 shadow-sm">
            <TabsTrigger
              value="ranking"
              className="text-xs sm:text-sm md:text-base font-medium py-2 px-3 lg:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Classement global
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-xs sm:text-sm md:text-base font-medium py-2 px-3 lg:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Mon historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ranking" className="mt-4">
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <GlobalRanking
                ranking={globalRanking}
                loading={loading.ranking}
                currentUserId={profile?.stagiaire?.id?.toString()}
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <QuizHistory history={quizHistory} loading={loading.history} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
