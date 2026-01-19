import React, { useEffect, useMemo, useState } from "react";
import { Search, User, Download, HelpCircle, ChevronLeft, ChevronRight, Play, CheckCircle, Home, BookOpen, Lightbulb, X } from "lucide-react";
import { MediaPlayer } from "@/Media";
import { Layout } from "@/components/layout/Layout";
import { Media } from "@/types/media";
import { useUser } from "@/hooks/useAuth";
import DOMPurify from "dompurify";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";
import { useMediaByFormation } from "@/use-case/hooks/media/useMediaByFormation";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// New Lesson Components
import { LessonBreadcrumb } from "@/components/Lesson/LessonBreadcrumb";
import { LessonProgressBar } from "@/components/Lesson/LessonProgressBar";
import { LessonTabs } from "@/components/Lesson/LessonTabs";
import { LessonNavigation } from "@/components/Lesson/LessonNavigation";

// Styles
import "@/styles/LessonPage.css";

// Tutorial Steps Data
const tutorialSteps = [
  {
    title: "🎓 Bienvenue dans la section Tutoriels !",
    desc: "Retrouvez ici des vidéos explicatives et des astuces pour progresser rapidement sur la plateforme.",
  },
  {
    title: "🔄 Filtrer par catégorie",
    desc: "Utilisez les boutons en haut pour basculer entre les tutoriels et les astuces.",
  },
  {
    title: "▶️ Visionner une vidéo",
    desc: "Cliquez sur une vidéo pour l'ouvrir et la regarder en plein écran.",
  },
  {
    title: "💡 Astuce",
    desc: "Vous pouvez revenir ici à tout moment pour revoir les tutoriels.",
  },
];

