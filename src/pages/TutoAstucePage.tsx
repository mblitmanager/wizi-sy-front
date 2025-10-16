import { useEffect, useMemo, useState, useRef } from "react";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import apiClient from "@/lib/api-client";
import type { CatalogueFormation } from "@/types/stagiaire";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import {
  FilmIcon,
  PhoneOutgoingIcon,
  Music2Icon,
  FileIcon,
  ChevronDown,
  CheckCircle,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { useMediaByFormation } from "@/use-case/hooks/media/useMediaByFormation";
import { MediaPlayer, MediaTabs } from "@/Media";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/hooks/useAuth";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";

const MediaItem = ({
  media,
  isSelected,
  onClick,
  isWatched,
}: {
  media: Media;
  isSelected: boolean;
  onClick: () => void;
  isWatched: boolean;
}) => (
  <div
    onClick={onClick}
    className={`p-3 cursor-pointer transition-colors flex items-center gap-3 border-0 ${
      isSelected ? "bg-blue-50" : "hover:bg-gray-50"
    }`}>
    <div className={`p-2 ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
      <PlayCircle
        className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-500"}`}
      />
    </div>
    <div className="flex-1 min-w-0">
      <h3
        className={`text-sm font-medium truncate ${
          isWatched ? "text-green-600" : "text-gray-800"
        }`}>
        {media.titre}
      </h3>
    </div>
    {isWatched && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
  </div>
);
// Skeleton de chargement pour la liste des médias
const MediaSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-100 animate-pulse" />
    ))}
  </div>
);

interface MediaListSectionProps {
  type: string;
  icon: React.ReactNode;
  label: string;
  categories: Record<string, Media[]>;
  isExpanded: boolean;
  onToggle: () => void;
  selectedMedia: Media | null;
  onSelectMedia: (media: Media) => void;
}

