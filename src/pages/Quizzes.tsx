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
  Target,
  Brain,
  Trophy,
  Star,
  Zap,
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

// Phrases d'accroche avec icônes
const ACCROCHE_PHRASES = [
  {
    text: " L'aventure des quiz commence ici !",
    icon: <Zap className="w-5 h-5" />,
    color: "from-orange-500 to-amber-500",
  },
  {
    text: " Entraînez-vous et devenez incollable !",
    icon: <Target className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    text: " Montez dans le classement, quiz après quiz !",
    icon: <Trophy className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    text: " Défiez vos connaissances, dépassez vos limites !",
    icon: <Brain className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    text: " Chaque quiz réussi vous rapproche de l'excellence !",
    icon: <Star className="w-5 h-5" />,
    color: "from-yellow-500 to-orange-500",
  },
];

export default function Quizzes() {
  const isOnline = useOnlineStatus();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // Phrase d'accroche aléatoire
  const [randomAccroche, setRandomAccroche] = useState(ACCROCHE_PHRASES[0]);

  // Utiliser les préférences utilisateur
  const {
    viewMode,
    isLoading: preferencesLoading,
    savePreference,
    toggleViewMode,
  } = useQuizPreferences();

  // CORRECTION: Forcer "adventure" par défaut au lieu d'utiliser viewMode
  const initialToggle = params.get("toggle") || "adventure"; // ← CHANGEMENT ICI
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

  // Choisir une phrase d'accroche aléatoire au chargement
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ACCROCHE_PHRASES.length);
    setRandomAccroche(ACCROCHE_PHRASES[randomIndex]);
  }, []);

  // CORRECTION: Initialisation simplifiée pour forcer "adventure"
  useEffect(() => {
    if (preferencesLoading || hasInitialized) return;

    const urlToggle = params.get("toggle");

    // Si pas de paramètre URL, forcer "adventure"
    if (!urlToggle) {
      setActiveToggle("adventure");
      // Optionnel: sauvegarder la préférence
      savePreference("adventure");
    } else {
      setActiveToggle(urlToggle);
    }

    setHasInitialized(true);
  }, [preferencesLoading, hasInitialized, params, savePreference]);

  // CORRECTION: Nettoyer l'URL si elle contient "mes-quizzes" par défaut
  useEffect(() => {
    if (params.get("toggle") === "mes-quizzes" && !hasInitialized) {
      // Rediriger sans le paramètre pour forcer l'aventure
      navigate("/quizzes", { replace: true });
    }
  }, [params, navigate, hasInitialized]);

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
        {/* Bannière d'accroche */}
        <div className="mb-6">
          <div
            className={`bg-gradient-to-r ${randomAccroche.color} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-center gap-3 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                {randomAccroche.icon}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {randomAccroche.text}
              </h1>
            </div>
            <p className="text-center mt-3 text-white/90 text-lg">
              {activeToggle === "adventure"
                ? "Parcourez les chemins du savoir et découvrez de nouveaux défis !"
                : "Consultez tous vos quiz disponibles et mesurez vos progrès !"}
            </p>
          </div>
        </div>

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

            {/* Indicateur de mode actuel */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Mode {activeToggle === "adventure" ? "Aventure" : "Liste"}
              </span>
            </div>

            {/* Toggle Vue Quiz */}
            <div className="flex items-center gap-3 top-1 right-4 absolute">
              <List
                className={`h-7 w-7 transition-colors ${
                  activeToggle === "adventure"
                    ? "text-brown-shade"
                    : "text-gray-400"
                }`}
              />

              <button
                type="button"
                aria-label="Basculer la vue quiz"
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 
        ${activeToggle === "mes-quizzes" ? "bg-yellow-400" : "bg-gray-300"}
      `}
                onClick={() => {
                  const newToggle =
                    activeToggle === "adventure" ? "mes-quizzes" : "adventure";
                  setActiveToggle(newToggle);
                  // Sauvegarder la préférence utilisateur
                  savePreference(
                    newToggle === "adventure" ? "adventure" : "list"
                  );

                  // Mettre à jour l'URL
                  navigate(`/quizzes?toggle=${newToggle}`, { replace: true });

                  // Changer la phrase d'accroche en fonction du mode
                  const newIndex = Math.floor(
                    Math.random() * ACCROCHE_PHRASES.length
                  );
                  setRandomAccroche(ACCROCHE_PHRASES[newIndex]);
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
                    ? "text-brown-shade"
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
            {/* Sous-titre contextuel */}
            <div className="text-center mb-2">
              <p className="text-lg text-gray-600 font-medium">
                {activeToggle === "adventure"
                  ? "🎮 Explorez les quiz comme une aventure passionnante !"
                  : "📋 Gérez efficacement tous vos quiz en un seul endroit"}
              </p>
            </div>

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
