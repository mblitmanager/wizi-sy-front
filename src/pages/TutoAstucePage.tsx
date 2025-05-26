import { useEffect, useMemo, useState } from "react";
import { useMediaByFormation } from "@/use-case/hooks/media/useMediaByFormation";
import { MediaList, MediaPlayer, MediaTabs } from "@/Media";
import HeaderSection from "@/components/features/HeaderSection";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/context/UserContext";
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
    return medias.reduce((acc, media) => {
      const type = media.type;
      if (!acc[type]) {
        acc[type] = {};
      }

      if (!acc[type][media.categorie]) {
        acc[type][media.categorie] = [];
      }
      acc[type][media.categorie].push(media);
      return acc;
    }, {} as Record<string, Record<string, Media[]>>);
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
    const newSelectedMedia = medias.length > 0 ? medias[0] : null;
    setSelectedMedia(newSelectedMedia);

    setExpandedSections((prev) => {
      const newExpanded = { ...prev };
      Object.keys(groupedMedias).forEach((key) => {
        newExpanded[key] = newExpanded[key] ?? true;
      });
      return newExpanded;
    });
  }, [activeCategory, medias, groupedMedias]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const MobileView = () => (
    <div className="lg:hidden flex flex-col h-auto ">
      {/* Player en plein écran */}
      <div className="flex-1 bg-white rounded-lg shadow-md mb-2 overflow-hidden">
        <MediaPlayer key={selectedMedia?.id || "empty"} media={selectedMedia} />
      </div>

      {/* Contrôles et liste */}
      <div className="bg-white rounded-lg shadow-md  flex flex-col mb-8">
        <div className="flex gap-2 mb-3">
          <MediaTabs active={activeCategory} onChange={setActiveCategory} />

          <select
            value={selectedFormationId ?? ""}
            onChange={(e) => setSelectedFormationId(e.target.value || null)}
            className="flex-1 text-sm bg-white border border-gray-300 rounded-lg px-2 py-1"
          >
            {formationsWithTutos.map((formation) => (
              <option key={formation.id} value={formation.id}>
                {formation.titre}
              </option>
            ))}
          </select>

          <button
            onClick={() => refetch()}
            className="px-2 bg-yellow-400 text-white rounded-lg shadow text-sm"
          >
            {isFetching ? "..." : "↻"}
          </button>
        </div>

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
                <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-gray-100 rounded-lg">
                  {mediaTypeIcons[type]}
                  <span className="font-medium text-sm">
                    {mediaTypeLabels[type]}
                  </span>
                </div>

                {Object.entries(categories).map(([category, items]) => (
                  <div key={category} className="mb-2 ml-4">
                    <div
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-sm"
                      onClick={() => toggleSection(`${type}-${category}`)}
                    >
                      <span className="font-medium">{category}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedSections[`${type}-${category}`]
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </div>

                    {expandedSections[`${type}-${category}`] && (
                      <div className="mt-1 space-y-1">
                        {items.map((media) => (
                          <div
                            key={media.id}
                            onClick={() => setSelectedMedia(media)}
                            className={`p-2 text-xs rounded flex items-center gap-2 ${
                              selectedMedia?.id === media.id
                                ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                selectedMedia?.id === media.id
                                  ? "bg-blue-500"
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
                    )}
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
    <div className="hidden lg:flex flex-col h-[calc(100vh-120px)]">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-4">
        <MediaTabs active={activeCategory} onChange={setActiveCategory} />

        <div className="flex gap-2">
          <select
            value={selectedFormationId ?? ""}
            onChange={(e) => setSelectedFormationId(e.target.value || null)}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg shadow-sm"
          >
            {formationsWithTutos.map((formation) => (
              <option key={formation.id} value={formation.id}>
                {formation.titre}
              </option>
            ))}
          </select>

          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-yellow-400 text-white rounded-lg shadow text-sm"
          >
            {isFetching ? "Chargement..." : "Rafraîchir"}
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      {isLoading ? (
        <MediaSkeleton />
      ) : medias.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Aucun média disponible
        </div>
      ) : (
        <div className="flex flex-1 gap-4 overflow-hidden p-4">
          {/* Playlist */}
          <div className="w-1/3 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Playlist</h2>

            {Object.entries(groupedMediasByType).map(([type, categories]) => (
              <div key={type} className="mb-6">
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-100 rounded-lg">
                  {mediaTypeIcons[type]}
                  <span className="font-medium">{mediaTypeLabels[type]}</span>
                </div>

                {Object.entries(categories).map(([category, items]) => (
                  <div key={category} className="mb-4 ml-4">
                    <div
                      className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-100 rounded"
                      onClick={() => toggleSection(`${type}-${category}`)}
                    >
                      <h3 className="font-semibold text-sm">{category}</h3>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedSections[`${type}-${category}`]
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </div>

                    {expandedSections[`${type}-${category}`] && (
                      <ul className="mt-2 space-y-1 pl-2 border-l-2 border-gray-200">
                        {items.map((media) => (
                          <li
                            key={media.id}
                            onClick={() => setSelectedMedia(media)}
                            className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
                              selectedMedia?.id === media.id
                                ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                selectedMedia?.id === media.id
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span className="truncate flex-1">
                              {media.titre}
                            </span>
                            <span className="text-xs text-gray-500">
                              {media.duree} min
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Player */}
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            <MediaPlayer
              key={selectedMedia?.id || "empty"}
              media={selectedMedia}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="mx-auto  sm:px-6 lg:px-8 py-4 bg-gray-50 min-h-screen">
        <HeaderSection titre="Tutoriels & Astuces" buttonText="Retour" />
        <MobileView />
        <DesktopView />
      </div>
    </Layout>
  );
}
