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
import AdvertBanner from "@/components/publiciter/AdvertBanner";
import useAdvert from "@/components/publiciter/useAdvert";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import { catalogueFormationApi } from "@/services/api";
import backImage from "../assets/back.jpg";

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
export function Index() {
  const { user } = useUser();
  const { userProgress } = useLoadRankings();
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
  const { isVisible, message, closeAdvert } = useAdvert(
    "Je parraine et je gagne 50 € !"
  );
  const { data: poleRelation, isLoading: loadingPoleRelation } = useQuery<
    Contact[]
  >({
    queryKey: ["contacts", "pole-relation"],
    queryFn: () => fetchContacts("pole-relation"),
  });

  const [catalogueData, setCatalogueData] = useState([]);

  useEffect(() => {
    catalogueFormationApi.getAllCatalogueFormation().then((response) => {
      console.log("Réponse brute catalogueFormationApi:", response);
      let formations = [];
      // Vérifie la structure de la réponse
      if (response && typeof response === "object") {
        if (Array.isArray(response.data?.data)) {
          formations = response.data.data;
        } else if (Array.isArray(response.data?.member)) {
          formations = response.data.member;
        } else if (Array.isArray(response.member)) {
          formations = response.member;
        } else if (Array.isArray(response?.data)) {
          formations = response.data;
        }
      }
      setCatalogueData(formations);
    });
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className="bg-gradient-to-b from-white to-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold font-astria leading-tight">
                  Apprenez de façon interactive et ludique
                </h1>
                <p className="text-lg text-gray-600">
                  Bienvenue sur Wizi Learn, la plateforme de quiz éducatifs pour
                  nos stagiaires. Testez vos connaissances, suivez votre
                  progression et développez vos compétences professionnelles.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/login">
                      Commencer maintenant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Connexion</Link>
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-64 h-64 bg-bureautique/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-creation/20 rounded-full blur-3xl"></div>
                  <div className="relative bg-white p-6 rounded-xl shadow-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-bureautique/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-bureautique text-white p-2 rounded-md">
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Bureautique</span>
                      </div>
                      <div className="bg-langues/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-langues text-white p-2 rounded-md">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Langues</span>
                      </div>
                      <div className="bg-internet/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-internet text-black p-2 rounded-md">
                          <Globe className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Internet</span>
                      </div>
                      <div className="bg-creation/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-creation text-white p-2 rounded-md">
                          <PenTool className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Création</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Nos catégories de formations
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Découvrez notre large éventail de formations pour développer vos
                compétences professionnelles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Une approche simple et efficace pour améliorer vos compétences
                grâce à notre plateforme de quiz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-bureautique/10 text-bureautique rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Choisissez un quiz
                </h3>
                <p className="text-gray-600">
                  Sélectionnez parmi nos quiz, suivant votre formation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-langues/10 text-langues rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Testez vos connaissances
                </h3>
                <p className="text-gray-600">
                  Répondez aux questions dans différents formats: QCM,
                  vrai/faux, remplir les blancs et plus encore.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-creation/10 text-creation rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Suivez votre progression
                </h3>
                <p className="text-gray-600">
                  Consultez vos statistiques, comparez vos performances et
                  remportez des défis pour gagner des points.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // User dashboard
  return (
    <Layout>
      <div className="mt-2 h-[calc(100vh-8rem)] overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl text-blue-custom-100 font-bold mb-8">
              Tableau de bord
            </h1>
            <Button asChild>
              <Link to="/catalogue">
                Voir le catalogue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isVisible && (
            <AdvertBanner message={message} onClose={closeAdvert} />
          )}

          <div className="mt-2 space-y-12">
            <ParrainageSection />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {/* Section des contacts */}
            <ContactsSection
              commerciaux={commerciaux}
              formateurs={formateurs}
              poleRelation={poleRelation}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ProgressCard user={user} />
            <AgendaCard events={agendaEvents} />
            {/* <RankingCard rankings={rankings} currentUserId={user.id} /> */}
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> */}
          {catalogueData && catalogueData.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                Découvrez notre catalogue
              </h2>
              <AdCatalogueBlock formations={catalogueData} />

              <div
                className="h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backImage})` }}>
                <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                  <h1 className="text-white text-3xl font-bold">Bienvenue !</h1>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-full text-center text-muted-foreground"></div>
          )}
          {/* </div> */}

          {/* <h2 className="text-2xl font-semibold mb-4">Défis disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div> */}
        </div>
      </div>
    </Layout>
  );
}
