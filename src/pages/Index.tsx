import { useEffect, useMemo, useState, lazy, Suspense, useCallback, memo } from "react";
import { Layout } from "@/components/layout/Layout";

import { HowToPlay } from "@/components/FeatureHomePage/HowToPlay";
// Lazy load des composants non-critiques
const ContactsSection = lazy(() => import("@/components/FeatureHomePage/ContactSection").then(m => ({ default: m.default })));
const AdCatalogueBlock = lazy(() => import("@/components/FeatureHomePage/AdCatalogueBlock"));

import { ProgressCard } from "@/components/dashboard/ProgressCard";
import FormationCard from "@/components/catalogueFormation/FormationCard";
import { StagiaireQuizGrid } from "@/components/quiz/StagiaireQuizGrid";
import LandingPage from "./LandingPage";

import { useUser } from "@/hooks/useAuth";
import { useStreakModal } from "@/hooks/useStreakModal";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { useResumeQuiz } from "@/hooks/useResumeQuiz";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

import apiClient from "@/lib/api-client";
import axios from "axios";
import EmailSender from "@/components/EmailSender";
import NotificationSender from "@/components/NotificationSender";
import StatsDashboard from "@/components/StatsDashboard";
import OnlineUsersList from "@/components/OnlineUsersList";
import { toast } from "@/hooks/use-toast";
import { getRolePermissions } from "@/utils/rolePermissions";
import NotificationHistory from "@/components/NotificationHistory";

import { categoryService } from "@/services/quiz/CategoryService";
import { catalogueFormationApi } from "@/services/api";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";

import { Contact } from "@/types/contact";
import { CatalogueFormation } from "@/types/stagiaire";
import { Quiz } from "@/types/quiz";

import { DECOUVRIR_NOS_FORMATIONS } from "@/utils/constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useQuizFiltering } from "@/hooks/quiz/useQuizFiltering";
import { WelcomeBanner } from "@/components/FeatureHomePage/WelcomeBanner";
import { StreakModal } from "@/components/FeatureHomePage/StreakModal";
import { ResumeQuizModal } from "@/components/quiz/ResumeQuizModal";
import { ResumeQuizButton } from "@/components/quiz/ResumeQuizButton";

dayjs.extend(utc);
dayjs.extend(timezone);

const API_URL = import.meta.env.VITE_API_URL;

// Runtime-safe helpers
const asRecord = (v: unknown) => (v as Record<string, unknown> | null) ?? null;
const getHistoryQuizId = (h: unknown): string | null => {
  const r = asRecord(h);
  if (!r) return null;
  const quiz = asRecord(r["quiz"]);
  const val = (quiz?.["id"] ?? r["quizId"] ?? r["id"] ?? null) as
    | string
    | number
    | null;
  return val != null ? String(val) : null;
};

