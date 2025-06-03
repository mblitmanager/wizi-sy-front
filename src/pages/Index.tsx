import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout } from "@/components/layout/Layout";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PenTool,
  FileText,
  MessageSquare,
  Globe,
  WifiOff,
  Megaphone,
} from "lucide-react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { RankingCard } from "@/components/dashboard/RankingCard";
import { AgendaCard } from "@/components/dashboard/AgendaCard";
import { useQuery } from "@tanstack/react-query";

import { useLoadRankings } from "@/use-case/hooks/profile/useLoadRankings";
import { categories, rankings, agendaEvents } from "@/data/mockData";
import StatsSummary from "@/components/profile/StatsSummary";
import { Contact } from "@/types/contact";
import ContactsSection from "@/components/FeatureHomePage/ContactSection";
import ParrainageSection from "@/components/profile/ParrainageSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import AdvertBanner from "@/components/publiciter/AdvertBanner";
import useAdvert from "@/components/publiciter/useAdvert";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import { catalogueFormationApi } from "@/services/api";
import illustration from "../assets/Information tab-bro.png";
import { motion } from "framer-motion";
import LienParrainage from "@/components/parrainage/LienParainage";
import { Card, CardContent } from "@mui/material";
import LandingPage from "./LandingPage";

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
  // Adapt to paginated response
  return response.data.data; // <-- get the array from .data
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};
export function Index() {
  const { user } = useUser();
  const { userProgress } = useLoadRankings();
  const isOnline = useOnlineStatus();

  // ✅ Récupération du catalogue via React Query
  const {
    data: catalogueData = [],
    isLoading: isLoadingCatalogue,
    isError,
  } = useQuery({
    queryKey: ["catalogueFormations"],
    queryFn: async () => {
      const response = await catalogueFormationApi.getAllCatalogueFormation();
      if (response && typeof response === "object") {
        if (Array.isArray(response.data?.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data?.member)) {
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
  const isLoading = isLoadingCatalogue;
  // Récupération des contacts
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

  const { isVisible, message, closeAdvert } = useAdvert(
    "Je parraine et je gagne 50 € !"
  );

  if (!user) {
    return <LandingPage />;
  }

  // User dashboard
  return (
    <Layout>
      {!isOnline && (
        <Alert variant="destructive" className="mb-4 mx-4 mt-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Vous êtes hors ligne</AlertTitle>
          <AlertDescription>
            Certaines fonctionnalités peuvent être limitées. Les données
            affichées peuvent ne pas être à jour.
          </AlertDescription>
        </Alert>
      )}
      {/* <div className=""> */}
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl sm:text-2xl md:text-3xl text-brown-shade font-bold">
            Tableau de bord
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
                  Partagez et gagnez
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
              Découvrez nos formations
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

        {/* </div> */}

        {/* <h2 className="text-2xl font-semibold mb-4">Défis disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div> */}
        <hr/>
        <div className="bg-white p-3 md:p-4 rounded-lg mt-4">
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
