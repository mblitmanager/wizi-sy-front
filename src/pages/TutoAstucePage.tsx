import React, { useEffect, useMemo, useState } from "react";
import { Search, User } from "lucide-react";
import { MediaPlayer } from "@/Media";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/hooks/useAuth";
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

  // Hooks
  const { user } = useUser();
  const { data: formations = [] } = useFormationStagiaire(user?.stagiaire.id ?? null);
  const { data: mediasData, isLoading } = useMediaByFormation(selectedFormationId);

  // Derived data
  const formationsWithTutos = useMemo(() => formations.data ?? [], [formations]);
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
    if (medias.length > 0 && !selectedMedia) {
      setSelectedMedia(medias[0]);
      setCurrentIndex(0);
    }
  }, [medias, selectedMedia]);

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedMedia(medias[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentIndex < medias.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedMedia(medias[newIndex]);
    }
  };

  // Calculate progress
  const progress = medias.length > 0 ? Math.round(((currentIndex + 1) / medias.length) * 100) : 0;

  return (
    <Layout>
      <div className="lesson-page">
        {/* Header */}
        <header className="lesson-header">
          <div className="lesson-header-content">
            {/* Logo */}
            <div className="lesson-logo">aopia.fr</div>

            {/* Breadcrumb */}
            <div className="flex-1 px-6">
              <LessonBreadcrumb
                courseName={formationsWithTutos[0]?.titre || "Formation"}
                moduleName={activeCategory === "tutoriel" ? "Tutoriels" : "Astuces"}
              />
            </div>

            {/* Actions */}
            <div className="lesson-header-actions">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="lesson-container">
          <div className="lesson-grid">
            {/* Left: Video Player */}
            <div className="lesson-video-section">
              {selectedMedia ? (
                <div className="lesson-video-container">
                  <MediaPlayer key={selectedMedia.id} media={selectedMedia} showDescription={false} />
                </div>
              ) : (
                <div className="lesson-video-container flex items-center justify-center">
                  <p className="text-white text-sm">Sélectionnez un média</p>
                </div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="lesson-sidebar">
              {/* Progress indicator */}
              <LessonProgressBar
                current={currentIndex + 1}
                total={medias.length}
                percentage={progress}
              />

              {/* Lesson title */}
              <h1 className="lesson-title">
                {selectedMedia?.titre || "Sélectionnez une leçon"}
              </h1>

              <div className="lesson-divider" />

              {/* Tabs */}
              <LessonTabs>
                {selectedMedia?.description && (
                  <div className="text-sm text-gray-700">
                    <p>{selectedMedia.description}</p>
                  </div>
                )}
              </LessonTabs>

              {/* Navigation */}
              <LessonNavigation
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasPrevious={currentIndex > 0}
                hasNext={currentIndex < medias.length - 1}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
