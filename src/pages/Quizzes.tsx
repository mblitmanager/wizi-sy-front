import { Layout } from "@/components/layout/Layout";
import axios from "axios";
import { useUser } from "@/hooks/useAuth";
import { StagiaireQuizList } from "@/components/quiz/StagiaireQuizList";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import {
  Loader2,
  WifiOff,
  List,
  ListOrdered,
  ListChecks,
  Table,
  Rows,
  Columns,
  LayoutGrid,
  Grid3X3,
  Grid,
} from "lucide-react";
import StagiaireQuizAdventure from "@/components/quiz/StagiaireQuizAdventure";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useMemo, useState } from "react";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";
import { useLocation, useNavigate } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useQuizPreferences } from "@/hooks/useQuizPreferences";
import { QuizViewManager } from "@/components/quiz/QuizViewManager";

function ToggleContentSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>
      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
            <div className="h-28 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Quizzes() {
  const isOnline = useOnlineStatus();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // Utiliser les préférences utilisateur
  const {
    viewMode,
    isLoading: preferencesLoading,
    savePreference,
    toggleViewMode,
  } = useQuizPreferences();

  // Priorité : paramètre URL > préférence utilisateur > défaut
  const initialToggle = params.get("toggle") || viewMode;
  const [activeToggle, setActiveToggle] = useState<string>(initialToggle);
  const [isSwitching, setIsSwitching] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Ajout filtre formation
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(
    null
  );
  const { data: formations = [] } = useFormationStagiaire(
    user?.stagiaire?.id ?? null
  );
  const formationsWithTutos = useMemo(
    () => formations.data ?? [],
    [formations]
  );

  // Initialisation des préférences et redirection automatique
  useEffect(() => {
    if (preferencesLoading || hasInitialized) return;

    // Si aucun paramètre URL, utiliser la préférence utilisateur
    const urlToggle = params.get("toggle");
    if (!urlToggle) {
      setActiveToggle(viewMode);
    }

    setHasInitialized(true);
  }, [preferencesLoading, hasInitialized, params, viewMode]);

  // Sélection par défaut: première formation disponible
  useEffect(() => {
    if (!selectedFormationId && formationsWithTutos.length > 0) {
      const first = formationsWithTutos[0];
      if (first?.id) setSelectedFormationId(String(first.id));
    }
  }, [formationsWithTutos, selectedFormationId]);

  // À appeler à la fin d'un quiz réussi : triggerQuizBadge();
  const triggerQuizBadge = async () => {
    if (user && localStorage.getItem("token")) {
      await axios.post(
        "/api/stagiaire/achievements/check",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }
  };

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem("token") && isOnline,
  });

  // Rendu principal
  return (
    <Layout>
      <QuizViewManager>
        <div className="sticky top-0 z-20 bg-white flex flex-row flex-wrap items-center gap-2 mb-4 w-full border-b border-gray-200 py-2 ">
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            {/* Sélecteur Formation */}
            <div className="flex items-center min-w-[120px]">
              {formationsWithTutos.length > 1 ? (
                <select
                  id="formation-select"
                  value={selectedFormationId ?? ""}
                  onChange={(e) =>
                    setSelectedFormationId(e.target.value || null)
                  }
                  className="w-full border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Sélectionner une formation">
                  {formationsWithTutos.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.label ?? formation.titre}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="px-3 py-2 text-base">
                  {formationsWithTutos[0]?.label ??
                    formationsWithTutos[0]?.titre}
                </span>
              )}
            </div>

            {/* Toggle Vue Quiz */}
            <div className="flex items-center gap-3 top-1 right-4 absolute">
              <List
                className={`h-7 w-7 transition-colors ${
                  activeToggle === "adventure" ? "text-black" : "text-gray-400"
                }`}
              />

              <button
                type="button"
                aria-label="Basculer la vue quiz"
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 
  ${activeToggle === "mes-quizzes" ? "bg-wizi-accent" : "bg-gray-300"}
      `}
                onClick={() => {
                  const newToggle =
                    activeToggle === "adventure" ? "mes-quizzes" : "adventure";
                  setActiveToggle(newToggle);
                  // Sauvegarder la préférence utilisateur
                  savePreference(
                    newToggle === "adventure" ? "adventure" : "list"
                  );
                }}>
                <span
                  className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${activeToggle === "mes-quizzes" ? "translate-x-7" : ""}
        `}
                />
              </button>

              <Grid3X3
                className={`h-7 w-7 transition-colors ${
                  activeToggle === "mes-quizzes"
                    ? "text-black"
                    : "text-gray-400"
                }`}
              />
            </div>
          </div>
        </div>
        {categoriesLoading || preferencesLoading || !hasInitialized ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {activeToggle === "adventure" && (
              <StagiaireQuizAdventure
                selectedFormationId={selectedFormationId}
              />
            )}
            {activeToggle === "mes-quizzes" && (
              <StagiaireQuizList selectedFormationId={selectedFormationId} />
            )}
          </div>
        )}
      </QuizViewManager>
    </Layout>
  );
}
