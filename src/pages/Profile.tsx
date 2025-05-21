import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsSummary from "@/components/profile/StatsSummary";
import FormationCatalogue from "@/components/profile/FormationCatalogue";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useToast } from "@/hooks/use-toast";
import { useLoadProfile } from "@/use-case/hooks/profile/useLoadProfile";
import { useLoadQuizData } from "@/use-case/hooks/profile/useLoadQuizData";
import { useLoadRankings } from "@/use-case/hooks/profile/useLoadRankings";
import { useLoadFormations } from "@/use-case/hooks/profile/useLoadFormations";
import { RecentResults } from "@/components/profile/RecentResults";
import RankingComponent from "@/components/Ranking/RankingComponent";
import CategoryProgress from "@/components/profile/CategoryProgress";
import UserStats from "@/components/profile/UserStats";

const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  const { toast } = useToast();

  const user = useLoadProfile();
  const { results, categories } = useLoadQuizData();
  const { userProgress, rankings } = useLoadRankings();
  const formations = useLoadFormations();

  const isLoading = !user;

  // Transform rankings data
  const safeRankings =
    rankings?.map((entry, index) => ({
      stagiaire: {
        id: entry?.stagiaire?.id || entry?.id?.toString() || `rank-${index}`,
        prenom: entry?.stagiaire?.prenom || entry?.prenom || "Anonyme",
        image: null,
      },
      totalPoints: entry?.totalPoints || entry?.points || 0,
      quizCount: entry?.quizCount || entry?.completed_quizzes || 0,
      averageScore: entry?.averageScore || entry?.average_score || 0,
      rang: entry?.rang || index + 1,
    })) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:pb-4 max-w-7xl space-y-5">
          {/* En-tête profil */}
          <div className="flex items-center space-x-4 mt-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 bg-white rounded-2xl shadow space-y-2 animate-pulse"
              >
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-6 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>

          {/* Section principale (catalogue + tableau/résultats) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 space-y-3 bg-white rounded-2xl shadow animate-pulse">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-5 bg-gray-200 rounded" />
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
      <div className="container mx-auto px-4 md:pb-4 max-w-7xl">
        {/* <div className="mt-2 h-[calc(100vh-8rem)] overflow-y-auto p-4"> */}
        {user && <ProfileHeader user={user} />}

        {/* Contenu des anciens onglets maintenant affiché directement */}
        <div className="space-y-4 px-2 sm:px-0">
          {/* Section Vue d'ensemble - 1 colonne mobile, 2 desktop */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
              <UserStats user={user} userProgress={userProgress} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 font-montserrat dark:text-white">
                Résultats récents
              </h3>
              <div className="overflow-x-auto">
                <RecentResults results={results} isLoading={isLoading} />
              </div>
            </div>
          </div>

          {/* Section Progression */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
              Votre progression
            </h3>
            <div className="overflow-x-auto">
              <CategoryProgress
                categories={categories}
                userProgress={userProgress}
              />
            </div>
          </div>

          {/* Section Résultats complets */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
              Tous vos résultats
            </h3>
            <div className="overflow-x-auto">
              <RecentResults
                results={results}
                isLoading={isLoading}
                showAll={true}
              />
            </div>
          </div>

          {/* Section Classement */}
          {/* <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
                Classement Global
              </h3>
              <div className="overflow-x-auto">
                <RankingComponent rankings={safeRankings} />
              </div>
            </div> */}

          {/* Section Formations */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
              Formations disponibles
            </h3>
            <FormationCatalogue formations={formations} />
          </div>
        </div>
      </div>
      {/* </div> */}
    </Layout>
  );
};

export default ProfilePage;
