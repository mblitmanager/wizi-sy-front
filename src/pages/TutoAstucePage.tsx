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
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  Pause,
  Play,
} from "lucide-react";
import axios from "axios";
import { useMediaByFormation } from "@/use-case/hooks/media/useMediaByFormation";
import { MediaPlayer, MediaTabs } from "@/Media";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/hooks/useAuth";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";
import { useOrientation } from "@/hooks/useOrientation";
import "@/styles/TutoAstucePage.css";

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
      className={`p-3 cursor-pointer transition-all duration-200 rounded-lg border ${isSelected
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
              className={`text-sm font-medium truncate ${isWatched ? "text-green-600" : "text-gray-900"
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
          className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-400"
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
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastScrollY = useRef(0);

  // Hooks
  const { user } = useUser();
  const orientation = useOrientation();
  const { data: formations = [] } = useFormationStagiaire(
    user?.stagiaire.id ?? null
  );
  const {
    data: mediasData,
    isLoading,
    isFetching,
    refetch,
  } = useMediaByFormation(selectedFormationId);

  // Detect if we're in landscape mobile/tablet mode
  const isMobileOrTablet = orientation.isMobile || orientation.isTablet;
  const isLandscapeMobile =
    isMobileOrTablet && orientation.isLandscape;

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

  // Show mini player on scroll (mobile portrait only)
  useEffect(() => {
    if (!isMobileOrTablet || !orientation.isPortrait) {
      setShowMiniPlayer(false);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show mini player when scrolled past video (approximately 300px)
      setShowMiniPlayer(currentScrollY > 300);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileOrTablet, orientation.isPortrait]);

  // Close playlist when orientation changes
  useEffect(() => {
    setIsPlaylistOpen(false);
  }, [orientation.isLandscape, orientation.isPortrait]);

  return (
    <Layout>
      <div className="tuto-page">
        {/* Mobile Sticky Mini Player - Portrait Only */}
        {showMiniPlayer && isMobileOrTablet && orientation.isPortrait && selectedMedia && (
          <div className="mini-player-bar">
            <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-wizi text-white flex items-center justify-center hover:bg-wizi/90 active:scale-95 transition-all"
                aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {selectedMedia.titre}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {selectedMedia.categorie}
                </p>
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 active:bg-gray-100 rounded-lg transition-all"
                aria-label="Retour au lecteur">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Compact Header - Hidden in landscape mobile */}
        {!isLandscapeMobile && (
          <div className="tuto-header">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="tuto-header-content">
                <div className="tuto-header-title">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Tutoriels & Astuces
                  </h1>
                  <p className="hidden sm:block text-gray-600 text-sm mt-0.5">
                    Apprenez à votre rythme
                  </p>
                </div>

                <div className="tuto-header-controls">
                  <MediaTabs
                    active={activeCategory}
                    onChange={setActiveCategory}
                    compact={isMobileOrTablet}
                  />

                  {formationsWithTutos.length > 1 && (
                    <select
                      value={selectedFormationId ?? ""}
                      onChange={(e) =>
                        setSelectedFormationId(e.target.value || null)
                      }
                      title="Sélectionner une formation"
                      aria-label="Sélectionner une formation"
                      className="mobile-selector">
                      {formationsWithTutos.map((formation) => (
                        <option key={formation.id} value={formation.id}>
                          {formation.titre.length > 30 && isMobileOrTablet
                            ? formation.titre.substring(0, 30) + '...'
                            : formation.titre}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    title="Rafraîchir"
                    aria-label="Rafraîchir la liste"
                    className="refresh-btn">
                    <RefreshCw
                      className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Landscape Mode Compact Header */}
        {isLandscapeMobile && (
          <div className="landscape-header">
            <div className="flex items-center justify-between px-4 py-2 bg-black/80 backdrop-blur-md text-white">
              <div className="flex items-center gap-3">
                <MediaTabs
                  active={activeCategory}
                  onChange={setActiveCategory}
                  compact
                />
                {formationsWithTutos.length > 1 && (
                  <select
                    value={selectedFormationId ?? ""}
                    onChange={(e) => setSelectedFormationId(e.target.value || null)}
                    aria-label="Sélectionner une formation"
                    title="Sélectionner une formation"
                    className="landscape-selector">
                    {formationsWithTutos.map((formation) => (
                      <option key={formation.id} value={formation.id}>
                        {formation.titre.substring(0, 20)}...
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <button
                onClick={() => {
                  window.history.back();
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Fermer">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="tuto-main-container">
          <div className="tuto-grid">
            {/* Lecteur de média - Order changes based on screen size */}
            <div
              className={`tuto-player-section ${isLandscapeMobile && isPlaylistOpen ? "with-playlist" : ""} ${isMobileOrTablet && orientation.isPortrait ? "order-1" : ""}`}>
              {selectedMedia ? (
                <>
                  <div className="aspect-video bg-black">
                    <MediaPlayer
                      key={selectedMedia.id}
                      media={selectedMedia}
                      showDescription={!isMobileOrTablet}
                    />
                  </div>

                  {/* Media info for desktop/tablet landscape */}
                  {!isMobileOrTablet && !orientation.isPortrait && (
                    <div className="media-info p-4 border-t border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {selectedMedia.titre}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="capitalize">{selectedMedia.type}</span>
                        <span>•</span>
                        <span>{selectedMedia.categorie}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <PlayCircle className="w-12 h-12 mb-3" />
                  <p className="text-sm">Sélectionnez un média</p>
                </div>
              )}
            </div>

            {/* Liste des médias */}
            {(!isMobileOrTablet || !orientation.isPortrait) && (
              <div
                className={`tuto-media-list ${isLandscapeMobile ? (isPlaylistOpen ? "tuto-playlist-drawer open" : "tuto-playlist-drawer") : ""}`}>
                {/* Close button for landscape playlist */}
                {isLandscapeMobile && isPlaylistOpen && (
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeCategory === "tutoriel" ? "Tutoriels" : "Astuces"}
                    </h2>
                    <button
                      onClick={() => setIsPlaylistOpen(false)}
                      title="Fermer la liste"
                      aria-label="Fermer la liste de médias"
                      className="min-w-[44px] min-h-[44px] p-2 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {!isLandscapeMobile && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeCategory === "tutoriel" ? "Tutoriels" : "Astuces"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {medias.length} média{medias.length > 1 ? "s" : ""}{" "}
                      disponible{medias.length > 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                {isLoading ? (
                  <MediaSkeleton />
                ) : medias.length === 0 ? (
                  <div className="empty-state text-center py-8 text-gray-500">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun média disponible</p>
                  </div>
                ) : (
                  <div className="media-list-scroll">
                    {Object.entries(groupedMedias).map(
                      ([category, categoryMedias]) => (
                        <MediaCategorySection
                          key={category}
                          title={category}
                          medias={categoryMedias}
                          selectedMedia={selectedMedia}
                          onSelectMedia={(media) => {
                            setSelectedMedia(media);
                            if (isLandscapeMobile) setIsPlaylistOpen(false);
                            if (isMobileOrTablet && orientation.isPortrait) {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Portrait: Bottom media list */}
            {isMobileOrTablet && orientation.isPortrait && (
              <div className="mobile-media-list-section">
                <div className="p-4 bg-white rounded-t-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeCategory === "tutoriel" ? "Tutoriels" : "Astuces"}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {medias.length} média{medias.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {isLoading ? (
                    <MediaSkeleton />
                  ) : medias.length === 0 ? (
                    <div className="empty-state text-center py-8 text-gray-500">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun média disponible</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(groupedMedias).map(
                        ([category, categoryMedias]) => (
                          <MediaCategorySection
                            key={category}
                            title={category}
                            medias={categoryMedias}
                            selectedMedia={selectedMedia}
                            onSelectMedia={(media) => {
                              setSelectedMedia(media);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Playlist toggle button for landscape mobile - Repositioned to top-left */}
          {isLandscapeMobile && (
            <button
              onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
              className="playlist-toggle-landscape"
              aria-label={isPlaylistOpen ? "Fermer la liste" : "Ouvrir la liste"}>
              <Menu className="w-6 h-6" />
              {!isPlaylistOpen && medias.length > 0 && (
                <span className="playlist-badge">{medias.length}</span>
              )}
            </button>
          )}

          {/* Catalogue de formations - Hidden in landscape mode */}
          {!isLandscapeMobile &&
            !adLoading &&
            adFormations.length > 0 && (
              <div className="mt-8">
                <AdCatalogueBlock formations={adFormations.slice(0, 6)} />
              </div>
            )}
        </div>
      </div>
    </Layout >
  );
}