// Tutorial Overlay Component
function TutorialOverlay({ 
  step, 
  onPrev, 
  onNext, 
  onComplete, 
  totalSteps 
}: { 
  step: number; 
  onPrev: () => void; 
  onNext: () => void; 
  onComplete: () => void; 
  totalSteps: number;
}) {
  const currentStep = tutorialSteps[step];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
          {currentStep.title}
        </h3>
        <p className="text-gray-600 text-center mb-6">
          {currentStep.desc}
        </p>
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === step ? "bg-[#FFB800] w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          {step > 0 ? (
            <button
              onClick={onPrev}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Précédent
            </button>
          ) : (
            <div />
          )}
          
          {step < totalSteps - 1 ? (
            <button
              onClick={onNext}
              className="px-6 py-2 bg-[#FFB800] hover:bg-[#E0A800] text-white font-bold rounded-lg transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
            >
              Terminer
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TutoAstucePage() {
  const navigate = useNavigate();
  
  // States
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"tutoriel" | "astuce">("tutoriel");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWebView, setIsWebView] = useState(window.innerWidth >= 1024);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const isMobile = !isWebView;

  // Hooks
  const { user } = useUser();
  const { data: formations } = useFormationStagiaire(user?.stagiaire?.id ?? null);
  const { data: mediasData } = useMediaByFormation(selectedFormationId);

  const formationsWithTutos = useMemo(() => {
    if (!formations) return [];
    const rawData = Array.isArray(formations) ? formations : (formations.data ?? []);
    return rawData;
  }, [formations]);

  // Derived data
  const tutoriels = mediasData?.tutoriels ?? [];
  const astuces = mediasData?.astuces ?? [];
  const medias = activeCategory === "tutoriel" ? tutoriels : astuces;

  // Check if tutorial was seen
  useEffect(() => {
    const seen = localStorage.getItem("tuto_astuce_tutorial_seen");
    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

  // Initialize
  useEffect(() => {
    if (!selectedFormationId && formationsWithTutos.length > 0) {
      const firstId = formationsWithTutos[0]?.id;
      if (firstId) setSelectedFormationId(firstId.toString());
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

  // Tutorial handlers
  const handleTutorialComplete = () => {
    localStorage.setItem("tuto_astuce_tutorial_seen", "true");
    setShowTutorial(false);
    setTutorialStep(0);
  };

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
      <div className="lesson-page px-3 sm:px-4 pb-16 relative">
        {/* Premium Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm -mx-3 sm:-mx-4 px-3 sm:px-4 py-3 mb-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Home + Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                  title="Accueil"
                >
                  <Home className="w-5 h-5 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-lg font-black text-gray-900 tracking-tight">
                    Tutos & Astuces
                  </h1>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    Formation continue
                  </p>
                </div>
              </div>

              {/* Right: Category Toggle + Help */}
              <div className="flex items-center gap-3">
                {/* Category Toggle Buttons */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveCategory("tutoriel")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                      activeCategory === "tutoriel"
                        ? "bg-[#FFB800] text-white shadow-md"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Tutos</span>
                    <span className="text-xs opacity-75">({tutoriels.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveCategory("astuce")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                      activeCategory === "astuce"
                        ? "bg-amber-500 text-white shadow-md"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span className="hidden sm:inline">Astuces</span>
                    <span className="text-xs opacity-75">({astuces.length})</span>
                  </button>
                </div>

                {/* Help Button */}
                <button
                  onClick={() => {
                    setTutorialStep(0);
                    setShowTutorial(true);
                  }}
                  className="w-10 h-10 bg-[#FFB800] hover:bg-[#E0A800] rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-yellow-200"
                  title="Aide"
                >
                  <HelpCircle className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Formation Selector Row */}
            {formationsWithTutos.length > 1 && (
              <div className="mt-3">
                <select
                  value={selectedFormationId || formationsWithTutos[0]?.id || ""}
                  onChange={(e) => setSelectedFormationId(e.target.value)}
                  className="w-full px-4 py-2 text-sm font-medium rounded-xl border-2 border-[#FFB800]/30 bg-[#FFB800]/5 hover:border-[#FFB800]/50 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 focus:border-[#FFB800] transition-all"
                >
                  {formationsWithTutos.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                    {formation.titre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Progress Bar */}
            {medias.length > 0 && (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#FFB800] to-[#FFD700]"
                  />
                </div>
                <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                  {currentIndex + 1} / {medias.length}
                </span>
              </div>
            )}
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
                    <div className="text-center">
                      <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-400">Sélectionnez un média</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Sidebar */}
              <div className="lesson-sidebar">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h1 className="lesson-title flex-1">
                    {selectedMedia?.titre || "Sélectionnez une leçon"}
                  </h1>
                  {selectedMedia && selectedMedia.url && (
                    <button
                      onClick={() => window.open(selectedMedia.url, '_blank')}
                      className="p-2 text-[#FFB800] hover:bg-[#FFB800]/10 rounded-full transition-colors flex-shrink-0"
                      title="Télécharger / Ouvrir"
                    >
                      <Download size={20} />
                    </button>
                  )}
                </div>

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
            <div className="w-full rounded-xl overflow-hidden bg-black shadow-lg">
              {selectedMedia ? (
                <MediaPlayer key={selectedMedia.id} media={selectedMedia} showDescription={false} />
              ) : (
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Sélectionnez un média</p>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="flex items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h1 className="text-lg font-semibold text-gray-900">
                {selectedMedia?.titre || "Sélectionnez une leçon"}
              </h1>
              {selectedMedia && selectedMedia.url && (
                <button
                  onClick={() => window.open(selectedMedia.url, '_blank')}
                  className="p-2 text-[#FFB800] hover:bg-[#FFB800]/10 rounded-full transition-colors"
                  title="Télécharger / Ouvrir"
                >
                  <Download size={20} />
                </button>
              )}
            </div>

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

        {/* Floating Help Button (Mobile) */}
        {isMobile && (
          <button
            onClick={() => {
              setTutorialStep(0);
              setShowTutorial(true);
            }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#FFB800] hover:bg-[#E0A800] rounded-full flex items-center justify-center shadow-2xl shadow-yellow-300/50 z-50 transition-colors"
            title="Aide"
          >
            <HelpCircle className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Tutorial Overlay */}
        <AnimatePresence>
          {showTutorial && (
            <TutorialOverlay
              step={tutorialStep}
              totalSteps={tutorialSteps.length}
              onPrev={() => setTutorialStep(s => Math.max(0, s - 1))}
              onNext={() => setTutorialStep(s => Math.min(tutorialSteps.length - 1, s + 1))}
              onComplete={handleTutorialComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
