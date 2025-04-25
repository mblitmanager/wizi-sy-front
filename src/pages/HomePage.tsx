import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Category, UserProgress } from "@/types";
import { quizAPI, progressAPI } from "@/api";
import CategoryCard from "@/components/Home/CategoryCard";
import ProgressCard from "@/components/Home/ProgressCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Contact } from "@/types/contact";
import { ContactCard } from "@/components/Contacts/ContactCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Trophy,
  Users,
  Calendar,
  Bell,
  Play,
  Star,
  Award,
  ChevronRight,
  Book,
  GraduationCap,
  Clock,
  Zap,
} from "lucide-react";
import ParrainageSection from "@/components/Home/ParrainageSection";
import {
  CATALOGUE_FORMATION,
  DETAILS,
  VOS_FORMATION,
} from "@/utils/langue-type";
import { CatalogueFormationResponse } from "@/types/stagiaire";
import { catalogueFormationApi, stagiaireAPI } from "@/services/api";
import CatalogueFormation from "@/components/catalogueFormation/CatalogueFormation";
import LoadingCatalogue from "@/components/catalogueFormation/LoadingCustom";
import LoadingCustom from "@/components/catalogueFormation/LoadingCustom";
import SkeletonCard from "@/components/ui/SkeletonCard";

const API_URL = import.meta.env.VITE_API_URL;
const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_IMG;

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    quizzes_completed: 0,
    total_points: 0,
    average_score: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [catalogueData, setCatalogueData] = useState<
    CatalogueFormationResponse[] | null
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
      // Étape 1 : Récupération des catégories
      try {
        const fetchedCategories = await quizAPI.getCategories();
        // ... gestion des catégories...
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
        const response = await catalogueFormationApi.getAllCatalogueFormation();

        // Vérification du type de 'data' dans la réponse
        if (response && Array.isArray(response.data)) {
          const formations = response.data.slice(0, 3); // Limite à 3 formations
          setCatalogueData(formations);
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

      // Étape 3 : Récupération des progrès utilisateur
      try {
        const progress = await progressAPI.getUserProgress();
        setUserProgress(progress);
      } catch (progressError) {
        console.error(
          "Erreur lors de la récupération des progrès:",
          progressError
        );
        setUserProgress({
          quizzes_completed: 0,
          total_points: 0,
          average_score: 0,
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
      {/* En-tête avec bienvenue et progression */}
      <div className="mb-8">
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
      <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-yellow-400">
            Vos contacts
          </h2>
          <Link to="/contacts">
            <Button className="text-blue-400" variant="ghost" size="sm">
              Voir tous <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {commerciaux?.[0] && <ContactCard contact={commerciaux[0]} />}
          {formateurs?.[0] && <ContactCard contact={formateurs[0]} />}
          {poleRelation?.[0] && <ContactCard contact={poleRelation[0]} />}
        </div>
      </div>

      {/* Section des formations */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-yellow-400">
          {CATALOGUE_FORMATION}
        </h2>
        <Link to="/formations">
          <Button variant="ghost" className="text-blue-400" size="sm">
            Voir tous <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        catalogueData &&
        catalogueData.map((data, index) => (
          <CatalogueFormation key={index} catalogueData={data} />
        ))
      )}

      {/* Section des quiz */}
      <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-yellow-400">
            Quiz disponibles
          </h2>
          <Link to="/quiz">
            <Button className="text-blue-400" variant="ghost" size="sm">
              Voir tous <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {quizLevels.map((level) => (
            <Card key={level.id} className="text-center">
              <CardHeader className="p-4">
                <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {level.icon}
                </div>
                <CardTitle className="text-lg">{level.name}</CardTitle>
                <CardDescription>{level.questions} questions</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">Commencer</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Section des tutoriels */}
      <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-yellow-400">
            Tutoriels et astuces
          </h2>
          <Link to="/tutoriels">
            <Button className="text-blue-400" variant="ghost" size="sm">
              Voir tous <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {tutoriels.map((tutoriel) => (
            <Card key={tutoriel.id} className="overflow-hidden">
              <div className="h-32 bg-muted relative">
                <img
                  src={tutoriel.thumbnail}
                  alt={tutoriel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-black/50 text-white p-1 text-xs">
                  {tutoriel.duration}
                </div>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{tutoriel.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ParrainageSection />
        <Link to="/profile#parrainage" className="block">
          <Card className="h-full hover:bg-accent transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium ">Voir mes filleuls</h3>
                  <p className="text-sm text-muted-foreground">
                    Consultez votre programme de parrainage complet
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Classement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div key={rank} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{rank}.</span>
                    <span>Stagiaire {rank}</span>
                  </div>
                  <span className="text-primary">{1000 - rank * 50} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section de l'agenda */}
      <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-yellow-400">Agenda</h2>
          <Link to="/agenda">
            <Button variant="ghost" size="sm">
              Voir l'agenda complet <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Prochains cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((event) => (
                <div
                  key={event}
                  className="flex items-start p-2 rounded bg-muted/50">
                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Cours de Word</p>
                    <p className="text-xs text-muted-foreground">
                      Aujourd'hui, 14h00 - 16h00
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Formateur: John Doe
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
