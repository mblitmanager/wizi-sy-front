import axios from "axios";
import { Layout } from "@/components/layout/Layout";
import { useUser } from "@/context/UserContext";
import { WifiOff, Megaphone } from "lucide-react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";

import { useQuery } from "@tanstack/react-query";

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
  DECOUVRIR_NOUS,
  INFO_OFFLINE,
  LIEN_PARRAINAGE,
  OFFLINE,
  WELCOME,
} from "@/utils/constants";
import { CatalogueFormation } from "@/types/stagiaire";

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
  if (!user) {
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
        </div>

        {isLoading ? (
          // === Loader visible pendant le chargement ===
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-yellow-400 border-solid"></div>
          </div>
        ) : catalogueData && catalogueData.length > 0 ? (
          <>
            <h1 className="text-2xl md:text-2xl text-orange-400 font-bold mb-4 md:mb-8 text-center mt-4 py-12">
              {DECOUVRIR_NOUS}
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-2 py-6 md:py-12 bg-white rounded-xl mt-[-5%]">
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
                  <AdCatalogueBlock formations={catalogueData.slice(0, 4)} />
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
        <div className="bg-white p-3 md:p-4 rounded-lg mt-4">
          {/* Section des contacts */}
          <ContactsSection />
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
