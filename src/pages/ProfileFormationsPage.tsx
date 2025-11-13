import { Layout } from "@/components/layout/Layout";
import { useUser } from "@/hooks/useAuth";
import { useLoadFormations } from "@/use-case/hooks/profile/useLoadFormations";
import { Link } from "react-router-dom";
import FormationCatalogue from "@/components/profile/FormationCatalogue";

const ProfileFormationsPage = () => {
  const { user } = useUser();
  const { formations, loading, error } = useLoadFormations(
    user?.stagiaire?.id ?? null
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Link
            to="/profile"
            className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 mb-4">
            ← Retour au profil
          </Link>
          <h1 className="text-2xl font-bold font-montserrat dark:text-white">
            Mes Formations
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérer et suivre vos formations en cours
          </p>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <FormationCatalogue formations={formations || []} isLoading={loading} />
      </div>
    </Layout>
  );
};

export default ProfileFormationsPage;
