import { useEffect, useMemo, useState } from "react";
import { useMediaByFormation } from "@/use-case/hooks/media/useMediaByFormation";
import { MediaPlayer, MediaTabs } from "@/Media";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/hooks/useAuth";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";
import {
  CheckCircle,
  PlayCircle,
  Clock,
  FilmIcon,
  FileIcon,
  Music2Icon,
  PhoneOutgoingIcon,
  ChevronDown,
} from "lucide-react";

// Composants réutilisables
const MediaSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
    ))}
  </div>
);

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
    className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 border
      ${
        isSelected
          ? "bg-blue-50 border-blue-200"
          : "border-transparent hover:bg-gray-50"
      }
    `}>
    <div
      className={`p-2 rounded-full ${
        isSelected ? "bg-blue-100" : "bg-gray-100"
      }`}>
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
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{media.duree} min</span>
      </div>
    </div>

    {isWatched && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
  </div>
);

const MediaListSection = ({
  type,
  icon,
  label,
  categories,
  isExpanded,
  onToggle,
  selectedMedia,
  onSelectMedia,
}: {
  type: string;
  icon: React.ReactNode;
  label: string;
  categories: Record<string, Media[]>;
  isExpanded: boolean;
  onToggle: () => void;
  selectedMedia: Media | null;
  onSelectMedia: (media: Media) => void;
}) => (
  <div className="mb-4">
    <div
      className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg cursor-pointer"
      onClick={onToggle}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
      <ChevronDown
        className={`w-4 h-4 ml-auto transition-transform ${
          isExpanded ? "rotate-180" : ""
        }`}
      />
    </div>

    {isExpanded &&
      Object.entries(categories).map(([category, items]) => (
        <div key={category} className="mt-2 ml-3">
          <div className="space-y-1">
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
);

const MediaPlayerSection = ({ media }: { media: Media | null }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 lg:col-span-2">
    {media ? (
      <>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <MediaPlayer key={media.id} media={media} />
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold">{media.titre}</h2>
          <p className="text-gray-600 mt-2">{media.description}</p>

          {media.stagiaires?.[0]?.is_watched && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
              <CheckCircle className="w-5 h-5" />
              <span>Déjà regardé</span>
            </div>
          )}
        </div>
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
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
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
  const formationsWithTutos = formations.data ?? [];
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
  }, [formationsWithTutos]);

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
      <div className="mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col gap-6">
          {/* En-tête */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h1 className="hidden md:block text-3xl text-brown-shade font-bold mb-4">
              Médias de formation
            </h1>

            <div className="flex flex-col gap-2 w-full lg:flex-row lg:items-center lg:gap-4 lg:justify-between">
              <select
                value={selectedFormationId ?? ""}
                onChange={(e) => setSelectedFormationId(e.target.value || null)}
                className="w-full sm:w-auto px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg shadow-sm"
                aria-label="Sélectionner une formation">
                {formationsWithTutos.map((formation) => (
                  <option key={formation.id} value={formation.id}>
                    {formation.titre}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <MediaTabs
                  active={activeCategory}
                  onChange={setActiveCategory}
                  className="flex-1"
                />
                <button
                  onClick={() => refetch()}
                  className="w-full sm:w-auto px-3 py-1 bg-yellow-400 text-white rounded-lg shadow text-sm lg:ml-2">
                  {isFetching ? "..." : "Rafraîchir"}
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6">
            {/* Liste des médias */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:col-span-1 overflow-hidden">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-blue-600" />
                <span>
                  {activeCategory === "tutoriel" ? "Tutoriels" : "Astuces"}
                </span>
              </h2>

              {isLoading ? (
                <MediaSkeleton count={5} />
              ) : medias.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun média disponible
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[60vh]">
                  {Object.entries(groupedMediasByType).map(
                    ([type, categories]) => (
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
                    )
                  )}
                </div>
              )}
            </div>

            {/* Lecteur de média */}
            <div className="lg:col-span-2">
              <MediaPlayerSection media={selectedMedia} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
