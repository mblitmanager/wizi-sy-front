import { useQuery } from "@tanstack/react-query";
import { quizService, type Category } from "@/services/QuizService";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo } from "react";
import { StagiaireQuizFilterBar } from "./StagiaireQuizFilterBar";
import { StagiaireQuizGrid } from "./StagiaireQuizGrid";

export function StagiaireQuizList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  
  const { data: quizzes, isLoading: quizzesLoading, error: quizzesError } = useQuery({
    queryKey: ["stagiaire-quizzes"],
    queryFn: () => quizService.getStagiaireQuizzes(),
    enabled: !!localStorage.getItem('token')
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => quizService.getCategories(),
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
    return Array.from(uniqueLevels).sort();
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    
    return quizzes.filter(quiz => {
      // Vérifier si la catégorie correspond
      const categoryMatch = 
        selectedCategory === "all" || 
        String(quiz.categorieId) === String(selectedCategory);
      
      // Vérifier si le niveau correspond
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
        <StagiaireQuizFilterBar
          categories={categories || []}
          levels={levels}
          selectedCategory={selectedCategory}
          selectedLevel={selectedLevel}
          setSelectedCategory={setSelectedCategory}
          setSelectedLevel={setSelectedLevel}
        />
      </div>
      <StagiaireQuizGrid
        quizzes={filteredQuizzes}
        categories={categories || []}
      />
    </div>
  );
}
