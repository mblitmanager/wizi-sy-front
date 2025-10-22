import { Layout } from "@/components/layout/Layout";
import { useUser } from "@/hooks/useAuth";
import { Megaphone } from "lucide-react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import axios from "axios"; // déjà importé ailleurs
import { toast } from "@/hooks/use-toast";

import { Contact } from "@/types/contact";
import ContactsSection from "@/components/FeatureHomePage/ContactSection";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import { catalogueFormationApi } from "@/services/api";
import { Card, CardContent, useMediaQuery } from "@mui/material";
import LandingPage from "./LandingPage";
import { DECOUVRIR_NOS_FORMATIONS } from "@/utils/constants";
import { CatalogueFormation } from "@/types/stagiaire";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { StagiaireQuizGrid } from "@/components/quiz/StagiaireQuizGrid";
import { HowToPlay } from "@/components/FeatureHomePage/HowToPlay";

dayjs.extend(utc);
dayjs.extend(timezone);

const API_URL = import.meta.env.VITE_API_URL;

const fetchContacts = async (endpoint: string): Promise<Contact[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, skipping contacts fetch");
      return [];
    }

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

export function Index() {
  // Detect iOS device
  const isIOS =
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(window.navigator.userAgent);
  const { user } = useUser();
  const isOnline = useOnlineStatus();
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [showApkBlock, setShowApkBlock] = useState(true);
  const [hidePresentationBlock, setHidePresentationBlock] = useState(() => {
    return localStorage.getItem("hidePresentationBlock") === "true";
  });
  // Série de connexions (login streak)
  const [loginStreak, setLoginStreak] = useState<number>(() => {
    try {
      const fromUser = user?.stagiaire?.login_streak;
      return typeof fromUser === "number" ? fromUser : 0;
    } catch (e) {
      return 0;
    }
  });

  // === Catalogues formations ===
  const { data: catalogueData = [], isLoading: isLoadingCatalogue } = useQuery({
    queryKey: ["catalogueFormations"],
    queryFn: async () => {
      const response = await catalogueFormationApi.getAllCatalogueFormation();
      if (response && typeof response === "object") {
        if (
          response.data &&
          typeof response.data === "object" &&
          Array.isArray((response.data as any).member)
        ) {
          return (response.data as any).member;
        } else if (Array.isArray((response as any).member)) {
          return (response as any).member;
        } else if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      return [];
    },
    enabled: !!user && !!localStorage.getItem("token"), // ← AJOUT IMPORTANT
    retry: 1, // Éviter les tentatives répétées en cas d'erreur 401
  });

  const [stagiaireCatalogues, setStagiaireCatalogues] = useState<
    CatalogueFormation[]
  >([]);

  useEffect(() => {
    // Ne pas faire l'appel si pas connecté
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
          // Ne pas setter d'état si déconnecté
          return;
        }
        setStagiaireCatalogues([]);
      }
    };

    fetchStagiaireCatalogues();
  }, [user]);

  // Ensure we have the latest login streak: prefer user.stagiaire but fallback to a lightweight profile call
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
      .catch(() => {
        // ignore
      });
  }, [user]);

  // Streak modal: show large blocking modal once per day when user has a login streak
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [hideStreakFor7Days, setHideStreakFor7Days] = useState<boolean>(false);
  useEffect(() => {
    try {
      if (!user || !localStorage.getItem("token")) return;
      const hideUntil = localStorage.getItem("streakModalHideUntil");
      if (hideUntil) {
        const today = dayjs().tz("Europe/Paris");
        const hideDate = dayjs(hideUntil);
        if (today.isBefore(hideDate)) {
          return;
        }
      }
      const today = dayjs().tz("Europe/Paris").format("YYYY-MM-DD");
      const lastShown = localStorage.getItem("lastStreakModalDate");
      // If already shown today, don't show again
      if (lastShown === today) return;
      // Only show if user has a positive streak
      if (typeof loginStreak === "number" && loginStreak > 0) {
        setShowStreakModal(true);
      }
    } catch (e) {
      // ignore localStorage/dayjs errors
    }
  }, [user, loginStreak]);

  const closeStreakModal = () => {
    try {
      const today = dayjs().tz("Europe/Paris").format("YYYY-MM-DD");
      localStorage.setItem("lastStreakModalDate", today);
      if (hideStreakFor7Days) {
        const hideUntil = dayjs()
          .tz("Europe/Paris")
          .add(7, "day")
          .format("YYYY-MM-DD");
        localStorage.setItem("streakModalHideUntil", hideUntil);
      } else {
        localStorage.removeItem("streakModalHideUntil");
      }
    } catch (e) {
      // ignore localStorage errors
    }
    setShowStreakModal(false);
  };

  const filteredFormations = useMemo(() => {
    if (!stagiaireCatalogues.length) return catalogueData;
    const ids = new Set(stagiaireCatalogues.map((f) => f.id));
    return catalogueData.filter((f) => !ids.has(f.id));
  }, [catalogueData, stagiaireCatalogues]);

  // === Récupération des contacts ===
  const { data: commerciaux, isLoading: loadingCommerciaux } = useQuery<
    Contact[]
  >({
    queryKey: ["contacts", "commerciaux"],
    queryFn: () => fetchContacts("commerciaux"),
  });

  const { data: formateurs, isLoading: loadingFormateurs } = useQuery<
    Contact[]
  >({
    queryKey: ["contacts", "formateurs"],
    queryFn: () => fetchContacts("formateurs"),
  });

  const { data: poleRelation, isLoading: loadingPoleRelation } = useQuery<
    Contact[]
  >({
    queryKey: ["contacts", "pole-relation"],
    queryFn: () => fetchContacts("pole-relation"),
  });

  const { data: poleSav, isLoading: loadingPoleSav } = useQuery<Contact[]>({
    queryKey: ["contacts", "pole-save"],
    queryFn: () => fetchContacts("pole-save"),
  });

  // === Quiz stagiaire ===
  const { data: quizzes = [], isLoading: isLoadingQuizzes } = useQuery({
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

  // Récupérer les participations pour filtrer les quiz déjà joués
  // Récupérer l'historique pour filtrer les quiz déjà joués
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

  // Filtrage des quiz à découvrir selon le nombre de points utilisateur
  // Récupérer les points utilisateur depuis le classement global
  const [userPoints, setUserPoints] = useState(0);
  useEffect(() => {
    // Récupérer les points depuis l'API ou le classement global
    // Si vous avez un hook useClassementPoints, utilisez-le ici
    // Sinon, adapter selon votre logique métier
    // Exemple :
    axios
      .get(`${API_URL}/classement/points`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUserPoints(res.data?.points || 0))
      .catch(() => setUserPoints(0));
  }, []);

  const filteredQuizzes = useMemo(() => {
    if (!quizzes.length || !stagiaireCatalogues.length) return [];

    const notPlayedQuizzes = quizzes.filter(
      (q) => !history.some((h) => String(h.quiz?.id) === String(q.id))
    );

    // Get user's formation IDs
    const userFormationIds = new Set(stagiaireCatalogues.map((sc) => sc.id));

    // Group quizzes by formation ID
    const quizzesByFormation = notPlayedQuizzes.reduce((acc, quiz) => {
      const formationId = quiz.formation?.id;
      if (formationId && userFormationIds.has(formationId)) {
        if (!acc[formationId]) {
          acc[formationId] = [];
        }
        acc[formationId].push(quiz);
      }
      return acc;
    }, {} as Record<string, any[]>);

    // Take 2 quizzes from each formation
    const result = Array.from(userFormationIds).flatMap((formationId) => {
      const formationQuizzes = quizzesByFormation[formationId] || [];
      return formationQuizzes.slice(0, 2);
    });

    return result;
  }, [quizzes, history, stagiaireCatalogues]);

  // === Notification automatique à 9h ===
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
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  // === Redirection si non connecté ===
  useEffect(() => {
    // Déclenche le badge première connexion/série de connexions (une fois par jour)
    if (user && localStorage.getItem("token")) {
      try {
        const lastCheck = localStorage.getItem("lastAchievementsCheckDate");
        const today = dayjs().tz("Europe/Paris").format("YYYY-MM-DD");
        // Ne rien faire si on a déjà vérifié aujourd'hui
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
            // On attend un tableau d'achievements débloqués dans res.data.new_achievements
            const unlocked = res.data?.new_achievements || [];
            if (Array.isArray(unlocked) && unlocked.length > 0) {
              unlocked.forEach((ach) => {
                toast({
                  title: `🎉 Succès débloqué`,
                  description: `${ach.name || ach.titre || ach.title || "Achievement"
                    } !`,
                  duration: 4000,
                  variant: "success",
                  className: "bg-orange-600 text-white",
                });
              });
            }
            // Mémoriser la vérification réussie pour aujourd'hui
            localStorage.setItem("lastAchievementsCheckDate", today);
          })
          .catch(() => {
            // En cas d'erreur réseau, on ne marque pas la vérification pour permettre une nouvelle tentative
          });
      } catch (e) {
        // ignore localStorage/dayjs errors
      }
    }
  }, [user]);

  if (!user || !localStorage.getItem("token")) {
    return <LandingPage />;
  }

  return (
    <Layout>
      <div className="px-2 md:px-6">
        {/* Présentation interactive de la plateforme */}
        {!hidePresentationBlock && isTablet && (
          <div
            className="group relative bg-gradient-to-br from-yellow-50 via-white to-orange-50 rounded-xl shadow-lg border border-yellow-200 p-6 pb-16 mb-6 transition-transform duration-300 hover:scale-105 cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label="Découvrir la plateforme Wizi Learn">
            {/* Bouton X pour fermer */}
            <button
              className="absolute top-3 right-3 text-yellow-700 hover:text-yellow-900 text-xl bg-transparent border-none p-0 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setHidePresentationBlock(true);
                localStorage.setItem("hidePresentationBlock", "true");
              }}
              aria-label="Fermer">
              ×
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200 transition-colors">
                <Megaphone size={28} />
              </span>
              <h2 className="text-lg md:text-2xl font-bold text-brown-shade">
                Bienvenue sur Wizi Learn
              </h2>
            </div>
            <p className="text-gray-700 text-base mb-3">
              Wizi Learn est une plateforme d'apprentissage interactive dédiée à
              la montée en compétences.
            </p>
            <button
              className="fixed md:absolute right-6 bottom-6 md:bottom-6 bg-yellow-400 text-white font-semibold px-4 py-2 rounded-lg shadow group-hover:bg-yellow-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                window.open("/manuel", "_blank");
              }}>
              Découvrir la plateforme
            </button>
          </div>
        )}
        {showInstallHint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
            <div className="bg-white border-l-4 border-yellow-400 rounded shadow-xl max-w-md w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900 text-lg"
                onClick={() => setShowInstallHint(false)}
                aria-label="Fermer">
                ×
              </button>
              <h3 className="text-lg font-bold text-yellow-800 mb-2">
                Comment installer l'application Android ?
              </h3>
              <div className="text-sm text-yellow-900">
                <strong>Astuce :</strong> Pour installer l'application, il se
                peut que votre téléphone affiche un message "Installation
                bloquée" ou "Source inconnue".
                <br />
                <span className="font-medium">Voici comment faire :</span>
                <ul className="list-disc pl-5 mt-1 mb-2">
                  <li>Ouvrez le fichier téléchargé (APK).</li>
                  <li>
                    Si un avertissement apparaît, cliquez sur{" "}
                    <span className="font-semibold">Paramètres</span> ou{" "}
                    <span className="font-semibold">Autoriser</span>.
                  </li>
                  <li>
                    Activez l'option{" "}
                    <span className="font-semibold">
                      Autoriser l'installation depuis cette source
                    </span>
                    .
                  </li>
                  <li>Revenez à l'installation et validez.</li>
                </ul>
                <span className="text-xs text-yellow-700">
                  L'application est sûre et ne collecte aucune donnée
                  personnelle en dehors de votre usage sur Wizi Learn.
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Série de connexions - modal affichée une fois par jour */}
        {showStreakModal ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Série de connexions">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex flex-col items-center px-6 py-4 rounded bg-orange-50 border border-orange-100">
                  {/* <span className="text-sm font-medium text-orange-600">7 jours</span> */}
                  <span className="text-5xl font-extrabold text-orange-600">
                    🔥
                  </span>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
                Série de connexions
              </h3>
              <p className="text-lg font-bold text-gray-900 mb-4">
                {loginStreak} jour{loginStreak > 1 ? "s" : ""} d'affilée
              </p>
              {/* <p className="text-sm text-gray-600 mb-4">
                Continuez comme ça pour débloquer des récompenses 🎉
              </p> */}
              <div className="flex items-center justify-center mb-4">
                <input
                  type="checkbox"
                  id="hide-streak"
                  checked={hideStreakFor7Days}
                  onChange={(e) => setHideStreakFor7Days(e.target.checked)}
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="hide-streak"
                  className="ml-2 block text-sm text-gray-900">
                  Ne plus montrer pendant 7 jours
                </label>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                  onClick={closeStreakModal}>
                  Continuer
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 mb-4 flex justify-center"></div>
        )}
        <HowToPlay />
        {isLoadingCatalogue ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-yellow-400 border-solid"></div>
          </div>
        ) : filteredFormations.length > 0 ? (
          <>
            {/* <h1 className="text-2xl md:text-2xl text-orange-400 font-bold mb-4 md:mb-2 text-center mt-4 py-6 relative">
              {DECOUVRIR_NOS_FORMATIONS}
              <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-orange-400 rounded-full"></span>
            </h1> */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
              Boostez vos compétences dès aujourd'hui !
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-2 py-6 md:py-3 bg-white rounded-xl">
              <div className="w-full flex flex-col items-center">
                <AdCatalogueBlock formations={filteredFormations.slice(0, 6)} />
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            Aucune formation disponible.
          </div>
        )}
        {filteredQuizzes.length > 0 && (
          <Card className="border-yellow-100">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-3">
                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                  Quiz à découvrir
                </h2>
              </div>
              <StagiaireQuizGrid
                quizzes={filteredQuizzes}
                categories={Array.from(
                  new Set(
                    filteredQuizzes
                      .map((q) => q.formation?.categorie)
                      .filter(Boolean)
                  )
                )}
              />
            </CardContent>
          </Card>
        )}
        {/* <hr /> */}
        
        <div className="bg-white md:p-4 rounded-lg mt-2">
          <ContactsSection
            commerciaux={commerciaux}
            formateurs={formateurs}
            poleRelation={poleRelation}
            poleSav={poleSav}
            showFormations={false}
          />


        </div>
        
        {/* Bloc téléchargement application Android ou instruction PWA pour iOS */}
        {showApkBlock &&
          (isIOS ? (
            <div
              className="group relative  rounded-xl shadow-lg border border-yellow-500/30 p-6 pb-20 mb-6 transition-transform duration-300 hover:scale-105 cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label="Télécharger l'application iOS sur l'App Store"
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  "https://apps.apple.com/mg/app/wizi-learn/id6752468866",
                  "_blank"
                );
              }}>
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
              <button className="fixed md:absolute right-6 bottom-6 md:bottom-6 bg-yellow-400 text-white font-semibold px-4 py-2 rounded-lg shadow group-hover:bg-orange-700 transition-colors">
                Télécharger
              </button>
            </div>
          ) : (
            <div
              className="group relative rounded-xl shadow-lg border border-orange-500/30 p-6 pb-20 mb-6 transition-transform duration-300 hover:scale-105 cursor-pointer"
              tabIndex={0}
              role="button"
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
              <button
                className="mt-6 text-orange-500 font-medium text-sm cursor-pointer hover:text-orange-400 bg-transparent border-none p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInstallHint(true);
                }}>
                💡 Astuce : Comment installer l'application ?
              </button>
            </div>
          ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <ProgressCard user={user} />
        </div>
      </div>
    </Layout>
  );
}