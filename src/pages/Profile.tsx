import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import StatsSummary from "@/components/profile/StatsSummary";
import FormationCatalogue from "@/components/profile/FormationCatalogue";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLoadProfile } from "@/use-case/hooks/profile/useLoadProfile";
import { useLoadQuizData } from "@/use-case/hooks/profile/useLoadQuizData";
import { useLoadRankings } from "@/use-case/hooks/profile/useLoadRankings";
import { useLoadFormations } from "@/use-case/hooks/profile/useLoadFormations";
import { RecentResults } from "@/components/profile/RecentResults";
import CategoryProgress from "@/components/profile/CategoryProgress";
import UserStats from "@/components/profile/UserStats";
import type { QuizHistory as QuizHistoryType, QuizResult } from "@/types/quiz";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useUser } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import ContactSection from "@/components/FeatureHomePage/ContactSection";
import type { Contact } from "@/types/contact";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import apiClient from "@/lib/api-client";
import type { CatalogueFormation } from "@/types/stagiaire";
import VideoUploader from "@/components/common/VideoUploader";
import FormateurService from "@/services/FormateurService";

const API_URL = import.meta.env.VITE_API_URL as string;

type Achievement = {
  id: number;
  name: string;
  type: string;
  description?: string | null;
  icon?: string | null;
  level?: string | null;
  quiz_id?: number | null;
  code?: string | null;
  unlockedAt?: string | null;
};

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab] = useState(activeTabFromUrl);
  const { toast } = useToast();

  const { user } = useUser();
  const isTrainer = user?.role === "formateur" || user?.role === "formatrice";

  const { results, categories } = useLoadQuizData();
  const { userProgress, rankings } = useLoadRankings();
  const formations = useLoadFormations(user?.stagiaire?.id ?? null);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryType[]>([]);

  // Contacts (comme HomePage)
  const fetchContacts = async (endpoint: string): Promise<Contact[]> => {
    const response = await axios.get<Contact[]>(
      `${API_URL}/stagiaire/contacts/${endpoint}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  };
  const { data: commerciaux } = useQuery<Contact[]>({
    queryKey: ["contacts", "commerciaux"],
    queryFn: () => fetchContacts("commerciaux"),
    enabled: !!user && !isTrainer,
  });
  const { data: formateurs } = useQuery<Contact[]>({
    queryKey: ["contacts", "formateurs"],
    queryFn: () => fetchContacts("formateurs"),
    enabled: !!user && !isTrainer,
  });
  const { data: poleRelation } = useQuery<Contact[]>({
    queryKey: ["contacts", "pole-relation"],
    queryFn: () => fetchContacts("pole-relation"),
    enabled: !!user && !isTrainer,
  });

  const { data: trainees } = useQuery<Contact[]>({
    queryKey: ["contacts", "trainees"],
    queryFn: () => FormateurService.getTraineesAsContacts(),
    enabled: !!user && isTrainer,
  });

  // Achievements state
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [achvLoading, setAchvLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const isLoading = !user || !categories || !userProgress || !formations;

  // Mémoïsation des composants enfants pour éviter des rendus inutiles
  const MemoizedProfileHeader = useMemo(() => {
    return (
      <ProfileHeader
        user={user}
        userProgress={userProgress}
        achievements={userAchievements}
        achievementsLoading={achvLoading}
      />
    );
  }, [user, userProgress, userAchievements, achvLoading]);

  const MemoizedUserStats = useMemo(() => {
    return (
      <UserStats
        user={user}
        userProgress={userProgress}
        achievements={userAchievements}
      />
    );
  }, [user, userProgress, userAchievements]);

  const MemoizedCategoryProgress = useMemo(() => {
    return (
      <CategoryProgress categories={categories} userProgress={userProgress} />
    );
  }, [categories, userProgress]);

  // Adapter l’historique vers QuizResult pour RecentResults
  const recentResultsData: QuizResult[] = useMemo(() => {
    return (quizHistory || []).slice(0, 10).map((h) => {
      let quizTitle = "Quiz";
      const q: unknown = (
        h as unknown as { quiz?: { titre?: string; title?: string } }
      ).quiz;
      if (q && typeof q === "object") {
        const maybe = q as { titre?: string; title?: string };
        quizTitle = maybe.titre || maybe.title || "Quiz";
      }
      return {
        id: h.id,
        score: h.score,
        totalPoints: h.score,
        quizTitle,
        correctAnswers: h.correctAnswers,
        totalQuestions: h.totalQuestions,
        timeSpent: h.timeSpent,
        questions: [],
      };
    });
  }, [quizHistory]);

  const MemoizedRecentResults = useMemo(() => {
    return (
      <RecentResults
        results={recentResultsData}
        isLoading={isLoading}
        showAll={false}
      />
    );
  }, [recentResultsData, isLoading]);

  // Fetch catalogue formations for ad block
  const [adFormations, setAdFormations] = useState<CatalogueFormation[]>([]);
  const [adLoading, setAdLoading] = useState<boolean>(false);
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

  // Chargement asynchrone de l'historique des quiz
  useEffect(() => {
    if (!user) return; // Ne pas charger si l'utilisateur n'est pas disponible

    const fetchQuizHistory = async () => {
      try {
        const history = await quizSubmissionService.getQuizHistory();
        setQuizHistory(history);
      } catch (error) {
        console.error("Error fetching quiz history:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des quiz",
          variant: "destructive",
        });
      }
    };

    fetchQuizHistory();
  }, [user, toast]);

  // Chargement des achievements (tous + utilisateur)
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user || isTrainer) {
        setAchvLoading(false);
        return;
      }
      setAchvLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        // Badges utilisateur (principal)
        const userResp = await axios.get(`${API_URL}/stagiaire/achievements`, {
          headers,
        });
        const mine: Achievement[] =
          userResp.data?.achievements || userResp.data || [];
        setUserAchievements(mine);

        // Tous les badges (facultatif, peut échouer selon droits)
        try {
          const allResp = await axios.get(`${API_URL}/admin/achievements`, {
            headers,
          });
          const all: Achievement[] =
            allResp.data?.achievements || allResp.data || [];
          setAllAchievements(all);
        } catch (e) {
          // On ignore silencieusement si l’endpoint admin n’est pas accessible
          setAllAchievements([]);
        }
      } catch (e) {
        console.error("Error loading achievements", e);
        setAllAchievements([]);
        setUserAchievements([]);
        toast({
          title: "Erreur",
          description: "Impossible de charger les badges",
          variant: "destructive",
        });
      } finally {
        setAchvLoading(false);
      }
    };
    fetchAchievements();
  }, [user, toast, isTrainer]);

  // Re-synchronisation manuelle des achievements
  const handleResyncAchievements = async () => {
    if (!user) return;
    setAchvLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const res = await axios.post(
        `${API_URL}/stagiaire/achievements/check`,
        {},
        { headers }
      );
      const newCount = Array.isArray(res.data?.new_achievements)
        ? res.data.new_achievements.length
        : 0;

      // Recharge la liste utilisateur
      const userResp = await axios.get(`${API_URL}/stagiaire/achievements`, {
        headers,
      });
      const mine: Achievement[] =
        userResp.data?.achievements || userResp.data || [];
      setUserAchievements(mine);

      toast({
        title: "Synchronisation terminée",
        description:
          newCount > 0
            ? `${newCount} nouveau(x) badge(s) débloqué(s)`
            : "Aucun nouveau badge",
      });
    } catch (e) {
      console.error("Resync achievements error", e);
      toast({
        title: "Erreur",
        description: "La synchronisation a échoué",
        variant: "destructive",
      });
    } finally {
      setAchvLoading(false);
    }
  };

  const unlockedIds = useMemo(
    () => new Set(userAchievements.map((a) => a.id)),
    [userAchievements]
  );
  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    allAchievements.forEach((a) => {
      if ((a.type || "").trim()) set.add(a.type);
    });
    return Array.from(set).sort();
  }, [allAchievements]);

  const filteredAchievements = useMemo(() => {
    const source = selectedType
      ? allAchievements.filter((a) => a.type === selectedType)
      : allAchievements.slice();
    source.sort((a, b) => {
      const au = unlockedIds.has(a.id);
      const bu = unlockedIds.has(b.id);
      if (au !== bu) return au ? -1 : 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    return source;
  }, [allAchievements, selectedType, unlockedIds]);

  const AchievementBadge = ({
    a,
    unlocked,
  }: {
    a: Achievement;
    unlocked: boolean;
  }) => {
    return (
      <div
        className={`p-3 rounded-xl border shadow-sm flex flex-col items-center text-center transition ${
          unlocked ? "bg-white" : "bg-gray-50 opacity-70"
        }
        `}
        style={!unlocked ? { filter: "grayscale(100%)" } : undefined}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 mb-2">
          {/* Fallback icon rendering */}
          <span className="text-lg">🏅</span>
        </div>
        <div className="text-sm font-semibold line-clamp-2">{a.name}</div>
        {a.level ? (
          <div className="text-xs text-gray-500 mt-1">{a.level}</div>
        ) : null}
      </div>
    );
  };

  const AchievementsSection = () => {
    const [showAllBadges, setShowAllBadges] = useState(false);
    const visibleBadges = showAllBadges
      ? filteredAchievements
      : filteredAchievements.slice(0, 3);

    return (
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
        {/* <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-semibold font-montserrat dark:text-white">
            Mes badges
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {userAchievements.length} débloqués
            </div>
          </div>
        </div> */}

        {/* {achvLoading ? (
          <div className="py-6 text-center text-sm text-gray-500">
            Chargement des badges...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {visibleBadges.map((a) => (
                <AchievementBadge
                  key={a.id}
                  a={a}
                  unlocked={unlockedIds.has(a.id)}
                />
              ))}
            </div>
            {filteredAchievements.length > 3 && (
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setShowAllBadges((v) => !v)}>
                  {showAllBadges ? "Voir moins" : "Voir plus"}
                </button>
              </div>
            )}
          </>
        )} */}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-5">
          {/* Squelette de chargement optimisé */}
          <div className="flex items-center space-x-4 mt-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((key) => (
              <div
                key={key}
                className="p-4 bg-white rounded-2xl shadow space-y-2 animate-pulse">
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-6 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 space-y-3 bg-white rounded-2xl shadow animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((key) => (
                <div key={key} className="h-5 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="p-4 bg-white rounded-2xl shadow">
              <div className="w-full aspect-video bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4">
          <div className="flex flex-col items-center lg:flex-row">
            {/* Partie principale - Utilisation des composants mémoïsés */}
            <div className="w-full mt-6 p-6 lg:w-2/4 lg:order-2 lg:mt-0">
              {MemoizedProfileHeader}
            </div>

            {/* Sidebar stats - Hidden for Formateurs */}
            {user?.role !== 'formateur' && user?.role !== 'formatrice' && (
              <div className="dark:bg-gray-700 p-6 lg:w-2/4 lg:order-1">
                {MemoizedUserStats}
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal avec composants mémoïsés */}
        <div className="space-y-4 px-2 sm:px-0">
          
          {/* Badges - Hidden for Formateurs */}
          {user?.role !== 'formateur' && user?.role !== 'formatrice' && <AchievementsSection />}

          {(user?.is_admin || user?.role === "admin") && (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
                Uploader une vidéo
              </h3>
              <VideoUploader
                apiBase={API_URL}
                onUploaded={(m) => console.log("uploaded", m)}
              />
            </div>
          )}
        </div>

        {/* Section contacts (comme HomePage) */}
        <ContactSection
          commerciaux={commerciaux}
          formateurs={formateurs}
          poleRelation={poleRelation}
          contacts={trainees}
          title={isTrainer ? "Mes Apprenants" : undefined}
          showFormations={true}
        />

        {/* Ad catalogue block - Hidden for Formateurs */}
        {!adLoading && adFormations.length > 0 && user?.role !== 'formateur' && user?.role !== 'formatrice' && (
          <div className="mt-6">
            <AdCatalogueBlock formations={adFormations.slice(0, 4)} />
          </div>
        )}
      </div>
      {/* Section liens vers FAQ, CGV et Manuel */}
      {/* <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm mb-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 font-montserrat dark:text-white">
          Ressources utiles
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/faq"
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition">
            FAQ
          </Link>
          <Link
            to="/cgv"
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition">
            CGV
          </Link>
          <Link
            to="/contact-support"
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition">
            Contact & Remarques
          </Link>
          <Link
            to="/manuel"
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition">
            Manuel d'utilisation
          </Link>
          <Link
            to="/remerciements"
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition">
            Remerciements
          </Link>

          <Link
            to="/politique-confidentialite"
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium hover:bg-amber-200 transition">
            Politique de Confidentialité
          </Link>
        </div>
      </div> */}
    </Layout>
  );
};
export default ProfilePage;
