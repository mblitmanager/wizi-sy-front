import { Layout } from "@/components/layout/Layout";
import ParrainageSection from "@/components/profile/ParrainageSection";
import { checkAndAnnounceAchievements } from "@/services/achievementsApi";

export default function Parainage() {
  return (
    <Layout>
      <div className="px-2 py-2 sm:px-4 lg:h-[calc(100vh-9rem)] lg:min-h-0 lg:overflow-hidden lg:px-6">
        {/* Un parrainage réussi peut débloquer un badge */}
        <ParrainageSection onParrainageSuccess={() => checkAndAnnounceAchievements()} />
      </div>
    </Layout>
  );
}
