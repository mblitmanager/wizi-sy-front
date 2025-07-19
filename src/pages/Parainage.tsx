import { Layout } from "@/components/layout/Layout";
import ParrainageSection from "@/components/profile/ParrainageSection";
import axios from "axios";
import { useUser } from "@/hooks/useAuth";

// Déclenche le badge premier parrainage après succès (exemple d'intégration)
export function useParrainageBadge() {
  const { user } = useUser();
  const triggerBadge = async () => {
    if (user && localStorage.getItem("token")) {
      await axios.post(
        "/api/stagiaire/achievements/check",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }
  };
  return triggerBadge;
}

export default function Parainage() {
  const triggerBadge = useParrainageBadge();
  // À appeler dans le callback de succès du parrainage : triggerBadge();
  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        <ParrainageSection onParrainageSuccess={triggerBadge} />
      </div>
    </Layout>
  );
}
