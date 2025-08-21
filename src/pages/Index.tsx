// import axios from "axios"; // supprimé car déjà importé ailleurs
import { Layout } from "@/components/layout/Layout";
import { useUser } from "@/hooks/useAuth";
import { WifiOff, Megaphone } from "lucide-react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import axios from "axios"; // déjà importé ailleurs
import { toast } from "@/hooks/use-toast";

import { Contact } from "@/types/contact";
import ContactsSection from "@/components/FeatureHomePage/ContactSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import { catalogueFormationApi } from "@/services/api";
import illustration from "../assets/Information tab-bro.png";
import LienParrainage from "@/components/parrainage/LienParainage";
import { Card, CardContent } from "@mui/material";
import LandingPage from "./LandingPage";
import {
  DECOUVRIR_NOS_FORMATIONS,
  DECOUVRIR_NOUS,
  INFO_OFFLINE,
  LIEN_PARRAINAGE,
  OFFLINE,
  WELCOME,
} from "@/utils/constants";
import { CatalogueFormation } from "@/types/stagiaire";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { StagiaireQuizGrid } from "@/components/quiz/StagiaireQuizGrid";

dayjs.extend(utc);
dayjs.extend(timezone);

const API_URL = import.meta.env.VITE_API_URL;

const fetchContacts = async (endpoint: string): Promise<Contact[]> => {
  const response = await axios.get(
    `${API_URL}/stagiaire/contacts/${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.data;
};

export function Index() {
  const { user } = useUser();
  const isOnline = useOnlineStatus();
  const [showInstallHint, setShowInstallHint] = useState(false);
  const [showApkBlock, setShowApkBlock] = useState(true);
  const [hidePresentationBlock, setHidePresentationBlock] = useState(() => {
    return localStorage.getItem("hidePresentationBlock") === "true";
  });

  // === Catalogues formations ===
  const { data: catalogueData = [], isLoading: isLoadingCatalogue } = useQuery({
    queryKey: ["catalogueFormations"],
    queryFn: async () => {
      const response = await catalogueFormationApi.getAllCatalogueFormation();
      if (response && typeof response === "object") {
        // @ts-expect-error
        if (Array.isArray(response.data?.member)) {
          return response.data.member;
        } else if (Array.isArray(response.member)) {
          return response.member;
        } else if (Array.isArray(response?.data)) {
          return response.data;
        }
      }
      return [];
    },
  });

  const [stagiaireCatalogues, setStagiaireCatalogues] = useState<
    CatalogueFormation[]
  >([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/catalogueFormations/stagiaire`)
      .then((res) => setStagiaireCatalogues(res.data.catalogues || []))
      .catch(() => setStagiaireCatalogues([]));
  }, []);

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
  const { data: participations = [] } = useQuery({
    queryKey: ["stagiaire-participations-home"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${API_URL}/stagiaire/quiz-joue`, {
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

  // Filtrage avancé selon les points utilisateur (pour les quiz à jouer)
  const filteredQuizzes = useMemo(() => {
    if (!quizzes.length) return [];
    // 1. Séparer les quiz par niveau
    const debutant = quizzes.filter(
      (q) => q.niveau?.toLowerCase() === "débutant"
    );
    const inter = quizzes.filter(
      (q) => q.niveau?.toLowerCase() === "intermédiaire"
    );
    const avance = quizzes.filter((q) => q.niveau?.toLowerCase() === "avancé");
    let result = [];
    let inter1 = [];
    let avance1 = [];
    let avance2 = [];
    // if (userPoints < 10) {
    //   // Montrer 1 ou 2 quiz débutant max
    //   result = debutant.slice(0, 2);
    // } else
    if (userPoints < 20) {
      // Montrer tous les quiz débutant
      result = debutant.slice(0, 3);
    } else if (userPoints < 40) {
      // Débutant + intermédiaire (2 quiz intermédiaire max)
      inter1 = inter.slice(0, 2);
      result = [...debutant, ...inter1];
    } else if (userPoints < 50) {
      // Débutant + tous les intermédiaires
      result = [...debutant, ...inter];
    } else if (userPoints < 80) {
      // Débutant + tous les intermédiaires + 2 quiz avancé
      avance1 = avance.slice(0, 2);
      result = [...debutant, ...inter, ...avance1];
    } else if (userPoints < 100) {
      // Débutant + intermédiaire + 4 quiz avancé
      avance2 = avance.slice(0, 4);
      result = [...debutant, ...inter, ...avance2];
    } else {
      // Tous les quiz
      result = [...debutant, ...inter, ...avance];
    }
    // Filtrer les quiz non joués
    const notPlayed = result.filter(
      (q) =>
        !participations.some((p) => String(p.quizId || p.id) === String(q.id))
    );
    return notPlayed;
  }, [quizzes, participations, userPoints]);

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

  // === Redirection si non connecté ===
  useEffect(() => {
    // Déclenche le badge première connexion/série de connexions
    if (user && localStorage.getItem("token")) {
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
                description: `${
                  ach.name || ach.titre || ach.title || "Achievement"
                } !`,
                duration: 4000,
                variant: "success",
                className: "bg-orange-600 text-white",
              });
            });
          }
        })
        .catch(() => {});
    }
  }, [user]);

  if (!user || !localStorage.getItem("token")) {
    return <LandingPage />;
  }

  return (
    <Layout>
      <div className="px-2 md:px-6">
        {/* Présentation interactive de la plateforme */}
        {!hidePresentationBlock && (
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
        {isLoadingCatalogue ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-yellow-400 border-solid"></div>
          </div>
        ) : filteredFormations.length > 0 ? (
          <>
            <h1 className="text-2xl md:text-2xl text-orange-400 font-bold mb-4 md:mb-2 text-center mt-4 py-6 relative">
              {DECOUVRIR_NOS_FORMATIONS}
              <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-orange-400 rounded-full"></span>
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-2 py-6 md:py-3 bg-white rounded-xl">
              <div className="hidden lg:flex md:w-1/3 justify-center mb-4 md:mb-0">
                <img
                  src={illustration}
                  alt="Catalogue Illustration"
                  className="max-w-xs w-full h-auto object-contain"
                />
              </div>
              <div className="w-full flex flex-col items-center">
                <AdCatalogueBlock formations={filteredFormations.slice(0, 4)} />
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
                <h2 className="text-lg md:text-2xl font-bold text-orange-400 mb-2">
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
        <hr />
        <div className="bg-white md:p-4 rounded-lg mt-2">
          <ContactsSection
            commerciaux={commerciaux}
            formateurs={formateurs}
            poleRelation={poleRelation}
          />
        </div>
        {/* Bloc téléchargement application Android */}
        {showApkBlock && (
          <div
            className="group relative bg-gradient-to-br from-brown-50 via-white to-yellow-50 rounded-xl shadow-lg border border-brown-200 p-6 pb-20 mb-6 transition-transform duration-300 hover:scale-105 cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label="Télécharger l'application Android Wizi Learn"
            // onClick={() => window.open('https://www.wizi-learn.com/application/wizi-learn.apk', '_blank')}
          >
            {/* Bouton X pour fermer */}
            <button
              className="absolute top-3 right-3 text-green-700 hover:text-green-900 text-xl bg-transparent border-none p-0 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setShowApkBlock(false);
              }}
              aria-label="Fermer">
              ×
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-brown-shade group-hover:bg-brown-yellow-100 transition-colors">
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
              <h2 className="text-l md:text-2xl font-bold text-brown-shade">
                Télécharger l'application Android
              </h2>
            </div>
            <p className="text-gray-700 text-s mb-3">
              Accédez à Wizi Learn partout grâce à notre application Android.
              Cliquez sur le bouton ci-dessous pour télécharger le fichier APK
              et suivez les instructions d'installation.
            </p>
            <button
              className="fixed md:absolute right-6 bottom-6 md:bottom-6 bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg shadow group-hover:bg-yellow-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  "https://www.wizi-learn.com/application/wizi-learn.apk",
                  "_blank"
                );
                // Déclencher l'achievement côté backend
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
                            description: `${
                              ach.name ||
                              ach.titre ||
                              ach.title ||
                              "Achievement"
                            } !`,
                            duration: 4000,
                            variant: "success",
                            className: "bg-orange-600 text-white",
                          });
                        });
                      }
                    })
                    .catch(() => {});
                }
              }}>
              Télécharger
            </button>
            <button
              className="mt-6 text-yellow-900 font-medium text-sm cursor-pointer hover:text-yellow-700 bg-transparent border-none p-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowInstallHint(true);
              }}>
              💡 Astuce : Comment installer l'application ?
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <ProgressCard user={user} />
        </div>
      </div>
    </Layout>
  );
}
