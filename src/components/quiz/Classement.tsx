
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStats } from "./classement/ProfileStats";
import { GlobalRanking } from "./classement/GlobalRanking";
import { QuizHistory } from "./classement/QuizHistory";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import type { QuizHistory as QuizHistoryType } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  const [refresh, setRefresh] = useState(false);
  const { toast } = useToast();

  const fetchAllData = async () => {
    setLoading({
      profile: true,
      history: true,
      stats: true,
      ranking: true,
    });
    
    try {
      const [profileData, stats, ranking, history] = await Promise.all([
        quizSubmissionService.getStagiaireProfile(),
        quizSubmissionService.getQuizStats(),
        quizSubmissionService.getGlobalClassement(),
        quizSubmissionService.getQuizHistory()
      ]);
      
      setProfile(profileData);
      setQuizStats(stats);
      
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
      setQuizHistory(history);
      
      toast({
        title: "Mise à jour des données",
        description: "Les informations ont été actualisées avec succès.",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading({
        profile: false,
        history: false,
        stats: false,
        ranking: false,
      });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [refresh]);

  // Calculate user stats from global ranking
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

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
          Mon classement
        </h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={loading.profile || loading.ranking || loading.history || loading.stats}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${(loading.profile || loading.ranking || loading.history || loading.stats) ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      <div className="w-full">
        <ProfileStats
          profile={profile}
          stats={stats}
          loading={loading.profile || loading.ranking}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ranking" className="mt-6">
        <TabsList className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-2 shadow-sm">
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
              onRefresh={handleRefresh}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
            <QuizHistory 
              history={quizHistory} 
              loading={loading.history} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
