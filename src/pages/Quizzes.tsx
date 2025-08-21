import { Layout } from "@/components/layout/Layout";
import axios from "axios";
import { useUser } from "@/hooks/useAuth";
import { StagiaireQuizList } from "@/components/quiz/StagiaireQuizList";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import { Loader2, WifiOff } from "lucide-react";
import StagiaireQuizAdventure from "@/components/quiz/StagiaireQuizAdventure";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useMemo, useState } from "react";
import { useFormationStagiaire } from "@/use-case/hooks/stagiaire/useFormationStagiaire";
import { useLocation, useNavigate } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  const params = new URLSearchParams(location.search);
  const initialToggle = params.get("toggle") || "adventure";
  const [activeToggle, setActiveToggle] = useState<string>(initialToggle);
  const [isSwitching, setIsSwitching] = useState(false);
  // Ajout filtre formation
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const { data: formations = [] } = useFormationStagiaire(user?.stagiaire?.id ?? null);
  const formationsWithTutos = useMemo(() => formations.data ?? [], [formations]);

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
      <div className="flex flex-row flex-wrap items-center gap-2 mb-4 w-full">
        <div className="flex flex-row items-center gap-2 flex-wrap w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className={`font-medium text-base ${activeToggle === 'adventure' ? 'text-blue-600' : 'text-gray-500'}`}>Aventure</span>
            <button
              type="button"
              aria-label="Basculer la vue quiz"
              className={`relative w-12 h-6 bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeToggle === 'mes-quizzes' ? 'bg-blue-600' : ''}`}
              onClick={() => setActiveToggle(activeToggle === 'adventure' ? 'mes-quizzes' : 'adventure')}
            >
              <span
                className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${activeToggle === 'mes-quizzes' ? 'translate-x-6' : ''}`}
              />
            </button>
            <span className={`font-medium text-base ${activeToggle === 'mes-quizzes' ? 'text-blue-600' : 'text-gray-500'}`}>Mes quiz</span>
          </div>
          <div className="flex items-center gap-2 min-w-[100px]">
            <label htmlFor="formation-select" className="font-medium text-base text-gray-700">Formation</label>
            <select
              id="formation-select"
              value={selectedFormationId ?? ''}
              onChange={e => setSelectedFormationId(e.target.value || null)}
              className="border rounded px-2 py-1 min-w-[80px] text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Sélectionner une formation"
            >
              {formationsWithTutos.map((formation) => (
                <option key={formation.id} value={formation.id}>{formation.label ?? formation.titre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {categoriesLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {activeToggle === 'adventure' && <StagiaireQuizAdventure selectedFormationId={selectedFormationId} />}
          {activeToggle === 'mes-quizzes' && <StagiaireQuizList selectedFormationId={selectedFormationId} />}
        </div>
      )}
    </Layout>
  );
}

