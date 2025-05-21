import { useEffect, useState } from "react";
import { useMediaByFormation } from "@/use-case/hooks/media/useMediaByFormation";
import { MediaList, MediaPlayer, MediaTabs } from "@/Media";
import HeaderSection from "@/components/features/HeaderSection";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/context/UserContext";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";

// Composant de squelette de chargement
const MediaSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-6 mt-6">
    <div className="p-4 space-y-3 bg-white rounded-2xl shadow">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="h-6 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
    <div className="p-4 bg-white rounded-2xl shadow">
      <div className="w-full aspect-video bg-gray-200 rounded-xl animate-pulse" />
    </div>
  </div>
);

export default function TutoAstucePage() {
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(
    null
  );
  const [activeCategory, setActiveCategory] = useState<"tutoriel" | "astuce">(
    "tutoriel"
  );
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const { user } = useUser();
  const { data: formations = [] } = useFormationStagiaire(
    user?.stagiaire.id ?? null
  );
  const {
    data: mediasData,
    isLoading,
    isFetching,
    refetch,
  } = useMediaByFormation(selectedFormationId);
  const formationsWithTutos = formations.data ?? [];
  const tutoriels = mediasData?.tutoriels || [];
  const astuces = mediasData?.astuces || [];
  const medias = activeCategory === "tutoriel" ? tutoriels : astuces;

  useEffect(() => {
    setSelectedMedia(medias.length > 0 ? medias[0] : null);
  }, [activeCategory, medias]);

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
        <HeaderSection titre="Tutoriels & Astuces" buttonText="Retour" />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <MediaTabs active={activeCategory} onChange={setActiveCategory} />

          <div className="flex justify-center items-center gap-2">
            <select
              value={selectedFormationId ?? ""}
              onChange={(e) => setSelectedFormationId(e.target.value || null)}
              className="px-3 py-1.5 text-sm sm:text-base min-w-[180px] sm:min-w-[250px] bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200">
              <option>Sélectionnez une formation</option>
              {formationsWithTutos.map((formation) => (
                <option key={formation.id} value={formation.id}>
                  {formation.titre}
                </option>
              ))}
            </select>

            <button
              onClick={() => refetch()}
              className="text-sm px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl shadow transition duration-150">
              {isFetching ? "Chargement..." : "Rafraîchir"}
            </button>
          </div>
        </div>

        <hr />

        {isLoading ? (
          <MediaSkeleton />
        ) : medias.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Aucun média disponible pour cette catégorie.
          </div>
        ) : (
          <div className="flex flex-col sm:gap-4 md:grid md:grid-cols-2 bg-white rounded-2xl shadow-lg gap-6 mt-6">
            <div className="order-2 md:order-1 p-3 sm:p-4 overflow-y-auto max-h-[60vh] sm:max-h-none sm:overflow-auto">
              <MediaList
                medias={medias}
                selectedMedia={selectedMedia}
                onSelect={setSelectedMedia}
              />
            </div>

            <div className="order-1 md:order-2 p-3 sm:p-4 sticky top-0 bg-white rounded-2xl shadow-lg max-h-[60vh] sm:max-h-none overflow-hidden ">
              <MediaPlayer media={selectedMedia} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
