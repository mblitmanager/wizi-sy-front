import { useEffect, useMemo, useState } from "react";
import { useMediaByFormation } from "@/use-case/hooks/media/useMediaByFormation";
import { MediaList, MediaPlayer, MediaTabs } from "@/Media";
import HeaderSection from "@/components/features/HeaderSection";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/hooks/useAuth";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";
import {
  ChevronDown,
  FileIcon,
  FilmIcon,
  Music2Icon,
  PhoneOutgoingIcon,
} from "lucide-react";

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
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

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

  const groupedMedias = useMemo(() => {
    return medias.reduce((acc, media) => {
      if (!acc[media.categorie]) {
        acc[media.categorie] = [];
      }
      acc[media.categorie].push(media);
      return acc;
    }, {} as Record<string, Media[]>);
  }, [medias]);

  const groupedMediasByType = useMemo(() => {
    const result: Record<string, Record<string, Media[]>> = {};

    medias.forEach((media) => {
      if (!result[media.type]) result[media.type] = {};
      if (!result[media.type][media.categorie])
        result[media.type][media.categorie] = [];
      result[media.type][media.categorie].push(media);
    });

    return result;
  }, [medias]);

  const mediaTypeIcons = {
    video: <FilmIcon className="w-4 h-4 text-red-500" />,
    image: <PhoneOutgoingIcon className="w-4 h-4 text-blue-500" />,
    audio: <Music2Icon className="w-4 h-4 text-purple-500" />,
    document: <FileIcon className="w-4 h-4 text-green-500" />,
  };

  const mediaTypeLabels = {
    video: "Vidéos",
    image: "Images",
    audio: "Audios",
    document: "Documents",
  };

  useEffect(() => {
    // Ne mettez à jour selectedMedia que si nécessaire
    if (medias.length > 0) {
      setSelectedMedia((prev) =>
        prev && medias.some((m) => m.id === prev.id) ? prev : medias[0]
      );
    } else {
      setSelectedMedia(null);
    }

    // Mettez à jour expandedSections de manière plus conservative
    setExpandedSections((prev) => {
      const newExpanded = { ...prev };
      let hasChanged = false;

      Object.keys(groupedMediasByType).forEach((type) => {
        Object.keys(groupedMediasByType[type]).forEach((category) => {
          const key = `${type}-${category}`;
          if (newExpanded[key] === undefined) {
            newExpanded[key] = true;
            hasChanged = true;
          }
        });
      });

      return hasChanged ? newExpanded : prev;
    });
  }, [activeCategory, groupedMediasByType, medias, medias.length]); // Dépendances plus stables

  // Sélectionner la première formation par défaut
  useEffect(() => {
    if (!selectedFormationId && formationsWithTutos.length > 0) {
      setSelectedFormationId(formationsWithTutos[0].id.toString());
    }
    // eslint-disable-next-line
  }, [formationsWithTutos]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const MobileView = () => (
    <div className="lg:hidden flex flex-col h-auto">
      {/* Player en plein écran */}
      <div className="flex-1 bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        <div className="aspect-video w-full">
          <MediaPlayer
            key={selectedMedia?.id || "empty"}
            media={selectedMedia}
          />
        </div>
      </div>

      {/* Contrôles et liste */}
      <div className="bg-white rounded-lg shadow-md flex flex-col mb-8 max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : medias.length === 0 ? (
          <div className="text-center text-gray-500 py-3">
            Aucun média disponible
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {Object.entries(groupedMediasByType).map(([type, categories]) => (
              <div key={type} className="mb-4">
                {/* Activation de l'accordéon sur le type */}
                <div
                  className="flex items-center gap-2 mx-3 mb-2 px-2 py-1 bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [type]: !prev[type],
                    }))
                  }>
                  {mediaTypeIcons[type]}
                  <span className="font-medium text-sm">
                    {mediaTypeLabels[type]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform ${
                      expandedSections[type] ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Affichage des catégories si le type est ouvert */}
                {expandedSections[type] &&
                  Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="mb-2 mx-3">
                      <div className="mt-1 space-y-1">
                        {items.map((media) => (
                          <div
                            key={media.id}
                            onClick={() => setSelectedMedia(media)}
                            className={`p-2 text-xs rounded flex items-center gap-2 ${
                              selectedMedia?.id === media.id
                                ? "bg-orange-50 text-brown-600 border-l-2 border-orange-500"
                                : "hover:bg-gray-50"
                            }`}>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                selectedMedia?.id === media.id
                                  ? "bg-brown-shade"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span className="truncate flex-1">
                              {media.titre}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {media.duree} min
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const DesktopView = () => (
    <div className="hidden lg:flex flex-col h-[calc(100vh-180px)]">
      {/* Contenu principal */}
      {isLoading ? (
        <MediaSkeleton />
      ) : medias.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Aucun média disponible
        </div>
      ) : (
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Playlist */}
          <div className="w-1/4 min-w-[300px] bg-white rounded-lg shadow-md p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Playlist</h2>

            {Object.entries(groupedMediasByType).map(([type, categories]) => (
              <div key={type} className="mb-6">
                {/* Activation de l'accordéon sur le type */}
                <div
                  className="flex items-center gap-2 mb-3 p-2 bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [type]: !prev[type],
                    }))
                  }>
                  {mediaTypeIcons[type]}
                  <span className="font-medium">{mediaTypeLabels[type]}</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform ${
                      expandedSections[type] ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Affichage des catégories si le type est ouvert */}
                {expandedSections[type] &&
                  Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="mb-4">
                      <ul className="mt-2 space-y-1 pl-2 border-l-2 border-gray-200">
                        {items.map((media) => (
                          <li
                            key={media.id}
                            onClick={() => setSelectedMedia(media)}
                            className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
                              selectedMedia?.id === media.id
                                ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500"
                                : "hover:bg-gray-50"
                            }`}>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                selectedMedia?.id === media.id
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span className="truncate flex-1 text-xs">
                              {media.titre}
                            </span>
                            <span className="text-xs text-gray-500">
                              {media.duree} min
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Player */}
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="w-full max-w-4xl mx-auto p-4">
              <div className="aspect-video w-full">
                <MediaPlayer
                  key={selectedMedia?.id || "empty"}
                  media={selectedMedia}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="mx-auto sm:px-2 lg:px-8 py-2 bg-gray-50 min-h-screen">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
            {/* <HeaderSection titre="Tutoriels & Astuces" buttonText="Retour" /> */}
            <div className="flex flex-col gap-2 w-full lg:flex-row lg:items-center lg:gap-4 lg:justify-between">
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <select
                  value={selectedFormationId ?? ""}
                  onChange={(e) =>
                    setSelectedFormationId(e.target.value || null)
                  }
                  className="w-full sm:w-auto px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg shadow-sm"
                  aria-label="Sélectionner une formation">
                  {formationsWithTutos.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.titre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:ml-auto lg:justify-end">
                <MediaTabs
                  active={activeCategory}
                  onChange={setActiveCategory}
                />
                <button
                  onClick={() => refetch()}
                  className="w-full sm:w-auto px-3 py-1 bg-yellow-400 text-white rounded-lg shadow text-sm lg:ml-2">
                  {isFetching ? "..." : "Rafraîchir"}
                </button>
              </div>
            </div>
          </div>
          <div className="block lg:hidden">
            <MobileView />
          </div>
          <div className="hidden lg:block">
            <DesktopView />
          </div>
        </div>
      </div>
    </Layout>
  );
}
