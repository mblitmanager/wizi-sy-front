import { useQuery } from "@tanstack/react-query";
import React from "react";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { categoryService } from "@/services/quiz/CategoryService";
import type { Category } from "@/types/quiz";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo, useEffect } from "react";
import { StagiaireQuizGrid } from "./StagiaireQuizGrid";
import { useClassementPoints } from "@/hooks/useClassementPoints";
import { buildAvailableQuizzes } from "./quizUtils";
import { useToast } from "@/hooks/use-toast";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";

export function StagiaireQuizList({
  selectedFormationId,
}: {
  selectedFormationId?: string | null;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { toast } = useToast();
  const quizzesPerPage = 6;

  // DEBUG: Log pour voir la formation sélectionnée
  useEffect(() => {
    console.log("🔍 DEBUG - Formation sélectionnée:", selectedFormationId);
  }, [selectedFormationId]);

  const {
    data: quizzes,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useQuery({
    queryKey: ["stagiaire-quizzes"],
    queryFn: async () => {
      const quizzes = await stagiaireQuizService.getStagiaireQuizzes();

      // DEBUG: Log des quizzes récupérés
      console.log("📥 DEBUG - Tous les quizzes récupérés:", quizzes);

      return quizzes.map((quiz) => {
        const totalPoints =
          quiz.questions?.reduce((sum, question) => {
            const points =
              typeof question.points === "string"
                ? parseInt(question.points, 10) || 0
                : question.points || 0;
            return sum + points;
          }, 0) || 0;

        return {
          ...quiz,
          totalPoints,
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

  // Dans le useQuery de quizHistory, ajoutez :
  const { data: quizHistory } = useQuery({
    queryKey: ["quiz-history"],
    queryFn: async () => {
      const history = await quizHistoryService.getQuizHistory();
      console.log("📋 DEBUG - Historique complet:", history);
      console.log("📋 DEBUG - Premier élément de l'historique:", history[0]);
      return history;
    },
    enabled: !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000,
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

  const { points: userPoints } = useClassementPoints();

  const [notifiedLevel, setNotifiedLevel] = useState<number | null>(null);
  const [lastUserPoints, setLastUserPoints] = useState<number | null>(null);

  React.useEffect(() => {
    if (lastUserPoints === null) {
      setLastUserPoints(userPoints);
      return;
    }
    if (userPoints !== lastUserPoints) {
      if (quizzes) {
        if (userPoints >= 50 && notifiedLevel !== 2) {
          toast({
            title: "Niveau avancé débloqué !",
            description: "Vous pouvez maintenant participer aux quiz avancés.",
            variant: "default",
            className: "bg-orange-600 text-white border-0",
          });
          setNotifiedLevel(2);
        } else if (userPoints >= 20 && userPoints < 50 && notifiedLevel !== 1) {
          toast({
            title: "Niveau intermédiaire débloqué !",
            description:
              "Vous pouvez maintenant participer aux quiz intermédiaires.",
            variant: "default",
            className: "bg-orange-600 text-white border-0",
          });
          setNotifiedLevel(1);
        } else if (userPoints >= 10 && userPoints < 20 && notifiedLevel !== 0) {
          toast({
            title: "Nouveaux quiz disponibles !",
            description: "Vous avez débloqué de nouveaux quiz débutant.",
            variant: "default",
            className: "bg-orange-600 text-white border-0",
          });
          setNotifiedLevel(0);
        }
      }
      setLastUserPoints(userPoints);
    }
  }, [userPoints, quizzes, notifiedLevel, toast, lastUserPoints]);

  // DEBUG: Vérifier la structure des quizzes
  useEffect(() => {
    if (quizzes && quizzes.length > 0) {
      console.log("- DEBUG - Structure du premier quiz:", quizzes[0]);
      console.log(
        "- DEBUG - FormationId du premier quiz:",
        (quizzes[0] as any).formationId
      );
      console.log(
        "- DEBUG - Tous les formationIds:",
        quizzes.map((q: any) => ({
          id: q.id,
          titre: q.titre,
          formationId: q.formationId,
          formation: q.formation,
        }))
      );
    }
  }, [quizzes]);

  // CORRECTION: Simplifier la logique de formation
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];

    // Étape 1: Filtrer par formation sélectionnée
    let formationFiltered = quizzes;
    if (selectedFormationId) {
      formationFiltered = quizzes.filter((quiz) => {
        const quizFormationId = (quiz as any).formationId;
        const match = String(quizFormationId) === String(selectedFormationId);

        return match;
      });
    }

    // Étape 2: Appliquer buildAvailableQuizzes
    const base = buildAvailableQuizzes(
      formationFiltered,
      userPoints,
      selectedFormationId
    );

    // Étape 3: Filtrer par catégorie et niveau
    const finalFiltered = base.filter((quiz) => {
      const categoryMatch =
        selectedCategory === "all" ||
        (quiz.categorieId &&
          String(quiz.categorieId) === String(selectedCategory));

      const levelMatch =
        selectedLevel === "all" ||
        (quiz.niveau && quiz.niveau === selectedLevel);

      return categoryMatch && levelMatch;
    });
    return finalFiltered;
  }, [
    quizzes,
    selectedCategory,
    selectedLevel,
    userPoints,
    selectedFormationId, // IMPORTANT: utiliser selectedFormationId directement
  ]);

  const playedQuizzes = useMemo(() => {
    if (!quizzes || !quizHistory) return [] as typeof quizzes;

    type HistoryMinimal = {
      quiz?: { id?: string | number; formationId?: string | number };
      quizId?: string | number;
      completedAt?: string;
    };

    const byId = new Map<string, { completedAt?: string }>();
    (quizHistory as HistoryMinimal[]).forEach((h) => {
      const id = h.quiz?.id ?? h.quizId;
      if (id !== undefined)
        byId.set(String(id), { completedAt: h.completedAt });
    });

    let list = quizzes.filter((q) => byId.has(String(q.id)));

    // CORRECTION: Filtrer par formation sélectionnée
    if (selectedFormationId) {
      list = list.filter(
        (q) => String((q as any).formationId) === String(selectedFormationId)
      );
    }

    console.log("🎮 DEBUG - Quiz joués après filtrage:", list.length, list);

    // tri antéchronologique par completedAt
    list.sort((a, b) => {
      const ha = byId.get(String(a.id));
      const hb = byId.get(String(b.id));
      const da = ha?.completedAt ? Date.parse(ha.completedAt) : 0;
      const db = hb?.completedAt ? Date.parse(hb.completedAt) : 0;
      return db - da;
    });

    return list;
  }, [quizzes, quizHistory, selectedFormationId]);

  const notPlayedQuizzes = useMemo(() => {
    if (!quizzes || !participations) return [];

    const result = filteredQuizzes.filter(
      (q) =>
        !participations.some((p) => String(p.quizId || p.id) === String(q.id))
    );

    return result;
  }, [filteredQuizzes, quizzes, participations]);

  // Pagination logic
  const [notPlayedCurrentPage, setNotPlayedCurrentPage] = useState(1);
  const [playedCurrentPage, setPlayedCurrentPage] = useState(1);

  const notPlayedPaginatedQuizzes = useMemo(() => {
    const startIndex = (notPlayedCurrentPage - 1) * quizzesPerPage;
    return notPlayedQuizzes.slice(startIndex, startIndex + quizzesPerPage);
  }, [notPlayedQuizzes, notPlayedCurrentPage]);

  const playedPaginatedQuizzes = useMemo(() => {
    const startIndex = (playedCurrentPage - 1) * quizzesPerPage;
    return playedQuizzes.slice(startIndex, startIndex + quizzesPerPage);
  }, [playedQuizzes, playedCurrentPage]);

  const totalNotPlayedPages = Math.ceil(
    notPlayedQuizzes.length / quizzesPerPage
  );
  const totalPlayedPages = Math.ceil(playedQuizzes.length / quizzesPerPage);

  // DEBUG: Résumé final
  useEffect(() => {
    console.log("- DEBUG - RÉSUMÉ FINAL:");
    console.log("- Formation sélectionnée:", selectedFormationId);
    console.log("- Total quizzes:", quizzes?.length);
    console.log("- Quiz joués:", playedQuizzes.length);
    console.log("- Quiz non joués:", notPlayedQuizzes.length);
    console.log("- Pages non joués:", totalNotPlayedPages);
    console.log("- Pages joués:", totalPlayedPages);
  }, [
    selectedFormationId,
    quizzes,
    playedQuizzes,
    notPlayedQuizzes,
    totalNotPlayedPages,
    totalPlayedPages,
  ]);

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
        <p className="text-gray-500">Aucun quiz disponible</p>
      </div>
    );
  }

  function QuizUnlockTutorial() {
    const steps = [
      {
        title: "Débloquez votre progression, un quiz à la fois !",
        content: (
          <>
            <p className="mb-2">
              Commencez avec{" "}
              <span className="font-medium">2 quiz débutants</span> pour vous
              échauffer.
            </p>
            <p>
              Jouez, marquez des points et déverrouillez progressivement de
              nouveaux quiz !
            </p>
          </>
        ),
      },
      {
        title: "Débloquez les niveaux !",
        content: (
          <ul className="list-disc pl-5 text-sm text-yellow-900 space-y-1">
            <li>
              <span className="font-medium">À 20 points :</span> Les quiz
              intermédiaires s'ouvrent à vous.
            </li>
            <li>
              <span className="font-medium">À 50 points :</span> Les premiers
              quiz avancés sont débloqués.
            </li>
            <li>
              <span className="font-medium">À 100 points :</span> Tous les quiz
              sont à votre portée !
            </li>
          </ul>
        ),
      },
      {
        title: "Astuce !",
        content: (
          <>
            <p className="text-sm text-yellow-900 mb-1">
              Seul votre meilleur score est conservé.
            </p>
            <p className="mt-1 text-xs text-yellow-700">
              Chaque réponse compte. Accumulez des points et explorez tout
              l'univers des quiz !
            </p>
          </>
        ),
      },
    ];
    const [step, setStep] = React.useState(0);
    React.useEffect(() => {
      const timer = setTimeout(
        () => setStep((s) => (s + 1) % steps.length),
        5000
      );
      return () => clearTimeout(timer);
    }, [step, steps.length]);
    return (
      <div className="mb-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm transition-all duration-500">
          <p className="font-semibold text-yellow-800 mb-1">
            {steps[step].title}
          </p>
          <div>{steps[step].content}</div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900"
              onClick={() =>
                setStep((s) => (s - 1 + steps.length) % steps.length)
              }>
              ◀
            </button>
            <button
              className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900"
              onClick={() => setStep((s) => (s + 1) % steps.length)}>
              ▶
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* DEBUG: Afficher la formation sélectionnée
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>DEBUG:</strong> Formation sélectionnée:{" "}
          <code>{selectedFormationId || "Aucune"}</code> | Quiz totaux:{" "}
          <code>{quizzes?.length || 0}</code> | Quiz filtrés:{" "}
          <code>{filteredQuizzes.length}</code> | Non joués:{" "}
          <code>{notPlayedQuizzes.length}</code> | Joués:{" "}
          <code>{playedQuizzes.length}</code>
        </p>
      </div> */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-3xl sm:text-2xl md:text-3xl text-brown-shade font-bold">
          Quiz
        </h2>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                className="flex-1 sm:flex-none border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-blue-200 bg-white"
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setNotPlayedCurrentPage(1);
                  setPlayedCurrentPage(1);
                }}>
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
                  onClick={() => {
                    setSelectedLevel("all");
                    setNotPlayedCurrentPage(1);
                    setPlayedCurrentPage(1);
                  }}>
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className="mb-4" />

      <div className="space-y-6">
        <QuizUnlockTutorial />

        {/* Quiz non joués */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          {notPlayedQuizzes.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {filteredQuizzes.length === 0
                  ? "Aucun quiz disponible pour cette formation"
                  : "Tous les quiz ont été joués !"}
              </p>
            </div>
          ) : (
            <>
              <StagiaireQuizGrid
                quizzes={notPlayedPaginatedQuizzes}
                categories={categories || []}
              />
              {totalNotPlayedPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setNotPlayedCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={notPlayedCurrentPage === 1}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from(
                      { length: totalNotPlayedPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setNotPlayedCurrentPage(page)}
                        className={`w-8 h-8 rounded-md ${
                          notPlayedCurrentPage === page
                            ? "bg-black text-white"
                            : "border border-gray-300"
                        }`}>
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setNotPlayedCurrentPage((prev) =>
                          Math.min(prev + 1, totalNotPlayedPages)
                        )
                      }
                      disabled={notPlayedCurrentPage === totalNotPlayedPages}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quiz joués */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 sm:mb-4">
          <h3 className="text-3xl sm:text-2xl md:text-3xl text-brown-shade font-bold mb-2">
            Rejouez à vos anciens quiz
          </h3>
          <hr className="mb-4" />
          {playedQuizzes.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun quiz joué pour l'instant.</p>
            </div>
          ) : (
            <>
              <StagiaireQuizGrid
                quizzes={playedPaginatedQuizzes}
                categories={categories || []}
              />
              {totalPlayedPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPlayedCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={playedCurrentPage === 1}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from(
                      { length: totalPlayedPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setPlayedCurrentPage(page)}
                        className={`w-8 h-8 rounded-md ${
                          playedCurrentPage === page
                            ? "bg-black text-white"
                            : "border border-gray-300"
                        }`}>
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setPlayedCurrentPage((prev) =>
                          Math.min(prev + 1, totalPlayedPages)
                        )
                      }
                      disabled={playedCurrentPage === totalPlayedPages}
                      className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
