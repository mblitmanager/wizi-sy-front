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
    queryFn: async () => {
      const quizzes = await stagiaireQuizService.getStagiaireQuizzes();
      // Pour chaque quiz, calculer le total des points correctement
      return quizzes.map((quiz) => {
        // Convertir tous les points en nombres et les sommer
        const totalPoints =
          quiz.questions?.reduce((sum, question) => {
            // Convertir les points en number (gère les strings et les numbers)
            const points =
              typeof question.points === "string"
                ? parseInt(question.points, 10) || 0
                : question.points || 0;
            return sum + points;
          }, 0) || 0;

        return {
          ...quiz,
          totalPoints, // Utiliser le total calculé
          // Si vous voulez garder le format string à 2 chiffres comme dans les données
          totalPointsFormatted: totalPoints.toString().padStart(2, "0"),
        };
      });
    },
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
    
    console.log('Selected Category:', selectedCategory);
    console.log('Available Categories:', categories);
    console.log('Quizzes before filter:', quizzes);

    return quizzes.filter((quiz) => {
      const categoryMatch =
        selectedCategory === "all" ||
        (quiz.categorieId && String(quiz.categorieId) === String(selectedCategory));
      
      const levelMatch =
        selectedLevel === "all" || 
        (quiz.niveau && quiz.niveau === selectedLevel);

      console.log('Quiz:', quiz.title, {
        categorieId: quiz.categorieId,
        selectedCategory,
        categoryMatch,
        niveau: quiz.niveau,
        selectedLevel,
        levelMatch
      });

      return categoryMatch && levelMatch;
    });
  }, [quizzes, selectedCategory, selectedLevel, categories]);

  const playedQuizIds = useMemo(
    () => new Set((participations || []).map((p) => String(p.quizId || p.id))),
    [participations]
  );

  const playedQuizzes = useMemo(
    () => filteredQuizzes.filter((q) => playedQuizIds.has(String(q.id))),
    [filteredQuizzes, playedQuizIds]
  );

  const notPlayedQuizzes = useMemo(
    () => filteredQuizzes.filter((q) => !playedQuizIds.has(String(q.id))),
    [filteredQuizzes, playedQuizIds]
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
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-brown-shade font-bold">
          Mes Quiz
        </h2>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Catégorie */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2">
            {/* <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Catégorie :</span> */}
            <select
              className="w-full sm:w-auto border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-blue-200 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">Catégorie</option>
              {(categories || []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Niveau */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2">
            {/* <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Niveau :</span> */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                className="flex-1 sm:flex-none border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-blue-200 bg-white"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}>
                <option value="all">Niveau</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {selectedLevel !== "all" && (
                <button
                  className="px-2 py-1.5 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-100 bg-white"
                  onClick={() => setSelectedLevel("all")}>
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className="mb-4" />
      {/* <div className="mt-2 h-[calc(100vh-25rem)] overflow-y-auto p-4"> */}
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
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 sm:mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Rejouez à vos anciens quiz
          </h3>
          <hr className="mb-4" />
          {playedQuizzes.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun quiz joué pour l'instant.</p>
            </div>
          ) : (
            <StagiaireQuizGrid
              quizzes={playedQuizzes}
              categories={categories || []}
            />
          )}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