const fetchContacts = async (endpoint: string): Promise<Contact[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return [];

    const response = await axios.get(
      `${API_URL}/stagiaire/contacts/${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

// 🔥 Vérification SYNCHRONE immédiate du token
const hasToken = () => {
  return !!localStorage.getItem("token");
};

// import { OptimizedFullScreenLoader } from "@/components/common/OptimizedLoadingState";

function AuthenticatedApp({ user }: { user: NonNullable<typeof user> }) {
  const isOnline = useOnlineStatus();
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(window.navigator.userAgent);

  // Get user role permissions
  const permissions = getRolePermissions(user?.role);
  const navigate = useNavigate();

  // Resume quiz functionality
  const { unfinishedQuiz, dismissQuiz, hideModal, isModalHidden } = useResumeQuiz();

  const handleResumeQuiz = () => {
    if (unfinishedQuiz) {
      navigate(`/quiz/${unfinishedQuiz.quizId}`);
    }
  };

  const handleDismissQuiz = () => {
    if (unfinishedQuiz) {
      dismissQuiz(unfinishedQuiz.quizId);
    }
  };

  // States
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [showApkBlock, setShowApkBlock] = useState(true);
  const [adFormations, setAdFormations] = useState<CatalogueFormation[]>([]);
  const [adLoading, setAdLoading] = useState(false);
  const [hidePresentationBlock, setHidePresentationBlock] = useState(() => {
    return localStorage.getItem("hidePresentationBlock") === "true";
  });
  const [userPoints, setUserPoints] = useState(0);
  const [notPlayedCurrentPage, setNotPlayedCurrentPage] = useState(1);
  const [playedCurrentPage, setPlayedCurrentPage] = useState(1);

  // Login streak
  const [loginStreak, setLoginStreak] = useState<number>(() => {
    try {
      const stagiaire = user?.stagiaire as unknown as
        | Record<string, unknown>
        | undefined;
      const fromUser =
        typeof stagiaire?.["login_streak"] === "number"
          ? (stagiaire["login_streak"] as number)
          : typeof stagiaire?.["loginStreak"] === "number"
            ? (stagiaire["loginStreak"] as number)
            : 0;
      return fromUser;
    } catch (e) {
      return 0;
    }
  });

  // Streak modal
  const {
    showStreakModal,
    hideStreakFor7Days,
    setHideStreakFor7Days,
    closeStreakModal,
  } = useStreakModal(user, loginStreak);

  // Data fetching
  const { data: catalogueData = [], isLoading: isLoadingCatalogue } = useQuery({
    queryKey: ["catalogueFormations"],
    queryFn: async () => {
      const response = await catalogueFormationApi.getAllCatalogueFormation();
      const resp = response as unknown;
      if (Array.isArray(resp)) return resp as CatalogueFormation[];
      if (resp && typeof resp === "object") {
        const respObj = resp as Record<string, unknown>;
        const member = respObj["member"];
        const data = respObj["data"];
        if (Array.isArray(member)) return member as CatalogueFormation[];
        if (Array.isArray(data)) return data as CatalogueFormation[];
      }
      return [] as CatalogueFormation[];
    },
    enabled: !!user && !!localStorage.getItem("token"),
    retry: 1,
  });

  const [stagiaireCatalogues, setStagiaireCatalogues] = useState<
    CatalogueFormation[]
  >([]);

  const { data: commerciaux } = useQuery<Contact[]>({
    queryKey: ["contacts", "commerciaux"],
    queryFn: () => fetchContacts("commerciaux"),
    enabled: !!localStorage.getItem("token"),
  });

  const { data: formateurs } = useQuery<Contact[]>({
    queryKey: ["contacts", "formateurs"],
    queryFn: () => fetchContacts("formateurs"),
    enabled: !!localStorage.getItem("token"),
  });

  const { data: poleRelation } = useQuery<Contact[]>({
    queryKey: ["contacts", "pole-relation"],
    queryFn: () => fetchContacts("pole-relation"),
    enabled: !!localStorage.getItem("token"),
  });

  const { data: poleSav } = useQuery<Contact[]>({
    queryKey: ["contacts", "pole-save"],
    queryFn: () => fetchContacts("pole-save"),
    enabled: !!localStorage.getItem("token"),
  });

  const { data: quizzes = [] } = useQuery<unknown[]>({
    queryKey: ["stagiaire-quizzes-home"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${API_URL}/stagiaire/quizzes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return res.data?.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!localStorage.getItem("token"),
  });

  const { data: history = [] } = useQuery({
    queryKey: ["stagiaire-history-home"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${API_URL}/quiz/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return res.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!localStorage.getItem("token"),
  });

  const { data: participations } = useQuery<unknown[]>({
    queryKey: ["stagiaire-participations"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizJoue(),
    enabled: !!localStorage.getItem("token"),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem("token"),
  });

  // Effects
  useEffect(() => {
    let mounted = true;
    setAdLoading(true);
    apiClient
      .get("/catalogueFormations/formations")
      .then((res) => {
        if (!mounted) return;
        const d = res?.data;
        if (Array.isArray(d)) setAdFormations(d);
        else if (d && Array.isArray(d.data)) setAdFormations(d.data);
        else setAdFormations([]);
      })
      .catch(() => setAdFormations([]))
      .finally(() => setAdLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user || !localStorage.getItem("token")) {
      setStagiaireCatalogues([]);
      return;
    }

    const fetchStagiaireCatalogues = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/catalogueFormations/stagiaire`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStagiaireCatalogues(res.data.catalogues || []);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return;
        }
        setStagiaireCatalogues([]);
      }
    };

    fetchStagiaireCatalogues();
  }, [user]);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    axios
      .get(`${API_URL}/stagiaire/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const val =
          res?.data?.stagiaire?.login_streak ?? res?.data?.login_streak;
        if (typeof val === "number") setLoginStreak(val);
      })
      .catch(() => { });
  }, [user]);

  useEffect(() => {
    axios
      .get(`${API_URL}/classement/points`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUserPoints(res.data?.points || 0))
      .catch(() => setUserPoints(0));
  }, []);

  useEffect(() => {
    const nowParis = dayjs().tz("Europe/Paris");
    const hour = nowParis.hour();
    const minute = nowParis.minute();

    if (hour === 9 && minute < 10) {
      fetch(`${API_URL}/notify-daily-formation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
    }
  }, []);

  useEffect(() => {
    if (user && localStorage.getItem("token")) {
      try {
        const lastCheck = localStorage.getItem("lastAchievementsCheckDate");
        const today = dayjs().tz("Europe/Paris").format("YYYY-MM-DD");
        if (lastCheck === today) return;

        axios
          .post(
            `${API_URL}/stagiaire/achievements/check`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            const unlocked = res.data?.new_achievements || [];
            if (Array.isArray(unlocked) && unlocked.length > 0) {
              unlocked.forEach((ach) => {
                toast({
                  title: `🎉 Succès débloqué`,
                  description: `${ach.name || ach.titre || ach.title || "Achievement"
                    } !`,
                  duration: 4000,
                  variant: "default",
                  className: "bg-orange-600 text-white",
                });
              });
            }
            localStorage.setItem("lastAchievementsCheckDate", today);
          })
          .catch(() => { });
      } catch (e) {
        // ignore errors
      }
    }
  }, [user]);

  // Memoized computations
  const filteredFormations = useMemo(() => {
    if (!stagiaireCatalogues.length) return catalogueData;
    const ids = new Set(
      stagiaireCatalogues.flatMap((f) =>
        f && f.id != null ? [String(f.id)] : []
      )
    );
    return catalogueData.filter((f) => !ids.has(String(f.id)));
  }, [catalogueData, stagiaireCatalogues]);

  const filteredQuizzes = useQuizFiltering(
    quizzes,
    history,
    stagiaireCatalogues
  );

  console.log("Filtered quizzes:", filteredQuizzes);

  const notPlayedQuizzes = useMemo<Quiz[]>(() => {
    if (!quizzes || !participations) return [];
    return filteredQuizzes.filter((q) => {
      const qid = String(q.id ?? q.titre ?? "");
      return !participations.some((p) => {
        const hid = getHistoryQuizId(p);
        return hid ? String(hid) === String(qid) : false;
      });
    });
  }, [filteredQuizzes, quizzes, participations]);

  const quizzesPerPage = 6;
  const notPlayedPaginatedQuizzes = useMemo(() => {
    const startIndex = (notPlayedCurrentPage - 1) * quizzesPerPage;
    return notPlayedQuizzes.slice(startIndex, startIndex + quizzesPerPage);
  }, [notPlayedQuizzes, notPlayedCurrentPage]);

  return (
    <Layout>
      <div className="px-2 md:px-6">
        {/* Bannière de bienvenue */}
        <WelcomeBanner
          onHide={() => {
            setHidePresentationBlock(true);
            localStorage.setItem("hidePresentationBlock", "true");
          }}
        />

        {/* Modal série de connexions */}
        <StreakModal
          isOpen={showStreakModal}
          onClose={closeStreakModal}
          loginStreak={loginStreak}
          hideFor7Days={hideStreakFor7Days}
          onHideFor7DaysChange={setHideStreakFor7Days}
        />

        {/* Modal reprise de quiz - Afficher seulement si modal n'est pas cachée */}
        {/* <ResumeQuizModal
          open={!!unfinishedQuiz && !isModalHidden}
          quizTitle={unfinishedQuiz?.quizTitle || ""}
          questionCount={unfinishedQuiz?.questionIds?.length || 0}
          currentProgress={unfinishedQuiz?.currentIndex || 0}
          onResume={handleResumeQuiz}
          onDismiss={hideModal}
        /> */}

        {/* Comment jouer */}
        <HowToPlay />

        {/* Quiz à découvrir */}
        {/* {filteredQuizzes.length > 0 && (
          <Card className="border-yellow-100">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-3">
                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                  Quiz à découvrir
                </h2>
              </div>
              <StagiaireQuizGrid
                quizzes={notPlayedPaginatedQuizzes}
                categories={categories || []}
              />
            </CardContent>
          </Card>
        )} */}

        {/* Formations */}
        {isLoadingCatalogue ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-yellow-400 border-solid"></div>
          </div>
        ) : filteredFormations.length > 0 ? (
          <Card className="border-yellow-100 mt-6">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-3">
                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                  Boostez vos compétences dès aujourd'hui !
                </h2>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-2 py-6 md:py-3 bg-white rounded-xl">
                <div className="flex-1">
                  <AdCatalogueBlock formations={adFormations.slice(0, 6)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            Aucune formation disponible.
          </div>
        )}

        {/* Contacts */}
        <Card className="bg-white md:p-4 rounded-lg mt-6">
          <CardContent className="p-3 md:p-6">
            <ContactsSection
              commerciaux={commerciaux}
              formateurs={formateurs}
              poleRelation={poleRelation}
              poleSav={poleSav}
              showFormations={false}
            />
          </CardContent>
        </Card>

        {/* Bouton reprise quiz en bas de page si modal ignorée */}
        {unfinishedQuiz && isModalHidden && (
          <ResumeQuizButton
            quizTitle={unfinishedQuiz.quizTitle}
            questionCount={unfinishedQuiz.questionIds?.length || 0}
            currentProgress={unfinishedQuiz.currentIndex || 0}
            onResume={handleResumeQuiz}
            onDismiss={handleDismissQuiz}
          />
        )}

        {/* Téléchargement application */}
        {showApkBlock &&
          (isIOS ? (
            <div
              className="group relative  rounded-xl shadow-lg border border-yellow-500/30 p-6 pb-20 mb-6 transition-transform duration-300 hover:scale-105"
              aria-label="Télécharger l'application iOS sur l'App Store">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-white text-xl bg-transparent border-none p-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowApkBlock(false);
                }}
                aria-label="Fermer">
                ×
              </button>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M20.999 6.999a2 2 0 0 0-1.9-1.3h-1.5a5.3 5.3 0 0 0-9.2 0h-1.5a2 2 0 0 0-1.9 1.3l-2.5 9a2 2 0 0 0 1.9 2.7h16.2a2 2 0 0 0 1.9-2.7l-2.5-9zm-10-2.8a3.3 3.3 0 0 1 6.6 0h-6.6zM12 15.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
                </span>
                <h2 className="text-l md:text-2xl font-bold text-orange-400">
                  Télécharger sur l'App Store
                </h2>
              </div>
              <p className="text-gray-400 text-s mb-3">
                Accédez à Wizi Learn partout grâce à notre application iOS.
              </p>
              <button
                className="fixed md:absolute right-6 bottom-6 md:bottom-6 bg-yellow-400 text-white font-semibold px-4 py-2 rounded-lg shadow group-hover:bg-orange-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    "https://apps.apple.com/mg/app/wizi-learn/id6752468866",
                    "_blank"
                  );
                  if (user && localStorage.getItem("token")) {
                    axios
                      .post(
                        `${API_URL}/stagiaire/achievements/check`,
                        { code: "ios_download" },
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                        }
                      )
                      .then((res) => {
                        const unlocked = res.data?.new_achievements || [];
                        if (Array.isArray(unlocked) && unlocked.length > 0) {
                          unlocked.forEach((ach) => {
                            toast({
                              title: `🎉 Succès débloqué`,
                              description:
                                (ach.name || ach.titre || ach.title || "Achievement") +
                                " !",
                              duration: 4000,
                              variant: "default",
                              className: "bg-orange-600 text-white",
                            });
                          });
                        }
                      })
                      .catch(() => { });
                  }
                }}
              >
                Télécharger
              </button>
            </div>
          ) : (
            <div
              className="group relative rounded-xl shadow-lg border border-orange-500/30 mt-6 p-6 pb-20 mb-6 transition-transform duration-300 hover:scale-105"
              aria-label="Télécharger l'application Android Wizi Learn">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-white text-xl bg-transparent border-none p-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowApkBlock(false);
                }}
                aria-label="Fermer">
                ×
              </button>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16v-8m0 8l-4-4m4 4l4-4m-8 8h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <h2 className="text-l md:text-2xl font-bold text-orange-400">
                  Télécharger l'application Android
                </h2>
              </div>
              <p className="text-gray-400 text-s mb-3">
                Accédez à Wizi Learn partout grâce à notre application Android.
                Cliquez sur le bouton ci-dessous pour télécharger le fichier APK
                et suivez les instructions d'installation.
              </p>
              <button
                className="fixed md:absolute right-6 bottom-6 md:bottom-6 bg-yellow-400 text-white font-semibold px-4 py-2 rounded-lg shadow group-hover:bg-orange-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    "https://www.wizi-learn.com/application/wizi-learn.apk",
                    "_blank"
                  );
                  if (user && localStorage.getItem("token")) {
                    axios
                      .post(
                        `${API_URL}/stagiaire/achievements/check`,
                        { code: "android_download" },
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      )
                      .then((res) => {
                        const unlocked = res.data?.new_achievements || [];
                        if (Array.isArray(unlocked) && unlocked.length > 0) {
                          unlocked.forEach((ach) => {
                            toast({
                              title: `🎉 Succès débloqué`,
                              description:
                                (ach.name ||
                                  ach.titre ||
                                  ach.title ||
                                  "Achievement") + " !",
                              duration: 4000,
                              variant: "default",
                              className: "bg-orange-600 text-white",
                            });
                          });
                        }
                      })
                      .catch(() => { });
                  }
                }}>
                Télécharger
              </button>
            </div>
          ))}

        {/* Progress cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <ProgressCard user={user} />
        </div>
        {/* New Feature Components - Role-based visibility */}
        {permissions.canSendEmails && <EmailSender />}
        {permissions.canSendNotifications && <NotificationSender />}
        {permissions.canViewStats && <StatsDashboard />}
        {permissions.canViewOnlineUsers && <OnlineUsersList />}
        {(permissions.canSendEmails || permissions.canSendNotifications) && <NotificationHistory />}
      </div>
    </Layout>
  );
}

// 🔥 COMPOSANT PRINCIPAL FORCÉ
export function Index() {
  const { user, isLoading } = useUser();

  // 🔥 FORCER le loading si token existe (même pendant le chargement)
  const hasToken = localStorage.getItem("token");

  // 🔥 TOUJOURS afficher le loading si:
  // 1. Chargement en cours OU
  // 2. Token existe mais user pas encore chargé
  // if (isLoading || (hasToken && !user)) {
  //   return <OptimizedFullScreenLoader />;
  // }

  // 🔥 SEULEMENT afficher LandingPage si PAS de token ET user null
  if (!hasToken && !user) {
    return <LandingPage />;
  }

  // 🔥 Rendre l'app authentifiée
  return <AuthenticatedApp user={user!} />;
}