const MediaListSection: React.FC<MediaListSectionProps> = ({
  type,
  icon,
  label,
  categories,
  isExpanded,
  onToggle,
  selectedMedia,
  onSelectMedia,
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-base">{label}</span>
        </div>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-200 transition"
          onClick={onToggle}
          aria-label={isExpanded ? `Réduire ${label}` : `Déplier ${label}`}>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Playlist always shown when expanded, description only when collapsed */}
      {isExpanded ? (
        <div className="mt-2">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="mb-2">
              <div className="font-semibold text-sm text-gray-600 mb-1 ml-3">
                {category}
              </div>
              <div className="space-y-1 ml-3">
                {items.map((media) => (
                  <MediaItem
                    key={media.id}
                    media={media}
                    isSelected={selectedMedia?.id === media.id}
                    isWatched={media.stagiaires?.[0]?.is_watched}
                    onClick={() => onSelectMedia(media)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 px-2">
          {selectedMedia ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">{selectedMedia.titre}</h3>
                {selectedMedia.stagiaires?.[0]?.is_watched && (
                  <span title="Déjà vu">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">
                {selectedMedia.description
                  ? stripHtmlTags(selectedMedia.description)
                  : "Aucune description disponible."}
              </p>
            </>
          ) : (
            <span className="text-gray-400 text-sm">
              Aucun média sélectionné
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const MediaPlayerSection = ({ media }: { media: Media | null }) => (
  <div className="bg-white rounded-xl shadow-sm p-0 sm:p-4 lg:col-span-2">
    {media ? (
      <>
        <div className="-mx-4 sm:mx-0">
          <div className="aspect-video bg-black rounded-none sm:rounded-lg overflow-hidden">
            <MediaPlayer key={media.id} media={media} />
          </div>
        </div>

        {/* <div className="mt-4 px-4 sm:px-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{media.titre}</h2>
            {media.stagiaires?.[0]?.is_watched && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Déjà regardé</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            {stripHtmlTags(media.description)}
          </p>
        </div> */}
      </>
    ) : (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Sélectionnez un média
      </div>
    )}
  </div>
);

// Page principale
export default function TutoAstucePage() {
  // États
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(
    null
  );
  const [activeCategory, setActiveCategory] = useState<"tutoriel" | "astuce">(
    "tutoriel"
  );
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const hasCheckedAchievement = useRef(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [localMediasData, setLocalMediasData] = useState<{
    tutoriels: Media[];
    astuces: Media[];
  } | null>(null);
  // State for collapsing the left media list on wide screens (tablet/landscape)
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);

  // Hooks
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

  // Données dérivées
  const formationsWithTutos = useMemo(
    () => formations.data ?? [],
    [formations]
  );
  const tutoriels = localMediasData?.tutoriels ?? mediasData?.tutoriels ?? [];
  const astuces = localMediasData?.astuces ?? mediasData?.astuces ?? [];
  const medias = activeCategory === "tutoriel" ? tutoriels : astuces;

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

  useEffect(() => {
    if (mediasData) {
      setLocalMediasData(mediasData);
    }
  }, [mediasData]);

  // Ad catalogue block data
  const [adFormations, setAdFormations] = useState<CatalogueFormation[]>([]);
  const [adLoading, setAdLoading] = useState(false);
  useEffect(() => {
    let mounted = true;
    setAdLoading(true);
    apiClient
      .get("/catalogueFormations/formations")
      .then((res) => {
        if (!mounted) return;
        const d = res?.data;
        if (Array.isArray(d)) setAdFormations(d);
        else if (d && Array.isArray(d.data)) setAdFormations(d.data);
        else setAdFormations([]);
      })
      .catch(() => setAdFormations([]))
      .finally(() => setAdLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const mediaTypeConfig = {
    video: {
      icon: <FilmIcon className="w-4 h-4 text-red-500" />,
      label: "Vidéos",
    },
    image: {
      icon: <PhoneOutgoingIcon className="w-4 h-4 text-blue-500" />,
      label: "Images",
    },
    audio: {
      icon: <Music2Icon className="w-4 h-4 text-purple-500" />,
      label: "Audios",
    },
    document: {
      icon: <FileIcon className="w-4 h-4 text-green-500" />,
      label: "Documents",
    },
  };

  // Effets
  useEffect(() => {
    if (medias.length > 0) {
      setSelectedMedia((prev) =>
        prev && medias.some((m) => m.id === prev.id) ? prev : medias[0]
      );
    } else {
      setSelectedMedia(null);
    }

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
  }, [activeCategory, groupedMediasByType, medias]);

  useEffect(() => {
    if (!selectedFormationId && formationsWithTutos.length > 0) {
      setSelectedFormationId(formationsWithTutos[0].id.toString());
    }
  }, [formationsWithTutos, selectedFormationId]);

  useEffect(() => {
    const handleMediaWatched = (e: CustomEvent) => {
      const { mediaId } = e.detail;
      setLocalMediasData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          tutoriels: prev.tutoriels.map((media) =>
            media.id === mediaId
              ? { ...media, stagiaires: [{ is_watched: true }] }
              : media
          ),
          astuces: prev.astuces.map((media) =>
            media.id === mediaId
              ? { ...media, stagiaires: [{ is_watched: true }] }
              : media
          ),
        };
      });
    };

    window.addEventListener(
      "media-watched",
      handleMediaWatched as EventListener
    );
    return () =>
      window.removeEventListener(
        "media-watched",
        handleMediaWatched as EventListener
      );
  }, []);

  // Handlers
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Rendu
  return (
    <Layout>
      <div
        className="mx-auto mt-[-8%] px-2 sm:px-4 py-4 sm:py-6 max-w-7xl w-full overflow-hidden"
        style={{ maxWidth: "90vw" }}>
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* En-tête */}
          <div className="p-3 sm:p-4">
            <h1 className="block text-xl sm:text-3xl text-brown-shade font-bold mb-2 sm:mb-4 text-center sm:text-left">
              Tutoriels et astuces
            </h1>

            <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-4 sm:justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <MediaTabs
                  active={activeCategory}
                  onChange={setActiveCategory}
                  className="flex-1"
                />
                <select
                  value={selectedFormationId ?? ""}
                  onChange={(e) =>
                    setSelectedFormationId(e.target.value || null)
                  }
                  className="w-full sm:w-auto px-3 py-2 text-sm"
                  aria-label="Sélectionner une formation">
                  {formationsWithTutos.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.titre}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => refetch()}
                  className="px-2 py-2 bg-yellow-400 text-white flex items-center justify-center text-sm rounded-full"
                  title="Rafraîchir">
                  <RefreshCw
                    className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="w-full max-w-full">
            {/* Responsive layout: player + collapsible list on large screens */}
            <div
              className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start"
              style={{ maxWidth: "90vw" }}>
              {/* Left column: media list (collapsible on large screens) */}
              <div className={`col-span-1 order-2 lg:order-1`}> 
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold">Liste des médias</h2>
                    <button
                      aria-pressed={isLeftCollapsed}
                      aria-label={isLeftCollapsed ? "Afficher la liste" : "Masquer la liste"}
                      onClick={() => setIsLeftCollapsed((s) => !s)}
                      className="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200">
                      {isLeftCollapsed ? "Afficher" : "Masquer"}
                    </button>
                  </div>

                  {!isLeftCollapsed ? (
                    <div className="p-2 overflow-auto">
                      {isLoading ? (
                        <MediaSkeleton count={5} />
                      ) : medias.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Aucun média disponible</div>
                      ) : (
                        <div className="space-y-2 overflow-y-auto max-h-[60vh]">
                          {Object.entries(groupedMediasByType).map(([type, categories]) => (
                            <MediaListSection
                              key={type}
                              type={type}
                              icon={mediaTypeConfig[type].icon}
                              label={mediaTypeConfig[type].label}
                              categories={categories}
                              isExpanded={expandedSections[type]}
                              onToggle={() => toggleSection(type)}
                              selectedMedia={selectedMedia}
                              onSelectMedia={setSelectedMedia}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Liste masquée</div>
                  )}
                </div>
              </div>

              {/* Media player column (main) */}
              <div className="col-span-1 lg:col-span-3 order-1 lg:order-2">
                <div className="sticky top-20">
                  <MediaPlayerSection media={selectedMedia} />
                </div>
              </div>
            </div>

            {/* Ad catalogue block */}
            {!adLoading && adFormations.length > 0 && (
              <div className="mt-6">
                <AdCatalogueBlock formations={adFormations.slice(0, 4)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
