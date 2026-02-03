import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { UserProgress } from "@/types/quiz";
import CategoryCard from "@/components/dashboard/CategoryCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quizAPI, progressAPI } from "@/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Contact } from "@/types/contact";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Zap } from "lucide-react";
import LienParrainage from "@/components/parrainage/LienParainage";
import {
  ArrowRight,
  PenTool,
  FileText,
  MessageSquare,
  Globe,
  WifiOff,
  Megaphone,
} from "lucide-react";

import {
  CatalogueFormation,
  CatalogueFormationResponse,
} from "@/types/stagiaire";
import { catalogueFormationApi, dashboardApi } from "@/services/api";

import { progressService } from "@/services/progressService";
import ContactSection from "@/components/FeatureHomePage/ContactSection";
import {
  AgendaSection,
  CatalogueFormationSection,
  ClassementSection,
  QuizSection,
  TutorielSection,
} from "@/components/FeatureHomePage";
import { FORMATIONMETADATA } from "@/utils/constants";

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_MEDIA;

const HomePage: React.FC = () => {
  const [catalogueData, setCatalogueData] = useState<
    CatalogueFormation[] | null
  >(null);

  const [userProgress, setUserProgress] = useState<UserProgress>({
    id: "",
    stagiaire_id: "",
    total_points: 0,
    completed_quizzes: 0,
    average_score: 0,
    current_streak: 0,
    longestStreak: 0,
    lastQuizDate: "",
    category_progress: {},
  });

  // Données fictives pour les quiz et formations (mock data)
  const [quizLevels] = useState([
    {
      id: 1,
      name: "Débutant",
      questions: 5,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: 2,
      name: "Intermédiaire",
      questions: 10,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: 3,
      name: "Avancé",
      questions: 15,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: 4,
      name: "Super Quiz",
      questions: 20,
      icon: <Zap className="h-5 w-5" />,
    },
  ]);

  const [tutoriels] = useState([
    {
      id: 1,
      title: "Comment utiliser la plateforme",
      duration: "30s",
      thumbnail: "/images/tuto1.jpg",
    },
    {
      id: 2,
      title: "Astuces pour réussir vos quiz",
      duration: "30s",
      thumbnail: "/images/tuto2.jpg",
    },
    {
      id: 3,
      title: "Système de parrainage",
      duration: "30s",
      thumbnail: "/images/tuto3.jpg",
    },
  ]);

  // ✅ Consolidated Data Query
  const { data: homeData, isLoading, error } = useQuery({
    queryKey: ["home-dashboard"],
    queryFn: async () => {
      const response = await dashboardApi.getHomeData();
      return response.data;
    },
    // Refetch less frequently to save resources
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (homeData) {
      // 1. Set Catalogue Data
      if (homeData.catalogue_formations) {
         setCatalogueData(homeData.catalogue_formations);
      }

      // 2. Set User Progress
      if (homeData.quiz_stats) {
        setUserProgress((prev) => ({
          ...prev,
          id: homeData.user.id,
          stagiaire_id: homeData.user.id,
          total_points: homeData.quiz_stats.total_points,
          completed_quizzes: homeData.quiz_stats.total_quizzes,
          average_score: homeData.quiz_stats.average_score,
          // user info
          prenom: homeData.user.prenom,
          image: homeData.user.image
        }));
      }
    }
  }, [homeData]);

  // Extract contacts from homeData
  const commerciaux = homeData?.contacts?.commerciaux || [];
  const formateurs = homeData?.contacts?.formateurs || [];
  const poleRelation = homeData?.contacts?.pole_relation || [];

  // Loading state handled by useQuery + homeData check

  return (
    <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
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
              <span className="font-bold">50 ${FORMATIONMETADATA.euros}</span>{" "}
              par ami inscrit
            </p>
            <LienParrainage />
          </CardContent>
        </Card>
      </div>
      {/* En-tête avec bienvenue et progression */}
      <div className="mb-8">
        <img
          src="/logons.png"
          alt="Wizi Learn Logo"
          className="w-32 mb-6"
        />
        <h1 className="text-3xl font-bold mb-2">Bienvenue sur Wizi-Learn</h1>
        <p className="text-muted-foreground mb-4">
          Votre plateforme d'apprentissage personnalisée
        </p>

        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Votre progression</h2>
            <Badge variant="outline">Niveau 3</Badge>
          </div>
          <Progress value={65} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            65% complété - 350 points
          </p>
        </div>
      </div>

      {/* Section des contacts */}
      <ContactSection
        commerciaux={commerciaux}
        formateurs={formateurs}
        poleRelation={poleRelation}
        showFormations={false}
      />

      {/* Section des formations */}
      <CatalogueFormationSection
        CATALOGUE_FORMATION="Catalogue des formations"
        catalogueData={catalogueData}
        isLoading={isLoading}
        VITE_API_URL_IMG={import.meta.env.VITE_API_URL_MEDIA} // Utilise l'URL de ton environnement
      />

      {/* Section des quiz */}
      <QuizSection quizLevels={quizLevels} />

      {/* Section des tutoriels */}

      <TutorielSection tutoriels={tutoriels} />

      {/* Section Filleuls */}
      <ClassementSection />

      {/* Section de l'agenda */}
      {/* <AgendaSection /> */}
    </div>
  );
};

export default HomePage;
