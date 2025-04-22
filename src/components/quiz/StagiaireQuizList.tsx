
import { useQuery } from "@tanstack/react-query";
import { quizService } from "@/services/QuizService";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo, useEffect } from "react";
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

  // Debug logs to identify the issue
  useEffect(() => {
    if (quizzes) {
      console.log("All quizzes:", quizzes);
      console.log("Selected category:", selectedCategory);
      console.log("Categories data:", categories);
      
      // Debug each quiz's category ID
      quizzes.forEach(quiz => {
        console.log(`Quiz ${quiz.titre} - categorieId: ${quiz.categorieId}, category name: ${quiz.categorie}`);
      });
      
      // Debug available categories
      if (categories) {
        categories.forEach(category => {
          console.log(`Category ID: ${category.id}, Name: ${category.name}`);
        });
      }
    }
  }, [quizzes, selectedCategory, categories]);

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
      // Check if the category filter matches
      const categoryMatch = 
        selectedCategory === "all" || 
        // Look for exact match by ID or fuzzy match by name
        quiz.categorieId === selectedCategory || 
        (categories && categories.some(cat => 
          cat.id === selectedCategory && 
          quiz.categorie?.toLowerCase() === cat.name.toLowerCase()
        ));
      
      // Check if the level filter matches
      const levelMatch = selectedLevel === "all" || quiz.niveau === selectedLevel;
      
      return categoryMatch && levelMatch;
    });
  }, [quizzes, selectedCategory, selectedLevel, categories]);

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
          categories={categories}
          levels={levels}
          selectedCategory={selectedCategory}
          selectedLevel={selectedLevel}
          setSelectedCategory={setSelectedCategory}
          setSelectedLevel={setSelectedLevel}
        />
      </div>
      <StagiaireQuizGrid
        quizzes={filteredQuizzes}
        categories={categories}
      />
    </div>
  );
}
