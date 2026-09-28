import { Layout } from "@/components/layout/Layout";
import ParrainageSection from "@/components/profile/ParrainageSection";
import { checkAndAnnounceAchievements } from "@/services/achievementsApi";

export default function Parainage() {
  return (
    <Layout>
      {/* Un parrainage réussi peut débloquer un badge */}
      <ParrainageSection onParrainageSuccess={() => checkAndAnnounceAchievements()} />
    </Layout>
  );
}
