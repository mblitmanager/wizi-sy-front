import { useEffect, useRef, useState } from "react";
import { mediaService } from "@/services";
import { Media } from "@/types/media";
import { MediaList, MediaPlayer, MediaTabs } from "@/Media";
import HeaderSection from "@/components/features/HeaderSection";
import { Layout } from "@/components/layout/Layout";
import { formationApi } from "@/services/api";
import { FixedSizeList as VirtualizedList } from "react-window";

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
  const [activeCategory, setActiveCategory] = useState<"tutoriel" | "astuce">(
    "tutoriel"
  );
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const mediaCache = useRef<{
    [key: string]: { tutoriels: Media[]; astuces: Media[] };
  }>({});

  const medias = activeCategory === "tutoriel" ? tutoriels : astuces;
  const firstLoadRef = useRef(true);

  // Charger les formations et tous les médias initiaux
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [formationsRes, tutoRes, astuceRes] = await Promise.all([
          formationApi.getFormations(),
          mediaService.getTutoriels(),
          mediaService.getAstuces(),
        ]);

        const formationsRaw = formationsRes.data?.data?.data || [];
        setFormations(formationsRaw);

        const tutorielsData = tutoRes.data?.data || [];
        const astucesData = astuceRes.data || [];

        setTutoriels(tutorielsData);
        setAstuces(astucesData);

        // Mise en cache
        mediaCache.current["all"] = {
          tutoriels: tutorielsData,
          astuces: astucesData,
        };
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données initiales :",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Charger les médias selon la formation sélectionnée
  useEffect(() => {
    const fetchMedias = async () => {
      setIsLoading(true);

      const cacheKey = selectedFormationId || "all";

      if (mediaCache.current[cacheKey]) {
        const cached = mediaCache.current[cacheKey];
        setTutoriels(cached.tutoriels);
        setAstuces(cached.astuces);
        setIsLoading(false);
        return;
      }

      try {
        let tutorielsData: Media[] = [];
        let astucesData: Media[] = [];

        if (selectedFormationId) {
          const [tutoRes, astuceRes] = await Promise.all([
            mediaService.getTutorielByFormationId(selectedFormationId),
            mediaService.getAstuceByFormationId(selectedFormationId),
          ]);
          tutorielsData = tutoRes.data;
          astucesData = astuceRes.data;
        } else {
          const [tutoRes, astuceRes] = await Promise.all([
            mediaService.getTutoriels(),
            mediaService.getAstuces(),
          ]);
          tutorielsData = tutoRes.data?.data || [];
          astucesData = astuceRes.data || [];
        }

        setTutoriels(tutorielsData);
        setAstuces(astucesData);

        mediaCache.current[cacheKey] = {
          tutoriels: tutorielsData,
          astuces: astucesData,
        };
      } catch (error) {
        console.error("Erreur lors du chargement des médias :", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Empêche le rechargement immédiat après le premier useEffect
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }

    fetchMedias();
  }, [selectedFormationId]);

  // Mettre à jour le média sélectionné par défaut
  useEffect(() => {
    const currentData = activeCategory === "tutoriel" ? tutoriels : astuces;
    setSelectedMedia(currentData.length > 0 ? currentData[0] : null);
  }, [activeCategory, tutoriels, astuces]);

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
              className="px-3 py-1.5 text-sm sm:text-base min-w-[180px] sm:min-w-[250px] bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200">
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
            <div className="p-3 sm:p-4 overflow-y-auto max-h-[60vh]">
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
