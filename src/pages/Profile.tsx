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

const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  const { toast } = useToast();

  const user = useLoadProfile();
  const { results, categories } = useLoadQuizData();
  console.log("results", results);
  console.log("categories", categories);
  console.log("user", user);
  const { userProgress, rankings } = useLoadRankings();
  console.log("userProgress", userProgress);
  console.log("rankings", rankings);
  const formations = useLoadFormations();
  console.log("formations", formations);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const isLoading = !user;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl space-y-12">
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
                className="p-4 bg-white rounded-2xl shadow space-y-3 animate-pulse">
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
      <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
        {user && <ProfileHeader user={user} />}
        <div className="mt-16 space-y-12">
          {userProgress && <StatsSummary userProgress={userProgress} />}
          <FormationCatalogue formations={formations} />
        </div>
        <ProfileTabs
          user={user}
          results={results}
          categories={categories}
          userProgress={userProgress}
          isLoading={isLoading}
          rankings={rankings}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
      </div>
    </Layout>
  );
};

export default ProfilePage;
