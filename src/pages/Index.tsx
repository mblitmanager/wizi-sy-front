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
import backImage from "../assets/back.jpg";
import { motion } from "framer-motion";

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
        <div className="bg-gradient-to-b from-white to-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                className="lg:w-1/2 space-y-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}>
                <motion.h1
                  className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                  variants={slideUp}>
                  Apprenez de façon interactive et ludique
                </motion.h1>

                <motion.p className="text-lg text-gray-700" variants={slideUp}>
                  Bienvenue sur Wizi Learn, la plateforme de quiz éducatifs pour
                  nos stagiaires. Testez vos connaissances, suivez votre
                  progression et développez vos compétences professionnelles.
                </motion.p>

                <motion.div className="flex flex-wrap gap-4" variants={slideUp}>
                  <Button size="lg" asChild>
                    <Link to="/login" className="flex items-center">
                      Commencer maintenant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Connexion</Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="lg:w-1/2 relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}>
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-40"></div>

                <motion.div
                  className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}>
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
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              animate="visible"
              variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-4">
                Nos catégories de formations
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Découvrez notre large éventail de formations pour développer vos
                compétences professionnelles.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}>
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={slideUp}
                  whileHover={{ y: -5 }}>
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gradient-to-br from-gray-50 to-indigo-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              animate="visible"
              variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Une approche simple et efficace pour améliorer vos compétences
                grâce à notre plateforme de quiz.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}>
              {[
                {
                  step: "1",
                  title: "Choisissez un quiz",
                  description:
                    "Sélectionnez parmi nos quiz, suivant votre formation.",
                  color: "indigo",
                },
                {
                  step: "2",
                  title: "Testez vos connaissances",
                  description:
                    "Répondez aux questions dans différents formats: QCM, vrai/faux, remplir les blancs et plus encore.",
                  color: "purple",
                },
                {
                  step: "3",
                  title: "Suivez votre progression",
                  description:
                    "Consultez vos statistiques, comparez vos performances et remportez des défis pour gagner des points.",
                  color: "blue",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                  variants={slideUp}
                  whileHover={{ y: -5 }}>
                  <div
                    className={`w-12 h-12 bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center mb-4`}>
                    <span className="font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Layout>
    );
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
              <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
                Découvrez notre catalogue
              </h2>

              <div
                className="min-h-screen bg-cover bg-no-repeat bg-right flex items-center justify-center px-4 py-12"
                style={{ backgroundImage: `url(${backImage})` }}>
                <div className="max-w-7xl w-full">
                  <AdCatalogueBlock formations={catalogueData} />
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
