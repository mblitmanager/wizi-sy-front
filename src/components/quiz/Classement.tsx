import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStats } from "./classement/ProfileStats";
import { GlobalRanking } from "./classement/GlobalRanking";
import { QuizHistory } from "./classement/QuizHistory";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import type {
  QuizHistory as QuizHistoryType,
  LeaderboardEntry,
  Formateur,
} from "@/types/quiz";
import { useLocation } from "react-router-dom";

interface ProfileMinimal {
  stagiaire?: { id?: string | number };
}
interface CategoryStat {
  category: string;
  quizCount: number;
  averageScore: number;
}
interface LevelData {
  completed: number;
  averageScore: number;
}
interface LevelProgress {
  debutant?: LevelData;
  intermediaire?: LevelData;
  avance?: LevelData;
  [key: string]: LevelData | undefined;
}
interface QuizStatsEx {
  totalQuizzes: number;
  totalPoints: number;
  averageScore: number;
  categoryStats?: CategoryStat[];
  levelProgress?: LevelProgress;
}

interface GlobalClassementApiItem {
  stagiaire: { id: string | number; prenom: string; image?: string | null };
  totalPoints: number;
  quizCount: number;
  averageScore: number;
  rang?: number;
  formateurs?: Formateur[];
}

export function Classement() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tabParam = params.get("tab");

  const [profile, setProfile] = useState<ProfileMinimal | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryType[]>([]);
  const [quizStats, setQuizStats] = useState<QuizStatsEx | null>(null);
  const [globalRanking, setGlobalRanking] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState({
    profile: true,
    history: true,
    stats: true,
    ranking: true,
  });

  // Etat pour panneau d'info (modal simple)
  const [infoTitle, setInfoTitle] = useState<string | null>(null);
  const [infoContent, setInfoContent] = useState<React.ReactNode>(null);
  const [hideProfileStats, setHideProfileStats] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData: ProfileMinimal =
          await quizSubmissionService.getStagiaireProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading((prev) => ({ ...prev, profile: false }));
      }
    };

    const fetchQuizStats = async () => {
      try {
        const stats: QuizStatsEx = await quizSubmissionService.getQuizStats();
        setQuizStats(stats);
      } catch (error) {
        console.error("Error fetching quiz stats:", error);
      } finally {
        setLoading((prev) => ({ ...prev, stats: false }));
      }
    };

    const fetchGlobalRanking = async () => {
      try {
        const ranking: GlobalClassementApiItem[] =
          await quizSubmissionService.getGlobalClassement();

        console.log("📊 Données brutes du classement:", ranking); // Pour debug

        const mappedRanking: LeaderboardEntry[] = (ranking || []).map(
          (item) => ({
            id: Number(item.stagiaire.id),
            name: item.stagiaire.prenom,
            image: item.stagiaire.image || undefined,
            avatar: item.stagiaire.image || undefined,
            score: item.totalPoints,
            quizCount: item.quizCount,
            averageScore: item.averageScore,
            rang: item.rang,
            formateurs: item.formateurs || [],
          })
        );

        console.log("🎯 Classement mappé avec formateurs:", mappedRanking); // Pour debug
        setGlobalRanking(mappedRanking);
      } catch (error) {
        console.error("Error fetching global ranking:", error);
      } finally {
        setLoading((prev) => ({ ...prev, ranking: false }));
      }
    };

    console.log("globalRanking", globalRanking);

    const fetchQuizHistory = async () => {
      try {
        const history: QuizHistoryType[] =
          await quizSubmissionService.getQuizHistory();
        setQuizHistory(history);
      } catch (error) {
        console.error("Error fetching quiz history:", error);
      } finally {
        setLoading((prev) => ({ ...prev, history: false }));
      }
    };

    fetchProfileData();
    fetchQuizStats();
    fetchGlobalRanking();
    fetchQuizHistory();

    // read persisted preference for hiding profile stats
    try {
      const saved = localStorage.getItem("hideProfileStats");
      if (saved === "true") setHideProfileStats(true);
    } catch (e) {
      // localStorage may be unavailable (private mode) — keep app usable
      console.warn("Could not read hideProfileStats from localStorage", e);
    }
  }, []);

  // Calcul des stats utilisateur (fallback local)
  const userEntry = globalRanking.find(
    (entry) => entry.id?.toString() === profile?.stagiaire?.id?.toString()
  );
  const statsFallback =
    quizHistory && quizHistory.length > 0
      ? {
          totalScore: userEntry?.score || 0,
          totalQuizzes: userEntry?.quizCount || 0,
          averageScore:
            quizHistory.reduce((acc: number, q: QuizHistoryType) => {
              const total = (q as QuizHistoryType).totalQuestions ?? 0;
              const correct = (q as QuizHistoryType).correctAnswers ?? 0;
              return (
                acc + (total > 0 ? Math.round((correct / total) * 100) : 0)
              );
            }, 0) / quizHistory.length,
        }
      : {
          totalScore: 0,
          totalQuizzes: 0,
          averageScore: 0,
        };

  const totalQuizzes =
    quizStats?.totalQuizzes ?? statsFallback.totalQuizzes ?? 0;
  const totalPoints = quizStats?.totalPoints ?? statsFallback.totalScore ?? 0;
  const averageScore =
    quizStats?.averageScore ?? statsFallback.averageScore ?? 0;
  const categoryStats: CategoryStat[] = (quizStats?.categoryStats ??
    []) as CategoryStat[];
  const levelProgress: LevelProgress = (quizStats?.levelProgress ??
    {}) as LevelProgress;

  function openInfo(title: string, content: React.ReactNode) {
    setInfoTitle(title);
    setInfoContent(content);
  }
  function closeInfo() {
    setInfoTitle(null);
    setInfoContent(null);
  }

  return (
    <div
      className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 3rem)",
      }}>
      {/* Statistiques synthétiques en tête */}
      {!hideProfileStats ? (
        <div
          className={`w-full mt-4 md:mt-0 relative overflow-hidden transform transition-all duration-200 ease-in-out ${
            hideProfileStats
              ? "max-h-0 opacity-0 -translate-y-2"
              : "max-h-[800px] opacity-100 translate-y-0"
          }`}
          aria-hidden={hideProfileStats}>
          <button
            aria-label="Masquer les statistiques"
            title="Masquer"
            onClick={() => {
              try {
                localStorage.setItem("hideProfileStats", "true");
              } catch (e) {
                console.warn("Could not persist hideProfileStats", e);
              }
              setHideProfileStats(true);
            }}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 rounded-md p-1 z-20">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Masquer les statistiques</span>
          </button>
          <ProfileStats
            profile={profile as unknown as Record<string, unknown>}
            stats={statsFallback as unknown as Record<string, unknown>}
            loading={loading.profile || loading.ranking}
          />
        </div>
      ) : (
        <div className="w-full mt-4 md:mt-0 flex justify-center">
          <button
            className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
            onClick={() => {
              try {
                localStorage.removeItem("hideProfileStats");
              } catch (e) {
                console.warn("Could not remove hideProfileStats", e);
              }
              setHideProfileStats(false);
            }}>
            Afficher les statistiques
          </button>
        </div>
      )}
      <hr className="mn-2" />

      <Tabs
        defaultValue={
          tabParam === "history"
            ? "history"
            : tabParam === "stats"
            ? "stats"
            : "ranking"
        }
        className="mt-6">
        <TabsList className="grid grid-cols-3 gap-2 rounded-lg bg-gray-100 shadow-sm">
          <TabsTrigger
            value="ranking"
            className="text-xs text-brown-shade sm:text-sm md:text-base font-medium py-2 px-3 lg:px-4 focus:outline-none focus:ring-2 focus:ring-orange-500">
            Classement global
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="text-xs text-brown-shade sm:text-sm md:text-base font-medium py-2 px-3 lg:px-4 focus:outline-none focus:ring-2 focus:ring-orange-500">
            Statistiques
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="text-xs text-brown-shade sm:text-sm md:text-base font-medium py-2 px-3 lg:px-4 focus:outline-none focus:ring-2 focus:ring-orange-500">
            Mon historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="mt-4">
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
            <GlobalRanking
              ranking={globalRanking}
              loading={loading.ranking}
              currentUserId={profile?.stagiaire?.id?.toString()}
            />
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Cartes principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <StatsCard
                icon="assignment_turned_in"
                title="Quiz complétés"
                value={String(totalQuizzes)}
                color="primary"
                onClick={() =>
                  openInfo(
                    "Quiz complétés",
                    <div className="space-y-2">
                      <SheetRow label="Total" value={String(totalQuizzes)} />
                      <SheetRow
                        label="Score moyen"
                        value={`${Number(averageScore).toFixed(1)}%`}
                      />
                      <SheetRow
                        label="Points totaux"
                        value={String(totalPoints)}
                      />
                    </div>
                  )
                }
              />
              <StatsCard
                icon="star_rate"
                title="Score moyen"
                value={
                  totalQuizzes > 0
                    ? `${Number(averageScore * 10).toFixed(1)}%`
                    : "-"
                }
                color="amber"
                onClick={() =>
                  openInfo(
                    "Score moyen",
                    <div className="space-y-2">
                      <SheetRow
                        label="Score moyen"
                        value={
                          totalQuizzes > 0
                            ? `${(averageScore * 10).toFixed(1)}%`
                            : "-"
                        }
                      />

                      <SheetRow
                        label="Quiz complétés"
                        value={String(totalQuizzes)}
                      />
                    </div>
                  )
                }
              />
              <StatsCard
                icon="bolt"
                title="Points totaux"
                value={String(totalPoints)}
                color="green"
                onClick={() =>
                  openInfo(
                    "Points totaux",
                    <div className="space-y-2">
                      <SheetRow
                        label="Points totaux"
                        value={String(totalPoints)}
                      />
                      <SheetRow
                        label="Quiz complétés"
                        value={String(totalQuizzes)}
                      />
                    </div>
                  )
                }
              />
            </div>

            {/* Catégories */}
            {/* <div className="mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Par catégorie</h3>
              <div className="mt-3 space-y-3">
                {(categoryStats || []).map((cat, idx: number) => {
                  const total = totalQuizzes || 0;
                  const quizCount = cat.quizCount || 0;
                  const avg = cat.averageScore || 0;
                  const percentage = total > 0 ? ((quizCount / total) * 100).toFixed(1) : "0.0";
                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        openInfo(
                          cat.category || "Catégorie",
                          <div className="space-y-2">
                            <SheetRow label="Quiz dans cette catégorie" value={String(quizCount)} />
                            <SheetRow label="Score moyen" value={`${Number(avg).toFixed(1)}%`} />
                          </div>
                        )
                      }
                      className="w-full text-left"
                    >
                      <div className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-800">{cat.category}</div>
                          <div className="text-sm text-blue-600">{percentage}%</div>
                        </div>
                        <div className="mt-2 w-full h-2 bg-gray-100 rounded">
                          <div
                            className="h-2 bg-blue-500 rounded"
                            style={{ width: `${total > 0 ? (quizCount / total) * 100 : 0}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                          <span>{quizCount} quiz</span>
                          <span>moyenne: {Number(avg).toFixed(1)}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div> */}

            {/* Progression par niveau */}
            <div className="mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Progression par niveau
              </h3>
              <div className="mt-3 space-y-3">
                {(
                  [
                    {
                      label: "Débutant",
                      key: "débutant",
                      color: "bg-green-500",
                    },
                    {
                      label: "Intermédiaire",
                      key: "intermédiaire",
                      color: "bg-orange-500",
                    },
                    { label: "Avancé", key: "avancé", color: "bg-red-500" },
                  ] as const
                ).map((lvl) => {
                  const data = (levelProgress[lvl.key] ?? {
                    completed: 0,
                    averageScore: 0,
                  }) as LevelData;
                  const completed =
                    typeof data.completed === "number" && data.completed >= 0
                      ? data.completed
                      : 0;
                  const avg =
                    typeof data.averageScore === "number" &&
                    data.averageScore !== null &&
                    data.averageScore >= 0
                      ? data.averageScore
                      : 0.0;
                  const percentage =
                    totalQuizzes > 0 ? (completed / totalQuizzes) * 100 : 0.0;
                  return (
                    <button
                      key={lvl.key}
                      onClick={() =>
                        openInfo(
                          lvl.label,
                          <div className="space-y-2">
                            <SheetRow label="Niveau" value={lvl.label} />
                            <SheetRow
                              label="Quiz complétés"
                              value={String(completed)}
                            />
                            <SheetRow
                              label="Score moyen"
                              value={`${(avg * 10).toFixed(1)}%`}
                            />
                          </div>
                        )
                      }
                      className="w-full text-left">
                      <div className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-800">
                            {lvl.label}
                          </div>
                          {/* <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div> */}
                        </div>
                        <div className="mt-2 w-full h-2 bg-gray-100 rounded">
                          <div
                            className={`h-2 rounded ${lvl.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                          <span>{completed} quiz complétés</span>
                          <span>Moyenne: {(avg * 10).toFixed(1)}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panneau d'info simple */}
          {infoTitle && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={closeInfo}
              />
              <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                      </svg>
                    </span>
                    <h4 className="font-semibold text-gray-800">{infoTitle}</h4>
                  </div>
                  <button
                    onClick={closeInfo}
                    className="p-1 rounded hover:bg-gray-100">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="text-gray-500">
                      <path
                        fill="currentColor"
                        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  {infoContent}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="p-2 sm:p-3 lg:p-4 rounded-lg shadow-sm">
            <QuizHistory history={quizHistory} loading={loading.history} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsCard({
  icon,
  title,
  value,
  color,
  onClick,
}: {
  icon: "assignment_turned_in" | "star_rate" | "bolt";
  title: string;
  value: string;
  color: "primary" | "amber" | "green";
  onClick?: () => void;
}) {
  const colorMap: Record<string, string> = {
    primary: "text-blue-600 bg-blue-50",
    amber: "text-amber-700 bg-amber-50",
    green: "text-green-700 bg-green-50",
  };
  const iconPath =
    icon === "assignment_turned_in"
      ? "M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
      : icon === "star_rate"
      ? "M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      : "M12 2C8.13 2 5 5.13 5 9c0 3.87 7 13 7 13s7-9.13 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z";
  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition">
      <div className="flex items-center gap-3">
        <span className={`inline-flex p-2 rounded-full ${colorMap[color]}`}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="fill-current">
            <path d={iconPath} />
          </svg>
        </span>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-lg font-semibold text-gray-900">{value}</div>
        </div>
      </div>
      {/* <div className="mt-2 text-xs text-gray-500">Appuyer pour en savoir plus</div> */}
    </button>
  );
}

function SheetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="font-medium text-gray-700">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}
