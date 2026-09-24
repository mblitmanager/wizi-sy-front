import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStats from "@/components/profile/UserStats";
import ContactSection from "@/components/FeatureHomePage/ContactSection";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import VideoUploader from "@/components/common/VideoUploader";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useAuth";
import { useCatalogueFormations } from "@/hooks/queries/useCatalogueQueries";
import { useUserAchievements, useUserProgress } from "@/hooks/queries/useProfileQueries";
import FormateurService from "@/services/FormateurService";
import type { Contact } from "@/types/contact";

function UserStatsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-1/2" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

const ProfilePage = () => {
  const { user, role } = useUser();
  const isTrainer = role === "formateur";
  const isAdmin = role === "admin" || !!user?.is_admin;

  const { data: userProgress = null, isLoading: progressLoading } = useUserProgress();
  const { data: achievements = [], isLoading: achievementsLoading } = useUserAchievements();
  const { data: catalogue = [] } = useCatalogueFormations();

  const { data: trainees, isLoading: traineesLoading } = useQuery<Contact[]>({
    queryKey: ["contacts", "trainees"],
    queryFn: () => FormateurService.getTraineesAsContacts(),
    enabled: isTrainer,
  });

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4">
          <div className="flex flex-col items-center lg:flex-row">
            <div className="w-full mt-6 p-6 lg:w-2/4 lg:order-2 lg:mt-0">
              <ProfileHeader
                user={user}
                userProgress={userProgress}
                achievements={achievements}
                achievementsLoading={achievementsLoading}
              />
            </div>

            {!isTrainer && (
              <div className="w-full dark:bg-gray-700 p-6 lg:w-2/4 lg:order-1">
                {progressLoading ? (
                  <UserStatsSkeleton />
                ) : (
                  <UserStats user={user} userProgress={userProgress} achievements={achievements} />
                )}
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
              Uploader une vidéo
            </h3>
            <VideoUploader />
          </div>
        )}

        {isTrainer ? (
          <ContactSection contacts={trainees} loading={traineesLoading} title="Mes Apprenants" />
        ) : (
          <ContactSection />
        )}

        {!isTrainer && catalogue.length > 0 && (
          <div className="mt-6">
            <AdCatalogueBlock formations={catalogue.slice(0, 4)} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
