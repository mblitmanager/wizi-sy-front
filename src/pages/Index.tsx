import axios from "axios";
import { Layout } from "@/components/layout/Layout";
import { useUser } from "@/hooks/useAuth";
import { WifiOff, Megaphone } from "lucide-react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

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
  // State pour afficher le hint installation
  const [showInstallHint, setShowInstallHint] = useState(false);

  const { data: catalogueData = [], isLoading: isLoadingCatalogue } = useQuery({
    queryKey: ["catalogueFormations"],
    queryFn: async () => {
      const response = await catalogueFormationApi.getAllCatalogueFormation();
      if (response && typeof response === "object") {
        // @ts-expect-error  type may not have
        if (Array.isArray(response.data?.member)) {
          // @ts-expect-error  type may not have
          return response.data.member;
          // @ts-expect-error  type may not have
        } else if (Array.isArray(response.member)) {
          // @ts-expect-error  type may not have
          return response.member;
        } else if (Array.isArray(response?.data)) {
          return response.data;
        }
      }
      return [];
    },
  });
  const isLoading = isLoadingCatalogue;

  // --- Stagiaire catalogues logic moved from AdCatalogueBlock ---
  const [stagiaireCatalogues, setStagiaireCatalogues] = useState<CatalogueFormation[]>([]);
  useEffect(() => {
    axios.get(`${API_URL}/catalogueFormations/stagiaire`)
      .then(res => {
        setStagiaireCatalogues(res.data.catalogues || []);
      })
      .catch(() => {
        setStagiaireCatalogues([]);
      });
  }, []);

  const filteredFormations = useMemo(() => {
    if (!stagiaireCatalogues.length) return catalogueData;
    const ids = new Set(stagiaireCatalogues.map(f => f.id));
    return catalogueData.filter(f => !ids.has(f.id));
  }, [catalogueData, stagiaireCatalogues]);
  // --- End moved logic ---

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
 

  useEffect(() => {
    // Heure de Paris
    const nowParis = dayjs().tz("Europe/Paris");
    const hour = nowParis.hour();
    const minute = nowParis.minute();

    // Entre 9h00 et 9h10 (évite les doublons si plusieurs refresh)
    if (hour === 9 && minute < 10) {
      fetch(`${API_URL}/api/notify-daily-formation`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
    }
  }, []);
 if (!user ||!localStorage.getItem("token")) {
    return <LandingPage />;
  }
  return (
    <Layout>
      {!isOnline && (
        <Alert variant="destructive" className="mb-4 mx-4 mt-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>{OFFLINE}</AlertTitle>
          <AlertDescription>{INFO_OFFLINE}</AlertDescription>
        </Alert>
      )}
      {/* <div className=""> */}
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl sm:text-2xl md:text-3xl text-brown-shade font-bold">
            {WELCOME}
          </h1>
        </div>
        {/* {isVisible && (
            <AdvertBanner message={message} onClose={closeAdvert} />
          )} */}

        <div className="mt-2 space-y-6 md:space-y-12 mb-3">
          <Card className="border-blue-100">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-3">
                <Megaphone className="h-4 w-4 md:h-5 md:w-5 text-brown-shade mr-2" />
                <h3 className="text-sm md:text-lg font-medium">
                  {LIEN_PARRAINAGE}
                </h3>
              </div>
              <p className="text-xs md:text-base text-gray-700 mb-2 md:mb-3">
                Gagnez <span className="font-bold">50€</span> par ami inscrit
              </p>
              <LienParrainage />
            </CardContent>
          </Card>
          {/* Bloc téléchargement application mobile */}
          <Card className="border-green-100">
            <CardContent className="p-3 md:p-6 flex flex-col items-center">
              <div className="flex items-center mb-2 md:mb-3">
                <img src="https://wizi-learn.com/public/logo192.png" alt="App Icon" className="h-8 w-8 mr-2" />
                <h3 className="text-sm md:text-lg font-medium text-green-700">
                  Télécharger l'application mobile
                </h3>
              </div>
              <p className="text-xs md:text-base text-gray-700 mb-2 md:mb-3 text-center">
                Profitez de toutes les fonctionnalités sur votre smartphone !
              </p>
              <a
                href="https://wizi-learn.com/public/application/wizi-learn.apk"
                download
                className="bg-orange-600 hover:bg-brown-shade text-white font-bold py-2 px-4 rounded shadow"
              >
                Télécharger pour Android
              </a>
              {/* Bouton pour afficher le hint installation */}
              <button
                type="button"
                className="mt-3 text-yellow-900 font-medium text-sm cursor-pointer hover:text-yellow-700 focus:outline-none bg-transparent border-none p-0"
                style={{ background: "none", border: "none", textDecoration: "none" }}
                onClick={() => setShowInstallHint(true)}
              >
                💡 Astuce : Comment installer l'application ?
              </button>
              {/* Modal d'explication installation */}
              {showInstallHint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
                  <div className="bg-white border-l-4 border-yellow-400 rounded shadow-xl max-w-md w-full p-6 relative">
                    <button
                      className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900 text-lg"
                      onClick={() => setShowInstallHint(false)}
                      aria-label="Fermer"
                    >
                      ×
                    </button>
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">Comment installer l'application Android ?</h3>
                    <div className="text-sm text-yellow-900">
                      <strong>Astuce :</strong> Pour installer l'application, il se peut que votre téléphone affiche un message "Installation bloquée" ou "Source inconnue".<br />
                      <span className="font-medium">Voici comment faire :</span>
                      <ul className="list-disc pl-5 mt-1 mb-2">
                        <li>Ouvrez le fichier téléchargé (APK).</li>
                        <li>Si un avertissement apparaît, cliquez sur <span className="font-semibold">Paramètres</span> ou <span className="font-semibold">Autoriser</span>.</li>
                        <li>Activez l'option <span className="font-semibold">Autoriser l'installation depuis cette source</span>.</li>
                        <li>Revenez à l'installation et validez.</li>
                      </ul>
                      <span className="text-xs text-yellow-700">L'application est sûre et ne collecte aucune donnée personnelle en dehors de votre usage sur Wizi Learn.</span>
                    </div>
                  </div>
                </div>
              )}
  {/* // State pour afficher le hint installation
  const [showInstallHint, setShowInstallHint] = useState(false); */}
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          // === Loader visible pendant le chargement ===
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-yellow-400 border-solid"></div>
          </div>
        ) : filteredFormations && filteredFormations.length > 0 ? (
          <>
            <h1 className="text-2xl md:text-2xl text-orange-400 font-bold mb-4 md:mb-2 text-center mt-4 py-6 relative">
              {DECOUVRIR_NOS_FORMATIONS}
              {/* Ligne orange décorative */}
              <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-orange-400 rounded-full"></span>
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-2 py-6 md:py-3 bg-white rounded-xl">
              {/* Colonne illustration */}
              <div className="hidden md:flex md:w-1/3 justify-center mb-4 md:mb-0">
                <img
                  src={illustration}
                  alt="Catalogue Illustration"
                  className="max-w-xs w-full h-auto object-contain"
                />
              </div>
              {/* Colonne catalogue */}
              <div className="w-full flex flex-col items-center border-nonte">
                <div className="w-full">
                  <AdCatalogueBlock formations={filteredFormations.slice(0, 4)} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            Aucune formation disponible.
          </div>
        )}
        <hr />
        <div className="bg-white md:p-4 rounded-lg mt-2">
          {/* Section des contacts */}
          <ContactsSection
            commerciaux={commerciaux}
            formateurs={formateurs}
            poleRelation={poleRelation}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <ProgressCard user={user} />
          {/* <AgendaCard events={agendaEvents} /> */}
          {/* <RankingCard rankings={rankings} currentUserId={user.id} /> */}
        </div>
      </div>
    </Layout>
  );
}
