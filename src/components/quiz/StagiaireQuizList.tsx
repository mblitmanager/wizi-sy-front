import { useQuery } from "@tanstack/react-query";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { categoryService } from "@/services/quiz/CategoryService";
import type { Category } from "@/types/quiz";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo } from "react";
import { StagiaireQuizGrid } from "./StagiaireQuizGrid";

export function StagiaireQuizList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const {
    data: quizzes,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useQuery({
    queryKey: ["stagiaire-quizzes"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizzes(),
    enabled: !!localStorage.getItem("token"),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem("token"),
  });

  const { data: participations } = useQuery({
    queryKey: ["stagiaire-participations"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizJoue(),
    enabled: !!localStorage.getItem("token"),
  });

  const isLoading = quizzesLoading || categoriesLoading;
  const error = quizzesError;

  const levels = useMemo(() => {
    if (!quizzes) return [];
    const uniqueLevels = new Set<string>();
    quizzes.forEach((quiz) => {
      if (quiz.niveau) uniqueLevels.add(quiz.niveau);
    });
    return Array.from(uniqueLevels);
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter((quiz) => {
      const categoryMatch =
        selectedCategory === "all" ||
        String(quiz.categorieId) === String(selectedCategory);
      const levelMatch =
        selectedLevel === "all" || quiz.niveau === selectedLevel;
      return categoryMatch && levelMatch;
    });
  }, [quizzes, selectedCategory, selectedLevel]);

  const playedQuizIds = useMemo(
    () => new Set((participations || []).map((p: any) => String(p.id))),
    [participations]
  );
  const playedQuizzes = useMemo(
    () => (quizzes || []).filter((q) => playedQuizIds.has(String(q.id))),
    [quizzes, playedQuizIds]
  );
  const notPlayedQuizzes = useMemo(
    () => (quizzes || []).filter((q) => !playedQuizIds.has(String(q.id))),
    [quizzes, playedQuizIds]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors du chargement de vos quiz. Veuillez
          réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  if (!quizzes?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun quiz disponible pour vous</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Mes Quiz</h2>

        <div className="flex flex-row flex-wrap gap-2 sm:gap-4 items-center">
          {/* Catégorie */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Catégorie :</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring focus:ring-blue-200"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">Toutes</option>
              {(categories || []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Niveau */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Niveau :</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring focus:ring-blue-200"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="all">Tous les niveaux</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {selectedLevel !== "all" && (
              <button
                className="px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-100"
                onClick={() => setSelectedLevel("all")}>
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section des quiz non joués */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          {notPlayedQuizzes.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Tous les quiz ont été joués !</p>
            </div>
          ) : (
            <StagiaireQuizGrid
              quizzes={notPlayedQuizzes}
              categories={categories || []}
            />
          )}
        </div>

        {/* Section des quiz joués */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Rejouez à vos quiz
          </h3>
          <hr className="mb-4" />
          {playedQuizzes.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun quiz joué pour l’instant.</p>
            </div>
          ) : (
            <StagiaireQuizGrid
              quizzes={playedQuizzes}
              categories={categories || []}
            />
          )}
        </div>
      </div>
    </div>
  );
}
