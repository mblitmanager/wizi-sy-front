import React, { useEffect, useMemo, useState } from "react";
import { Search, User } from "lucide-react";
import { MediaPlayer } from "@/Media";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/hooks/useAuth";
import DOMPurify from "dompurify";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";
import { useMediaByFormation } from "@/use-case/hooks/media/useMediaByFormation";

// New Lesson Components
import { LessonBreadcrumb } from "@/components/Lesson/LessonBreadcrumb";
import { LessonProgressBar } from "@/components/Lesson/LessonProgressBar";
import { LessonTabs } from "@/components/Lesson/LessonTabs";
import { LessonNavigation } from "@/components/Lesson/LessonNavigation";

// Styles
import "@/styles/LessonPage.css";

export default function TutoAstucePage() {
  // States
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"tutoriel" | "astuce">("tutoriel");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWebView, setIsWebView] = useState(window.innerWidth >= 1024);
  const isMobile = !isWebView;

  // Hooks
  const { user } = useUser();
  const { data: formations = [] } = useFormationStagiaire(user?.stagiaire.id ?? null);
  const { data: mediasData } = useMediaByFormation(selectedFormationId);
  const formationsWithTutos = useMemo(() => formations.data ?? [], [formations]);

  // Derived data
  const tutoriels = mediasData?.tutoriels ?? [];
  const astuces = mediasData?.astuces ?? [];
  const medias = activeCategory === "tutoriel" ? tutoriels : astuces;

  // Initialize
  useEffect(() => {
    if (!selectedFormationId && formationsWithTutos.length > 0) {
      setSelectedFormationId(formationsWithTutos[0].id.toString());
    }
  }, [formationsWithTutos, selectedFormationId]);

  useEffect(() => {
    if (medias.length > 0) {
      setSelectedMedia(medias[0]);
      setCurrentIndex(0);
    } else {
      setSelectedMedia(null);
      setCurrentIndex(0);
    }
  }, [medias]);

  // Detect screen size for web/mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsWebView(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedMedia(medias[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < medias.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedMedia(medias[currentIndex + 1]);
    }
  };

  // Calculate progress
  const progress = medias.length > 0 ? Math.round(((currentIndex + 1) / medias.length) * 100) : 0;

  return (
    <Layout>
      <div className="lesson-page px-3 sm:px-4 pb-16">
        {/* Header */}
        <header className="lesson-header">
          <div className="lesson-header-content flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            {/* Formation Selector */}
            <div className="w-full lg:flex-1">
              {formationsWithTutos.length > 1 ? (
                <select
                  value={selectedFormationId || formationsWithTutos[0]?.id || ""}
                  onChange={(e) => setSelectedFormationId(e.target.value)}
                  className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-orange-200 bg-white hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                >
                  {formationsWithTutos.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.titre}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>

            {/* Category Selector */}
            <div className="flex flex-wrap gap-2 lg:mx-4">
              <button
                onClick={() => setActiveCategory("tutoriel")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeCategory === "tutoriel"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Tutoriels ({tutoriels.length})
              </button>
              <button
                onClick={() => setActiveCategory("astuce")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeCategory === "astuce"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Astuces ({astuces.length})
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {isWebView ? (
          <div className="lesson-container">
            <div className="lesson-grid">
              {/* Left: Video Player */}
              <div className="lesson-video-section">
                {selectedMedia ? (
                  <div className="lesson-video-container">
                    <MediaPlayer key={selectedMedia.id} media={selectedMedia} showDescription={isWebView} />
                  </div>
                ) : (
                  <div className="lesson-video-container flex items-center justify-center">
                    <p className="text-white text-sm">Sélectionnez un média</p>
                  </div>
                )}
              </div>

              {/* Right: Sidebar */}
              <div className="lesson-sidebar">
                <h1 className="lesson-title">
                  {selectedMedia?.titre || "Sélectionnez une leçon"}
                </h1>

                <div className="lesson-divider" />

                <LessonTabs
                mediaList={medias}
                currentMediaId={selectedMedia ? Number(selectedMedia.id) : undefined}
                  isWebView={isWebView}
                  onMediaSelect={(media, index) => {
                    setSelectedMedia(media);
                    setCurrentIndex(index);
                  }}
                >
                  {!isWebView && selectedMedia?.description && (
                    <div
                      className="text-sm text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(selectedMedia.description),
                      }}
                    />
                  )}
                </LessonTabs>

                <LessonNavigation
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  hasPrevious={currentIndex > 0}
                  hasNext={currentIndex < medias.length - 1}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Video */}
            <div className="w-full rounded-xl overflow-hidden bg-black">
              {selectedMedia ? (
                <MediaPlayer key={selectedMedia.id} media={selectedMedia} showDescription={false} />
              ) : (
                <div className="aspect-video flex items-center justify-center text-white text-sm">
                  Sélectionnez un média
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-lg font-semibold text-gray-900">
              {selectedMedia?.titre || "Sélectionnez une leçon"}
            </h1>

          {/* Tabs & list */}
          <LessonTabs
            mediaList={medias}
            currentMediaId={selectedMedia ? Number(selectedMedia.id) : undefined}
            isWebView={false}
            onMediaSelect={(media, index) => {
              setSelectedMedia(media);
              setCurrentIndex(index);
            }}
          >
              {selectedMedia?.description && (
                <div
                  className="text-sm text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(selectedMedia.description),
                  }}
                />
              )}
            </LessonTabs>

            {/* Navigation */}
            <div className="w-full">
              <LessonNavigation
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasPrevious={currentIndex > 0}
                hasNext={currentIndex < medias.length - 1}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
