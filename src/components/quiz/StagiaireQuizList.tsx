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
  
  const { data: quizzes, isLoading: quizzesLoading, error: quizzesError } = useQuery({
    queryKey: ["stagiaire-quizzes"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizzes(),
    enabled: !!localStorage.getItem('token')
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem('token')
  });

  const isLoading = quizzesLoading || categoriesLoading;
  const error = quizzesError;

  const levels = useMemo(() => {
    if (!quizzes) return [];
    const uniqueLevels = new Set<string>();
    quizzes.forEach(quiz => {
      if (quiz.niveau) uniqueLevels.add(quiz.niveau);
    });
    return Array.from(uniqueLevels);
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter(quiz => {
      const categoryMatch = selectedCategory === "all" || String(quiz.categorieId) === String(selectedCategory);
      const levelMatch = selectedLevel === "all" || quiz.niveau === selectedLevel;
      return categoryMatch && levelMatch;
    });
  }, [quizzes, selectedCategory, selectedLevel]);

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
          Une erreur est survenue lors du chargement de vos quiz. Veuillez réessayer plus tard.
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
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Mes Quiz</h2>
        <div className="flex items-center gap-2">
          {/* Filtre par catégorie */}
          <span className="text-sm text-gray-500">Catégorie :</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="all">Toutes</option>
            {(categories || []).map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {/* Filtre par niveau */}
          <span className="text-sm text-gray-500 ml-4">Niveau :</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
          >
            <option value="all">Tous les niveaux</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {selectedLevel !== "all" && (
            <button
              className="ml-2 px-2 py-1 border rounded text-xs"
              onClick={() => setSelectedLevel("all")}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun quiz ne correspond à vos filtres</p>
        </div>
      ) : (
        <StagiaireQuizGrid
          quizzes={filteredQuizzes}
          categories={categories || []}
        />
      )}
    </div>
  );
}
