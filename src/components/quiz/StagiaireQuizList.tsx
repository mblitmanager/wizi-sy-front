import { useQuery } from "@tanstack/react-query";
import React from "react";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { categoryService } from "@/services/quiz/CategoryService";
import type { Category } from "@/types/quiz";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo } from "react";
import { StagiaireQuizGrid } from "./StagiaireQuizGrid";
import { useClassementPoints } from "@/hooks/useClassementPoints";
import { useToast } from "@/hooks/use-toast";

export function StagiaireQuizList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { toast } = useToast();

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

  // Récupérer les points utilisateur depuis le classement global
  const { points: userPoints } = useClassementPoints();

  // Notification si l'utilisateur peut jouer un quiz de niveau supérieur
  const [notifiedLevel, setNotifiedLevel] = useState<number | null>(null);
  // Utiliser useEffect (et pas useMemo) pour la notification
  React.useEffect(() => {
    if (quizzes) {
      if (userPoints >= 50 && notifiedLevel !== 2) {
        toast({
          title: "Niveau avancé débloqué !",
          description: "Vous pouvez maintenant jouer aux quiz avancés.",
          variant: "default",
          className: "bg-gradient-to-r from-orange-700 to-yellow-700 text-white border-0"
        });
        setNotifiedLevel(2);
      } else if (userPoints >= 20 && userPoints < 50 && notifiedLevel !== 1) {
        toast({
          title: "Niveau intermédiaire débloqué !",
          description: "Vous pouvez maintenant jouer aux quiz intermédiaires.",
          variant: "default",
          className: "bg-gradient-to-r from-orange-700 to-yellow-700 text-white border-0"
        });
        setNotifiedLevel(1);
      } else if (userPoints >= 10 && userPoints < 20 && notifiedLevel !== 0) {
        toast({
          title: "Nouveaux quiz disponibles !",
          description: "Vous avez débloqué de nouveaux quiz débutant.",
          variant: "default",
          className: "bg-gradient-to-r from-orange-700 to-yellow-700 text-white border-0"
        });
        setNotifiedLevel(0);
      }
    }
  }, [userPoints, quizzes, notifiedLevel, toast]);

  // Filtrage avancé selon les points utilisateur (pour les quiz à jouer)
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    // 1. Séparer les quiz par niveau
    const debutant = quizzes.filter((q) => q.niveau?.toLowerCase() === "débutant");
    const inter = quizzes.filter((q) => q.niveau?.toLowerCase() === "intermédiaire");
    const avance = quizzes.filter((q) => q.niveau?.toLowerCase() === "avancé");
    let result: typeof quizzes = [];
    let inter1: typeof quizzes = [];
    let avance1: typeof quizzes = [];
    let avance2: typeof quizzes = [];
    if (userPoints < 10) {
      // Montrer 1 ou 2 quiz débutant max

      result = debutant.slice(0, 2);
    } else if (userPoints < 20) {

      // Montrer tous les quiz débutant
      console.log(debutant)
      result = debutant.slice(0, 4);
    } else if (userPoints < 40) {
      // Débutant + intermédiaire (2 quiz intermédiaire max)
      inter1 = inter.slice(0, 2);
      result = [...debutant, ...inter1];
    } else if (userPoints < 50) {
      // Débutant + tous les intermédiaires
      result = [...debutant, ...inter];
    } else if (userPoints < 80) {
      // Débutant + tous les intermédiaires
      avance1 = avance.slice(0, 2);
      result = [...debutant, ...inter, ...avance1];
    } else if (userPoints < 100) {
      // Débutant + intermédiaire + avancé
      avance2 = avance.slice(0, 4);
      result = [...debutant, ...inter, ...avance2];
    } else {
      // Tous les quiz
      result = [...debutant, ...inter, ...avance];
    }
    // Appliquer les filtres catégorie/niveau si besoin
    return result.filter((quiz) => {
      const categoryMatch =
        selectedCategory === "all" ||
        (quiz.categorieId && String(quiz.categorieId) === String(selectedCategory));
      const levelMatch =
        selectedLevel === "all" || (quiz.niveau && quiz.niveau === selectedLevel);
      return categoryMatch && levelMatch;
    });
  }, [quizzes, selectedCategory, selectedLevel, userPoints]);

  // Quiz déjà joués : toujours affichés, sans restriction de points
  const playedQuizzes = useMemo(
    () =>
      quizzes && participations
        ? quizzes.filter((q) =>
          participations.some((p) => String(p.quizId || p.id) === String(q.id))
        )
        : [],
    [quizzes, participations]
  );

  // Quiz non joués filtrés par points
  const notPlayedQuizzes = useMemo(
    () =>
      quizzes && participations
        ? filteredQuizzes.filter((q) =>
          !participations.some((p) => String(p.quizId || p.id) === String(q.id))
        )
        : [],
    [filteredQuizzes, quizzes, participations]
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

  // Composant interactif d'explication de progression
  function QuizUnlockTutorial() {
    const steps = [
      {
        title: "Débloquez votre progression, un quiz à la fois !",
        content: (
          <>
            <p className="mb-2">Commencez avec <span className="font-medium">2 quiz débutants</span> pour vous échauffer.</p>
            <p>Jouez, marquez des points et déverrouillez progressivement de nouveaux quiz !</p>
          </>
        ),
      },
      {
        title: "Débloquez les niveaux !",
        content: (
          <ul className="list-disc pl-5 text-sm text-yellow-900 space-y-1">
            <li><span className="font-medium">À 10 points :</span> Tous les quiz débutants deviennent accessibles.</li>
            <li><span className="font-medium">À 20 points :</span> Les quiz intermédiaires s’ouvrent à vous.</li>
            <li><span className="font-medium">À 40 points :</span> Tous les quiz débutants et intermédiaires sont disponibles.</li>
            <li><span className="font-medium">À 50 points :</span> Les premiers quiz avancés sont débloqués.</li>
            <li><span className="font-medium">À 80 points :</span> Accédez à encore plus de quiz avancés.</li>
            <li><span className="font-medium">À 100 points :</span> Tous les quiz sont à votre portée !</li>
          </ul>
        ),
      },
      {
        title: "Astuce !",
        content: (
          <>
            <p className="text-sm text-yellow-900 mb-1">Seul votre meilleur score est conservé. N'hésitez pas à recommencer pour décrocher la note parfaite !</p>
            <p className="mt-1 text-xs text-yellow-700">Chaque réponse compte. Accumulez des points et explorez tout l’univers des quiz !</p>
          </>
        ),
      },
    ];
    const [step, setStep] = React.useState(0);
    React.useEffect(() => {
      const timer = setTimeout(() => setStep((s) => (s + 1) % steps.length), 5000);
      return () => clearTimeout(timer);
    }, [step, steps.length]);
    return (
      <div className="mb-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm transition-all duration-500">
          <p className="font-semibold text-yellow-800 mb-1">{steps[step].title}</p>
          <div>{steps[step].content}</div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900"
              onClick={() => setStep((s) => (s - 1 + steps.length) % steps.length)}
              aria-label="Étape précédente"
            >
              ◀
            </button>
            <button
              className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900"
              onClick={() => setStep((s) => (s + 1) % steps.length)}
              aria-label="Étape suivante"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    );
  }

  function QuizUnlockTutorialPopup() {
    const steps = [
      {
        title: "Débloquez votre progression, un quiz à la fois !",
        content: (
          <>
            <p className="mb-2">Commencez avec <span className="font-medium">2 quiz débutants</span> pour vous échauffer.</p>
            <p>Jouez, marquez des points et déverrouillez progressivement de nouveaux quiz !</p>
          </>
        ),
      },
      {
        title: "Débloquez les niveaux !",
        content: (
          <ul className="list-disc pl-5 text-sm text-yellow-900 space-y-1">
            <li><span className="font-medium">À 10 points :</span> Tous les quiz débutants deviennent accessibles.</li>
            <li><span className="font-medium">À 20 points :</span> Les quiz intermédiaires s’ouvrent à vous.</li>
            <li><span className="font-medium">À 40 points :</span> Tous les quiz débutants et intermédiaires sont disponibles.</li>
            <li><span className="font-medium">À 50 points :</span> Les premiers quiz avancés sont débloqués.</li>
            <li><span className="font-medium">À 80 points :</span> Accédez à encore plus de quiz avancés.</li>
            <li><span className="font-medium">À 100 points :</span> Tous les quiz sont à votre portée !</li>
          </ul>
        ),
      },
      {
        title: "Astuce !",
        content: (
          <>
            <p className="text-sm text-yellow-900 mb-1">Seul votre meilleur score est conservé. N'hésitez pas à recommencer pour décrocher la note parfaite !</p>
            <p className="mt-1 text-xs text-yellow-700">Chaque réponse compte. Accumulez des points et explorez tout l’univers des quiz !</p>
          </>
        ),
      },
    ];
    const [step, setStep] = React.useState(0);
    // Vérifier si le tuto a déjà été affiché (localStorage)
    const [visible, setVisible] = React.useState(() => {
      if (typeof window !== "undefined") {
        return !localStorage.getItem("quizTutorialShown");
      }
      return true;
    });
    React.useEffect(() => {
      if (!visible) return;
      const stepTimer = setTimeout(() => setStep((s) => (s + 1) % steps.length), 2500);
      const hideTimer = setTimeout(() => setVisible(false), 8000);
      return () => {
        clearTimeout(stepTimer);
        clearTimeout(hideTimer);
      };
    }, [step, visible, steps.length]);
    // Lors de la fermeture, enregistrer en localStorage
    const handleClose = () => {
      setVisible(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("quizTutorialShown", "true");
      }
    };
    if (!visible) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded shadow-xl max-w-md w-full relative">
          <button
            className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900 text-lg"
            onClick={handleClose}
            aria-label="Fermer le tutoriel"
          >
            ×
          </button>
          <p className="font-semibold text-yellow-800 mb-1 text-lg">{steps[step].title}</p>
          <div>{steps[step].content}</div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900"
              onClick={() => setStep((s) => (s - 1 + steps.length) % steps.length)}
              aria-label="Étape précédente"
            >
              ◀
            </button>
            <button
              className="text-xs px-2 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900"
              onClick={() => setStep((s) => (s + 1) % steps.length)}
              aria-label="Étape suivante"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 mt-[-10%] md:mt-0">
        <h2 className="text-3xl sm:text-2xl md:text-3xl text-brown-shade font-bold">
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
        {/* Explication sur la disponibilité des quiz */}
        

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
        <QuizUnlockTutorial />
      </div>
      {/* </div> */}
      <QuizUnlockTutorialPopup />
    </div>
  );
}
