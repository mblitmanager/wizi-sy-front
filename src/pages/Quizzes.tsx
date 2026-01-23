import { Layout } from "@/components/layout/Layout";
import axios from "axios";
import { useUser } from "@/hooks/useAuth";
import { StagiaireQuizList } from "@/components/quiz/StagiaireQuizList";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import {
  Loader2,
  Home,
  Trophy,
  HelpCircle,
  Moon,
  GraduationCap,
  ChevronDown,
  ChevronLeft,
  Search,
} from "lucide-react";
import StagiaireQuizAdventure from "@/components/quiz/StagiaireQuizAdventure";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { useEffect, useMemo, useState } from "react";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuizPreferences } from "@/hooks/useQuizPreferences";
import { QuizViewManager } from "@/components/quiz/QuizViewManager";
import { useResumeQuiz } from "@/hooks/useResumeQuiz";
import { ResumeQuizModal } from "@/components/quiz/ResumeQuizModal";
import { ResumeQuizButton } from "@/components/quiz/ResumeQuizButton";
import { useClassementPoints } from "@/hooks/useClassementPoints";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function Quizzes() {
  const isOnline = useOnlineStatus();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { points: userPoints } = useClassementPoints();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // Resume quiz functionality
  const { unfinishedQuiz, dismissQuiz, hideModal, isModalHidden } = useResumeQuiz();

  const handleResumeQuiz = () => {
    if (unfinishedQuiz) {
      navigate(`/quiz/${unfinishedQuiz.quizId}`);
    }
  };

  const {
    isLoading: preferencesLoading,
    savePreference,
  } = useQuizPreferences();

  const initialToggle = params.get("toggle") || "adventure";
  const [activeToggle, setActiveToggle] = useState<string>(initialToggle);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(() => {
    return localStorage.getItem("last_selected_formation_id");
  });

  // Persister le choix de formation
  useEffect(() => {
    if (selectedFormationId) {
      localStorage.setItem("last_selected_formation_id", selectedFormationId);
    }
  }, [selectedFormationId]);

  const { data: formations = [] } = useFormationStagiaire(
    user?.stagiaire?.id ?? null
  );
  const formationsWithTutos = useMemo(
    () => formations.data ?? [],
    [formations]
  );

  useEffect(() => {
    // Priority 1: If there is an unfinished quiz, try to select its formation
    if (unfinishedQuiz?.formationId && !selectedFormationId) {
      const exists = formationsWithTutos.some(f => String(f.id) === String(unfinishedQuiz.formationId));
      if (exists) {
        setSelectedFormationId(String(unfinishedQuiz.formationId));
        return;
      }
    }

    // Priority 2: Default to the first available formation
    if (!selectedFormationId && formationsWithTutos.length > 0) {
      setSelectedFormationId(String(formationsWithTutos[0].id));
    }
  }, [formationsWithTutos, selectedFormationId, unfinishedQuiz]);

  useEffect(() => {
    if (preferencesLoading || hasInitialized) return;
    const urlToggle = params.get("toggle");
    if (!urlToggle) {
      setActiveToggle("adventure");
    } else {
      setActiveToggle(urlToggle);
    }
    setHasInitialized(true);
  }, [preferencesLoading, hasInitialized, params]);

  const selectedFormation = useMemo(() => {
    return formationsWithTutos.find(f => String(f.id) === String(selectedFormationId));
  }, [formationsWithTutos, selectedFormationId]);

  // Rendu principal
  return (
    <Layout>
      <div className="flex flex-col -m-3 sm:-m-4 md:-m-6">
        {/* Yellow Header section */}
        <div className="bg-[#FFB800] px-4 py-3 flex items-center justify-between text-white shadow-md z-30">
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>

          <h1 className="text-xl font-bold">Quiz</h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <span className="text-sm font-bold">{userPoints || 0} points</span>
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 text-[#FFB800]" />
              </div>
            </div>
            
            <button className="p-1 hover:bg-white/10 rounded-full">
              <HelpCircle className="w-6 h-6" />
            </button>

            {/* <div className="flex items-center">
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={setIsDarkMode}
                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-black/20"
              />
            </div> */}
          </div>
        </div>

        {/* Content with Spacer for the overlap? No, let's keep it clean */}
        <div className="p-4 sm:p-6 bg-slate-50 min-h-[calc(100vh-140px)]">
          <QuizViewManager>
            <ResumeQuizModal
              open={!!unfinishedQuiz && !isModalHidden}
              quizTitle={unfinishedQuiz?.quizTitle || ""}
              questionCount={unfinishedQuiz?.questionIds?.length || 0}
              currentProgress={unfinishedQuiz?.currentIndex || 0}
              onResume={handleResumeQuiz}
              onDismiss={hideModal}
            />

            {/* View and Formation Selectors */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
              {/* Formation Selector Styled like Flutter */}
              <div className="relative w-full sm:max-w-md group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFB800]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <select
                  value={selectedFormationId ?? ""}
                  onChange={(e) => setSelectedFormationId(e.target.value || null)}
                  className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-10 py-3 text-sm font-medium shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all"
                >
                  {formationsWithTutos.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label ?? f.titre}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:rotate-180 transition-transform">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* View Toggle (Adventure vs List) - kept for functionality */}
              <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <button
                  onClick={() => {
                    setActiveToggle("adventure");
                    savePreference("adventure");
                    navigate("/quizzes?toggle=adventure", { replace: true });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    activeToggle === "adventure" ? "bg-white text-[#FFB800] shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  AVENTURE
                </button>
                <button
                  onClick={() => {
                    setActiveToggle("mes-quizzes");
                    savePreference("list");
                    navigate("/quizzes?toggle=mes-quizzes", { replace: true });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                    activeToggle === "mes-quizzes" ? "bg-white text-[#FFB800] shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  LISTE
                </button>
              </div>
            </div>

            {categoriesLoading || preferencesLoading || !hasInitialized ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="h-8 w-8 animate-spin text-[#FFB800]" />
              </div>
            ) : (
              <div className="mt-4">
                {activeToggle === "adventure" ? (
                  <StagiaireQuizAdventure selectedFormationId={selectedFormationId} />
                ) : (
                  <StagiaireQuizList selectedFormationId={selectedFormationId} />
                )}
              </div>
            )}
          </QuizViewManager>
        </div>
      </div>
    </Layout>
  );
}

const categoriesLoading = false; // Mock for now if not needed
