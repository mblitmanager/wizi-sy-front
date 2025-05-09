
import { useQuery } from "@tanstack/react-query";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { categoryService } from "@/services/quiz/CategoryService";
import type { Category } from "@/types/quiz";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo } from "react";
import { StagiaireQuizGrid } from "./StagiaireQuizGrid";
import { StagiaireQuizFilterBar } from "./StagiaireQuizFilterBar";
import { motion } from "framer-motion";

export function StagiaireQuizList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

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
    () => (filteredQuizzes || []).filter((q) => playedQuizIds.has(String(q.id))),
    [filteredQuizzes, playedQuizIds]
  );
  const notPlayedQuizzes = useMemo(
    () => (filteredQuizzes || []).filter((q) => !playedQuizIds.has(String(q.id))),
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

  // Add category quiz counts
  const categoriesWithCount = categories?.map(category => ({
    ...category,
    quizCount: quizzes.filter(q => String(q.categorieId) === String(category.id)).length
  }));

  return (
    <div className="space-y-6">
      <StagiaireQuizFilterBar
        categories={categoriesWithCount}
        levels={levels}
        selectedCategory={selectedCategory}
        selectedLevel={selectedLevel}
        setSelectedCategory={setSelectedCategory}
        setSelectedLevel={setSelectedLevel}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
      />

      <div className="space-y-8">
        {/* Section des quiz non joués */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-4 sm:p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Quiz à découvrir</h2>
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
        </motion.div>

        {/* Section des quiz joués */}
        {showCompleted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white shadow-lg rounded-lg p-4 sm:p-6"
          >
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
