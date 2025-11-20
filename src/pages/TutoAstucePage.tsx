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
  BookOpen,
  Sparkles,
  Clock,
} from "lucide-react";
import axios from "axios";
import { useMediaByFormation } from "@/use-case/hooks/media/useMediaByFormation";
import { MediaPlayer, MediaTabs } from "@/Media";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/hooks/useAuth";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";

// Skeleton simplifié
const MediaSkeleton = () => (
  <div className="space-y-3">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// MediaItem simplifié et élégant
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
}) => {
  const getTypeIcon = (type: string) => {
    const icons = {
      video: <FilmIcon className="w-4 h-4" />,
      image: <PhoneOutgoingIcon className="w-4 h-4" />,
      audio: <Music2Icon className="w-4 h-4" />,
      document: <FileIcon className="w-4 h-4" />,
    };
    return icons[type] || <FileIcon className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      video: "bg-red-100 text-red-600",
      image: "bg-blue-100 text-blue-600",
      audio: "bg-purple-100 text-purple-600",
      document: "bg-green-100 text-green-600",
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 cursor-pointer transition-all duration-200 rounded-lg border ${
        isSelected
          ? "bg-blue-50 border-blue-200 shadow-sm"
          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
      }`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(
            media.type
          )}`}>
          {getTypeIcon(media.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`text-sm font-medium truncate ${
                isWatched ? "text-green-600" : "text-gray-900"
              }`}>
              {media.titre}
            </h3>
            {isWatched && (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="capitalize">{media.type}</span>
            <span>•</span>
            <span>{media.categorie}</span>
          </div>
        </div>

        <PlayCircle
          className={`w-5 h-5 ${
            isSelected ? "text-blue-600" : "text-gray-400"
          }`}
        />
      </div>
    </div>
  );
};

// Section simple et claire
const MediaCategorySection = ({
  title,
  medias,
  selectedMedia,
  onSelectMedia,
}: {
  title: string;
  medias: Media[];
  selectedMedia: Media | null;
  onSelectMedia: (media: Media) => void;
}) => {
  if (medias.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">
        {title} <span className="text-gray-400">({medias.length})</span>
      </h3>
      <div className="space-y-2">
        {medias.map((media) => (
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
  );
};

// MediaPlayerSection épuré
const MediaPlayerSection = ({ media }: { media: Media | null }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    {media ? (
      <>
        <div className="aspect-video bg-black">
          <MediaPlayer key={media.id} media={media} />
        </div>
      </>
    ) : (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <PlayCircle className="w-12 h-12 mb-3" />
        <p className="text-sm">Sélectionnez un média</p>
      </div>
    )}
  </div>
);

// Page principale simplifiée
export default function TutoAstucePage() {
  // États
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(
    null
  );
  const [activeCategory, setActiveCategory] = useState<"tutoriel" | "astuce">(
    "tutoriel"
  );
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [localMediasData, setLocalMediasData] = useState<{
    tutoriels: Media[];
    astuces: Media[];
  } | null>(null);

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

  // Grouper par catégorie simplement
  const groupedMedias = useMemo(() => {
    const groups: Record<string, Media[]> = {};
    medias.forEach((media) => {
      if (!groups[media.categorie]) {
        groups[media.categorie] = [];
      }
      groups[media.categorie].push(media);
    });
    return groups;
  }, [medias]);

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

  // Effets
  useEffect(() => {
    if (mediasData) {
      setLocalMediasData(mediasData);
    }
  }, [mediasData]);

  useEffect(() => {
    if (medias.length > 0 && !selectedMedia) {
      setSelectedMedia(medias[0]);
    }
  }, [medias, selectedMedia]);

  useEffect(() => {
    if (!selectedFormationId && formationsWithTutos.length > 0) {
      setSelectedFormationId(formationsWithTutos[0].id.toString());
    }
  }, [formationsWithTutos, selectedFormationId]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header simple */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Tutoriels & Astuces
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Apprenez à votre rythme
                </p>
              </div>

              <div className="flex items-center gap-3">
                <MediaTabs
                  active={activeCategory}
                  onChange={setActiveCategory}
                />

                <select
                  value={selectedFormationId ?? ""}
                  onChange={(e) =>
                    setSelectedFormationId(e.target.value || null)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {formationsWithTutos.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.titre}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  title="Rafraîchir">
                  <RefreshCw
                    className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des médias - Version simplifiée */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Liste des médias
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {medias.length} média{medias.length > 1 ? "s" : ""}{" "}
                    disponible{medias.length > 1 ? "s" : ""}
                  </p>
                </div>

                {isLoading ? (
                  <MediaSkeleton />
                ) : medias.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun média disponible</p>
                  </div>
                ) : (
                  <div className="space-y-1 max-h-[600px] overflow-y-auto">
                    {Object.entries(groupedMedias).map(
                      ([category, categoryMedias]) => (
                        <MediaCategorySection
                          key={category}
                          title={category}
                          medias={categoryMedias}
                          selectedMedia={selectedMedia}
                          onSelectMedia={setSelectedMedia}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Lecteur de média */}
            <div className="lg:col-span-2">
              <MediaPlayerSection media={selectedMedia} />
            </div>
          </div>

          {/* Catalogue de formations */}
          {!adLoading && adFormations.length > 0 && (
            <div className="mt-8">
              <AdCatalogueBlock formations={adFormations.slice(0, 6)} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
