// src/pages/ProfileStatsPage.tsx
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";
import { useLoadQuizData } from "@/use-case/hooks/profile/useLoadQuizData";
import { useLoadRankings } from "@/use-case/hooks/profile/useLoadRankings";
import { useLoadFormations } from "@/use-case/hooks/profile/useLoadFormations";
import CategoryProgress from "@/components/profile/CategoryProgress";
import { RecentResults } from "@/components/profile/RecentResults";
import { useEffect, useState, useMemo } from "react";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import type { QuizHistory as QuizHistoryType, QuizResult } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";
import TrainerPerformanceStats from "@/components/formateur/TrainerPerformanceStats";
import { BookOpen, GraduationCap } from "lucide-react";

const isTrainer = (role: string | undefined) => role === 'formateur' || role === 'formatrice';
const ProfileStatsPage = () => {
  const { user } = useUser();
  const rawRole = user?.role || (user as any)?.user?.role;
  const isUserTrainer = isTrainer(rawRole);
  const { results, categories } = useLoadQuizData();
  const { userProgress, rankings } = useLoadRankings();
  const { formations, loading: loadingFormations } = useLoadFormations();
  const { toast } = useToast();
  const [quizHistory, setQuizHistory] = useState<QuizHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement de l'historique des quiz
  useEffect(() => {
    if (!user) return;

    const fetchQuizHistory = async () => {
      try {
        setLoading(true);
        const history = await quizSubmissionService.getQuizHistory();
        console.log("Quiz History:", history); // Debug log
        setQuizHistory(history);
      } catch (error) {
        console.error("Error fetching quiz history:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des quiz",
          variant: "destructive",
        });
        setQuizHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [user, toast]);

  // Transformation des données pour RecentResults avec gestion des erreurs
  const recentResultsData: QuizResult[] = useMemo(() => {
    if (!Array.isArray(quizHistory)) return [];

    return quizHistory.slice(0, 10).map((h) => {
      // Gestion robuste du titre du quiz
      let quizTitle = "Quiz";

      // Essayer différentes propriétés possibles
      if (h.quiz?.title) {
        quizTitle = h.quiz.title;
      } else if (h.quiz?.titre) {
        quizTitle = h.quiz.titre;
      } else if ((h as any).quiz_title) {
        quizTitle = (h as any).quiz_title;
      } else if ((h as any).quiz_name) {
        quizTitle = (h as any).quiz_name;
      }

      // Calcul du pourcentage
      const totalQuestions = h.totalQuestions || 0;
      const correctAnswers = h.correctAnswers || 0;
      const percentage =
        totalQuestions > 0
          ? Math.round((correctAnswers / totalQuestions) * 100)
          : 0;

      return {
        id: h.id?.toString() || Math.random().toString(),
        score: h.score || 0,
        totalPoints: totalQuestions, // totalPoints = nombre total de questions
        quizTitle,
        correctAnswers,
        totalQuestions,
        timeSpent: h.timeSpent || 0,
        questions: [],
        percentage,
        completed_at: h.completedAt,
        quizId: h.quizId?.toString() || h.quiz?.id?.toString() || "",
      };
    });
  }, [quizHistory]);

  const stats = useMemo(() => {
    const validHistory = Array.isArray(quizHistory) ? quizHistory : [];
    
    // Compter uniquement les quiz uniques
    const uniqueQuizIds = new Set(
      validHistory.map((h) => (h.quizId || h.quiz?.id || "").toString()).filter(id => id !== "")
    );
    const totalQuizzes = uniqueQuizIds.size;

    const averageScore =
      validHistory.length > 0
        ? Math.round(
            validHistory.reduce((acc, quiz) => {
              const totalQuestions = quiz.totalQuestions || 0;
              const correctAnswers = quiz.correctAnswers || 0;
              const percentage =
                totalQuestions > 0
                  ? (correctAnswers / totalQuestions) * 100
                  : 0;
              return acc + percentage;
            }, 0) / validHistory.length
          )
        : 0;

    return {
      totalQuizzes,
      averageScore,
    };
  }, [quizHistory]);

  const isLoading = loading || loadingFormations || !user || !categories || !userProgress;

  // Calcul des statistiques par formation ET par niveau
  const formationStats = useMemo(() => {
    if (!formations || formations.length === 0 || quizHistory.length === 0) return [];

    const statsMap = new Map<number, { 
      title: string; 
      count: number; 
      totalScore: number; 
      levels: Record<string, { count: number; totalScore: number; averageScore: number }> 
    }>();

    quizHistory.forEach((quiz) => {
      const formationId = quiz.quiz?.formation?.id;
      const formationTitle = quiz.quiz?.formation?.titre || "Inconnue";
      const rawLevel = quiz.quiz?.level || quiz.quiz?.niveau || "Non défini";
      const level = rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1).toLowerCase();

      if (formationId) {
        if (!statsMap.has(formationId)) {
          statsMap.set(formationId, { 
            title: formationTitle, 
            count: 0, 
            totalScore: 0,
            levels: {}
          });
        }
        
        const current = statsMap.get(formationId)!;
        const totalQuestions = quiz.totalQuestions || 0;
        const correctAnswers = quiz.correctAnswers || 0;
        const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        current.count += 1;
        current.totalScore += percentage;

        if (!current.levels[level]) {
          current.levels[level] = { count: 0, totalScore: 0, averageScore: 0 };
        }
        current.levels[level].count += 1;
        current.levels[level].totalScore += percentage;
        current.levels[level].averageScore = Math.round(current.levels[level].totalScore / current.levels[level].count);
      }
    });

    return Array.from(statsMap.entries()).map(([id, data]) => ({
      id,
      title: data.title,
      count: data.count,
      averageScore: Math.round(data.totalScore / data.count),
      levels: Object.entries(data.levels).map(([name, levelData]) => ({
        name,
        ...levelData
      }))
    }));
  }, [formations, quizHistory]);

  // Fonction pour calculer les performances détaillées
  const detailedStats = useMemo(() => {
    if (quizHistory.length === 0) return null;
    
    const validHistory = Array.isArray(quizHistory) ? quizHistory : [];

    const percentages = recentResultsData
      .map((r) => r.percentage || 0)
      .filter((p) => p > 0);

    const bestScore = percentages.length > 0 ? Math.max(...percentages) : 0;
    const minScore = percentages.length > 0 ? Math.min(...percentages) : 0;

    const successfulQuizzes = quizHistory.filter((q) => {
      const totalQuestions = q.totalQuestions || 0;
      const correctAnswers = q.correctAnswers || 0;
      const percentage =
        totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      return percentage >= 80;
    }).length;

    // Calcul des statistiques par niveau
    const statsByLevel = validHistory.reduce((acc, quiz) => {
      // Normaliser le niveau (gestion des cas null/undefined et majuscules/minuscules)
      const rawLevel = quiz.quiz?.level || quiz.quiz?.niveau || "Non défini";
      // Capitalize first letter
      const level = rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1).toLowerCase();

      if (!acc[level]) {
        acc[level] = {
          count: 0,
          totalPercentage: 0,
          averageScore: 0
        };
      }

      const totalQuestions = quiz.totalQuestions || 0;
      const correctAnswers = quiz.correctAnswers || 0;
      const percentage =
        totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      acc[level].count += 1;
      acc[level].totalPercentage += percentage;
      acc[level].averageScore = Math.round(acc[level].totalPercentage / acc[level].count);

      return acc;
    }, {} as Record<string, { count: number; totalPercentage: number; averageScore: number }>);

    return {
      bestScore,
      minScore,
      successfulQuizzes,
      statsByLevel,
    };
  }, [quizHistory, recentResultsData]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <Link
              to="/profile"
              className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 mb-4">
              ← Retour au profil
            </Link>
            <h1 className="text-2xl font-bold font-montserrat dark:text-white">
              Mes Statistiques
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Analyse détaillée de votre progression et performances
            </p>
          </div>

          {/* Squelette de chargement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
            {/* Progression par catégorie */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/6"></div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Résultats récents */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques globales */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm lg:col-span-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Si l'utilisateur est un formateur ou formatrice, afficher les statistiques de ses stagiaires
  if (isUserTrainer) {
    return (
      <Layout>
        <div className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <Link
              to="/profile"
              className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 mb-4">
              ← Retour au profil
            </Link>
            <h1 className="text-2xl font-bold font-montserrat dark:text-white">
              Performances Stagiaires
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Suivi détaillé de l'avancement de vos stagiaires
            </p>
          </div>
          <TrainerPerformanceStats />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        {/* Header avec navigation */}
        <div className="mb-6">
          <Link
            to="/profile"
            className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 mb-4">
            ← Retour au profil
          </Link>
          <h1 className="text-2xl font-bold font-montserrat dark:text-white">
            Mes Statistiques
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Analyse détaillée de votre progression et performances
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Statistiques par formation - Toujours affiché */}
          {formationStats.length > 0 && (
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 font-montserrat dark:text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-amber-500" />
                  Statistiques par Formation
                </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formationStats.map((stat) => (
                      <div key={stat.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="p-6 bg-brand-primary/5 border-b border-brand-primary/10">
                          <h4 className="font-black text-slate-900 dark:text-white text-base line-clamp-1 flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-brand-primary" />
                             {stat.title}
                          </h4>
                        </div>
                        
                        <div className="p-6 space-y-6">
                          <div className="flex justify-around items-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <div className="text-center">
                              <span className="block text-2xl font-black text-brand-primary">{stat.count}</span>
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Quiz</span>
                            </div>
                            <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700" />
                            <div className="text-center">
                              <span className="block text-2xl font-black text-brand-primary">{stat.averageScore}%</span>
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Moyenne</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Détails par niveau</p>
                            {stat.levels.map((level) => (
                              <div key={level.name} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-800/50 rounded-xl hover:border-brand-primary/30 transition-colors group">
                                <div className="flex items-center gap-3">
                                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-brand-primary transition-colors" />
                                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{level.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white block">{level.averageScore}%</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{level.count} quiz</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
             </div>
          )}

          {/* Progression par catégorie - Affichée uniquement si plusieurs formations */}
          {categories && categories.length > 1 && formations && formations.length > 1 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 font-montserrat dark:text-white">
                Progression par Catégorie
              </h3>
              {userProgress ? (
                <CategoryProgress
                  categories={categories}
                  userProgress={userProgress}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucune donnée de progression disponible
                </div>
              )}
            </div>
          )}

          {/* Résultats récents */}
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm ${(!formations || formations.length <= 1) ? 'lg:col-span-2' : ''}`}>
            <h3 className="text-lg font-semibold mb-4 font-montserrat dark:text-white">
              Quiz Récents
            </h3>
            <RecentResults
              results={recentResultsData}
              isLoading={loading}
              showAll={false}
            />
          </div>

          {/* Statistiques globales */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 font-montserrat dark:text-white">
              Aperçu Global
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.totalQuizzes}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Quiz complétés
                </div>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.averageScore}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Score moyen
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques par Niveau */}
          {detailedStats?.statsByLevel && Object.keys(detailedStats.statsByLevel).length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 font-montserrat dark:text-white">
                Statistiques par Niveau
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(detailedStats.statsByLevel).map(([level, data]) => (
                  <div key={level} className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">{level}</h4>
                    <div className="flex justify-around items-center">
                      <div>
                        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          {data.count}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Quiz joués
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          {data.averageScore}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Score moyen
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Détails supplémentaires */}
          {detailedStats && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 font-montserrat dark:text-white">
                Performance Détaillée
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {detailedStats.bestScore}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Meilleur score
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {detailedStats.minScore}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Score minimum
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {detailedStats.successfulQuizzes}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Quiz réussis (≥80%)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message si pas d'historique */}
          {quizHistory.length === 0 && !loading && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm lg:col-span-2 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="mx-auto h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun quiz complété
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Commencez à jouer à des quiz pour voir vos statistiques et votre
                progression apparaître ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfileStatsPage;
