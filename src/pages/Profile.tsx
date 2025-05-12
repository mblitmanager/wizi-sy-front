
import { Layout } from "@/components/layout/Layout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsSummary from "@/components/profile/StatsSummary";
import UserStats from "@/components/profile/UserStats";
import { RecentResults } from "@/components/profile/RecentResults";
import CategoryProgress from "@/components/profile/CategoryProgress";
import BadgesDisplay from "@/components/profile/BadgesDisplay";
import ParrainageSection from "@/components/profile/ParrainageSection";
import ContactsSection from "@/components/profile/ContactsSection";
import { useToast } from "@/hooks/use-toast";
import { useLoadProfile } from "@/use-case/hooks/profile/useLoadProfile";
import { useLoadQuizData } from "@/use-case/hooks/profile/useLoadQuizData";
import { useLoadRankings } from "@/use-case/hooks/profile/useLoadRankings";
import { useLoadFormations } from "@/use-case/hooks/profile/useLoadFormations";
import { NotificationBanner } from "@/components/quiz/NotificationBanner";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProfilePage = () => {
  const { toast } = useToast();

  const user = useLoadProfile();
  const { results, categories } = useLoadQuizData();
  const { userProgress, rankings } = useLoadRankings();
  const formations = useLoadFormations();

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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
        <NotificationBanner className="mb-6" />
        {user && <ProfileHeader user={user} />}
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="mt-8 space-y-8 pb-10">
            {/* Vue d'ensemble complète */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Vue d'ensemble</h2>
              
              {/* Statistiques utilisateur */}
              <div className="mb-8">
                {userProgress && <UserStats user={user} userProgress={userProgress} />}
              </div>
              
              {/* Statistiques globales */}
              <div className="mb-8">
                {userProgress && <StatsSummary userProgress={userProgress} />}
              </div>
              
              {/* Progression par catégorie */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Progression par catégorie</h3>
                <CategoryProgress categories={categories} userProgress={userProgress} />
              </div>
              
              {/* Résultats récents */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Résultats récents</h3>
                <RecentResults results={results} isLoading={isLoading} showAll={true} />
              </div>
              
              {/* Section Parrainage */}
              <div className="mb-8">
                <ParrainageSection />
              </div>
              
              {/* Badges */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Mes badges</h3>
                <BadgesDisplay />
              </div>
              
              {/* Contacts */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Contacts</h3>
                <ContactsSection />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
};

export default ProfilePage;
