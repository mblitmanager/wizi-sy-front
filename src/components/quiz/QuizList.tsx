import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { quizManagementService } from "@/services/quiz/QuizManagementService";
import { categoryService } from "@/services/quiz/CategoryService";
import type { Quiz, Category } from "@/types/quiz";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QuizCard } from "./QuizCard";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
function QuizListByCategory({
  categoryId,
  categories,
}: {
  categoryId: string;
  categories: Category[];
}) {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const {
    data: quizzes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quizzes", categoryId],
    queryFn: () => quizManagementService.getQuizzesByCategory(categoryId),
    enabled: !!categoryId && !!localStorage.getItem("token"),
  });

  // Extraire les niveaux uniques des quizzes
  const levels = useMemo(() => {
    if (!quizzes) return [];
    const uniqueLevels = new Set<string>();
    quizzes.forEach((quiz) => {
      if (quiz.niveau) uniqueLevels.add(quiz.niveau);
    });
    return Array.from(uniqueLevels);
  }, [quizzes]);

  // Filtrer les quizzes par niveau
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];

    return quizzes.filter((quiz) => {
      return selectedLevel === "all" || quiz.niveau === selectedLevel;
    });
  }, [quizzes, selectedLevel]);

  // Séparation quiz joués / non joués (si participations disponibles)
  const { data: participations } = useQuery({
    queryKey: ["quizlist-participations"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizJoue?.(),
    enabled:
      !!localStorage.getItem("token") &&
      !!stagiaireQuizService.getStagiaireQuizJoue,
  });
  const playedQuizIds = useMemo(
    () => new Set((participations || []).map((p: any) => String(p.id))),
    [participations]
  );
  const playedQuizzes = useMemo(
    () =>
      (filteredQuizzes || []).filter((q) => playedQuizIds.has(String(q.id))),
    [filteredQuizzes, playedQuizIds]
  );
  const notPlayedQuizzes = useMemo(
    () =>
      (filteredQuizzes || []).filter((q) => !playedQuizIds.has(String(q.id))),
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
          Une erreur est survenue lors du chargement des quiz. Veuillez
          réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  if (!quizzes?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Aucun quiz disponible dans cette catégorie
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Filtrer par niveau:</span>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                {selectedLevel === "all" ? (
                  "Tous les niveaux"
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          selectedLevel.toLowerCase() === "débutant"
                            ? "#22C55E"
                            : selectedLevel.toLowerCase() === "intermédiaire"
                            ? "#3B82F6"
                            : "#EF4444",
                      }}
                    />
                    {selectedLevel}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="text-gray-600">Tous les niveaux</span>
              </SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          level.toLowerCase() === "débutant"
                            ? "#22C55E"
                            : level.toLowerCase() === "intermédiaire"
                            ? "#3B82F6"
                            : "#EF4444",
                      }}
                    />
                    {level}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLevel !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedLevel("all")}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {notPlayedQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Tous les quiz ont été joués !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notPlayedQuizzes.map((quiz) => (
            <Link key={quiz.id} to={`/quiz/${quiz.id}`}>
              <QuizCard quiz={quiz} categories={categories} />
            </Link>
          ))}
        </div>
      )}
      <h3 className="text-lg font-bold mt-8 mb-2">Quiz déjà joués</h3>
      {playedQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun quiz joué pour l’instant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playedQuizzes.map((quiz) => (
            <Link key={quiz.id} to={`/quiz/${quiz.id}`}>
              <QuizCard quiz={quiz} categories={categories} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuizList() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem("token"),
  });

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
          Une erreur est survenue lors du chargement des catégories. Veuillez
          réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  if (!categories?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune catégorie disponible</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue={categories[0].id} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <QuizListByCategory
              categoryId={category.id}
              categories={categories}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
