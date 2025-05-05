import { useEffect, useState } from "react";
import { mediaService } from "@/services";
import { Media } from "@/types/media";
import { MediaList, MediaPlayer, MediaTabs } from "@/components/Media";
import HeaderSection from "@/components/features/HeaderSection";
import { catalogueFormationApi } from "@/services/catalogueFormationApi";
import { Layout } from "@/components/layout/Layout";

interface Formation {
  id: string;
  titre: string;
}

export default function TutoAstucePage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(
    null
  );

  const [tutoriels, setTutoriels] = useState<Media[]>([]);
  const [astuces, setAstuces] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"tutoriel" | "astuce">("tutoriel");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);


  const medias = activeCategory === "tutoriel" ? tutoriels : astuces;

  // Charger la liste des formations
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const stagiaireId = "some-stagiaire-id"; // Replace with actual logic to get stagiaire ID
        const res = await catalogueFormationApi.getCatalogueFormation(stagiaireId);
        const formationsRaw = res.data?.data?.data;
        if (Array.isArray(formationsRaw)) {
          setFormations(formationsRaw);
        } else {
          console.error("Format inattendu :", res.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des formations :", error);
      }
    };

    fetchFormations();
  }, []);

  // Charger les médias en fonction de la formation sélectionnée ou tous par défaut
  useEffect(() => {
    const fetchMedias = async () => {
      setIsLoading(true);
      try {
        if (selectedFormationId) {
          const [tutoRes, astuceRes] = await Promise.all([
            mediaService.getTutorielByFormationId(selectedFormationId),
            mediaService.getAstuceByFormationId(selectedFormationId),
          ]);
          setTutoriels(tutoRes.data);
          setAstuces(astuceRes.data);
        } else {
          const [tutoRes, astuceRes] = await Promise.all([
            mediaService.getTutoriels(),
            mediaService.getAstuces(),
          ]);

          setTutoriels(tutoRes.data.data);
          setAstuces(astuceRes.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des médias :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedias();
  }, [selectedFormationId]);

  // Mettre à jour le média sélectionné
  useEffect(() => {
    const currentData = activeCategory === "tutoriel" ? tutoriels : astuces;
    if (currentData.length > 0) {
      setSelectedMedia(currentData[0]);
    } else {
      setSelectedMedia(null);
    }
  }, [activeCategory, tutoriels, astuces, medias]);

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
        <HeaderSection titre="Tutoriels & Astuces" buttonText="Retour" />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <MediaTabs active={activeCategory} onChange={setActiveCategory} />
          <div className="flex justify-center">
            <select
              value={selectedFormationId ?? ""}
              onChange={(e) => setSelectedFormationId(e.target.value || null)}
              className="px-3 py-1.5 text-sm sm:text-base min-w-[180px] sm:min-w-[250px] bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200">
              <option value="">Toutes les formations</option>
              {formations.map((formation) => (
                <option key={formation.id} value={formation.id}>
                  {formation.titre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : medias.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Aucun média disponible pour cette catégorie.
          </div>
        ) : (
          <div className="flex flex-col sm:gap-4 md:grid md:grid-cols-2 bg-white rounded-2xl shadow-lg gap-6 mt-6">
            <div className="p-3 sm:p-4 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[90vh]">
              <MediaList
                medias={medias}
                selectedMedia={selectedMedia}
                onSelect={setSelectedMedia}
              />
            </div>
            <div className="p-3 sm:p-4">
              <MediaPlayer media={selectedMedia} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
