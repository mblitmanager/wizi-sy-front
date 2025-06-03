import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import StatsSummary from "@/components/profile/StatsSummary";
import FormationCatalogue from "@/components/profile/FormationCatalogue";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLoadProfile } from "@/use-case/hooks/profile/useLoadProfile";
import { useLoadQuizData } from "@/use-case/hooks/profile/useLoadQuizData";
import { useLoadRankings } from "@/use-case/hooks/profile/useLoadRankings";
import { useLoadFormations } from "@/use-case/hooks/profile/useLoadFormations";
import { RecentResults } from "@/components/profile/RecentResults";
import CategoryProgress from "@/components/profile/CategoryProgress";
import UserStats from "@/components/profile/UserStats";
import type { QuizHistory as QuizHistoryType } from "@/types/quiz";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import ProfileHeader from "@/components/profile/ProfileHeader";

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab] = useState(activeTabFromUrl);
  const { toast } = useToast();

  const user = useLoadProfile();
  const { results, categories } = useLoadQuizData();
  const { userProgress, rankings } = useLoadRankings();
  const formations = useLoadFormations();
  const [quizHistory, setQuizHistory] = useState<QuizHistoryType[]>([]);

  const isLoading = !user || !categories || !userProgress || !formations;

  // Mémoïsation des composants enfants pour éviter des rendus inutiles
  const MemoizedProfileHeader = useMemo(() => {
    return <ProfileHeader user={user} userProgress={userProgress} />;
  }, [user, userProgress]);

  const MemoizedUserStats = useMemo(() => {
    return <UserStats user={user} userProgress={userProgress} />;
  }, [user, userProgress]);

  const MemoizedCategoryProgress = useMemo(() => {
    return (
      <CategoryProgress categories={categories} userProgress={userProgress} />
    );
  }, [categories, userProgress]);

  const MemoizedRecentResults = useMemo(() => {
    return (
      <RecentResults
        results={quizHistory}
        isLoading={isLoading}
        showAll={false}
      />
    );
  }, [quizHistory, isLoading]);

  const MemoizedFormationCatalogue = useMemo(() => {
    return <FormationCatalogue formations={formations} />;
  }, [formations]);

  // Chargement asynchrone de l'historique des quiz
  useEffect(() => {
    if (!user) return; // Ne pas charger si l'utilisateur n'est pas disponible

    const fetchQuizHistory = async () => {
      try {
        const history = await quizSubmissionService.getQuizHistory();
        setQuizHistory(history);
      } catch (error) {
        console.error("Error fetching quiz history:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des quiz",
          variant: "destructive",
        });
      }
    };

    fetchQuizHistory();
  }, [user, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-5">
          {/* Squelette de chargement optimisé */}
          <div className="flex items-center space-x-4 mt-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((key) => (
              <div
                key={key}
                className="p-4 bg-white rounded-2xl shadow space-y-2 animate-pulse"
              >
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-6 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 space-y-3 bg-white rounded-2xl shadow animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((key) => (
                <div key={key} className="h-5 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="p-4 bg-white rounded-2xl shadow">
              <div className="w-full aspect-video bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4">
          <div className="flex flex-col items-center lg:flex-row">
            {/* Partie principale - Utilisation des composants mémoïsés */}
            <div className="w-full mt-6 p-6 lg:w-2/4 lg:order-2 lg:mt-0">
              {MemoizedProfileHeader}
            </div>

            {/* Sidebar stats */}
            <div className="dark:bg-gray-700 p-6 lg:w-2/4 lg:order-1">
              {MemoizedUserStats}
            </div>
          </div>
        </div>

        {/* Contenu principal avec composants mémoïsés */}
        <div className="space-y-4 px-2 sm:px-0">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
              Votre progression
            </h3>
            <div className="overflow-x-auto">{MemoizedCategoryProgress}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
              Résultats récents
            </h3>
            <div className="overflow-x-auto">{MemoizedRecentResults}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
              Mes formations
            </h3>
            {MemoizedFormationCatalogue}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ProfilePage;
