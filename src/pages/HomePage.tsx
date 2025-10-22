import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { UserProgress } from "@/types/quiz";
import CategoryCard from "@/components/Home/CategoryCard";
import ProgressCard from "@/components/Home/ProgressCard";
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
import { catalogueFormationApi } from "@/services/api";
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

const API_URL = import.meta.env.VITE_API_URL;
const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_MEDIA;

interface LocalCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  colorClass: string;
  quizCount: number;
}

// Temporary mock user object
const user = { stagiaire: { id: "123" } };

const fetchContacts = async (endpoint: string): Promise<Contact[]> => {
  const response = await axios.get<Contact[]>(
    `${API_URL}/stagiaire/contacts/${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    id: "",
    stagiaire_id: "",
    total_points: 0,
    completed_quizzes: 0, // ✅ correct property name
    average_score: 0,
    current_streak: 0,
    longest_streak: 0,
    last_quiz_date: "",
    category_progress: {}, // assuming it's okay to start empty
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [catalogueData, setCatalogueData] = useState<
    CatalogueFormation[] | null
  >(null);

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

  // Données fictives pour les quiz et formations
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

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      //✅ Get categories
      try {
        const fetchedCategories = await quizAPI.getCategories();
      } catch (categoriesError) {
        console.error(
          "Erreur lors de la récupération des catégories:",
          categoriesError
        );
        setError(
          "Impossible de charger les catégories. Veuillez vérifier votre connexion ou réessayer plus tard."
        );
      }

      try {
        const response =
          (await catalogueFormationApi.getAllCatalogueFormation()) as {
            data: { data: CatalogueFormation[] };
          };

        //✅ Vérification du type de 'data' dans la réponse
        if (response && Array.isArray(response.data.data)) {
          const firstThreeFormations = response.data.data.slice(0, 3);
          setCatalogueData(firstThreeFormations);
        } else {
          console.error(
            "Les données récupérées ne sont pas un tableau:",
            response
          );
          setError(
            "Impossible de charger les formations. La structure des données est incorrecte."
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des formations:", error);
        setError(
          "Impossible de charger les formations. Veuillez vérifier votre connexion ou réessayer plus tard."
        );
      }

      //✅ Étape 3 : Récupération des progrès utilisateur
      try {
        const progress = await progressService.getUserProgress();
        setUserProgress(progress);
      } catch (progressError) {
        console.error(
          "Erreur lors de la récupération des progrès:",
          progressError
        );
        setUserProgress({
          id: "",
          stagiaire_id: "",
          total_points: 0,
          completed_quizzes: 0,
          average_score: 0,
          current_streak: 0,
          longest_streak: 0,
          last_quiz_date: "",
          category_progress: {},
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setError(
        "Impossible de charger les données. Veuillez vérifier votre connexion ou réessayer plus tard."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          src="/assets/wizi-learn-logo.png"
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
      <AgendaSection />
    </div>
  );
};

export default HomePage;
