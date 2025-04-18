import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, UserProgress } from '@/types';
import { quizService, progressService } from '@/services/api';
import CategoryCard from '@/components/Home/CategoryCard';
import ProgressCard from '@/components/Home/ProgressCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Contact } from "@/types/contact";
import { ContactCard } from "@/components/Contacts/ContactCard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Zap
} from "lucide-react";
import ParrainageSection from '@/components/Home/ParrainageSection';

const API_URL = import.meta.env.VITE_API_URL;

const fetchContacts = async (endpoint: string): Promise<Contact[]> => {
  const response = await axios.get<Contact[]>(`${API_URL}/stagiaire/contacts/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  return response.data;
};

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    quizzes_completed: 0,
    total_points: 0,
    average_score: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération des contacts
  const { data: commerciaux, isLoading: loadingCommerciaux } = useQuery<Contact[]>({
    queryKey: ['contacts', 'commerciaux'],
    queryFn: () => fetchContacts('commerciaux'),
  });

  const { data: formateurs, isLoading: loadingFormateurs } = useQuery<Contact[]>({
    queryKey: ['contacts', 'formateurs'],
    queryFn: () => fetchContacts('formateurs'),
  });

  const { data: poleRelation, isLoading: loadingPoleRelation } = useQuery<Contact[]>({
    queryKey: ['contacts', 'pole-relation'],
    queryFn: () => fetchContacts('pole-relation'),
  });

  // Données fictives pour les quiz et formations
  const [quizLevels] = useState([
    { id: 1, name: "Débutant", questions: 5, icon: <BookOpen className="h-5 w-5" /> },
    { id: 2, name: "Intermédiaire", questions: 10, icon: <BookOpen className="h-5 w-5" /> },
    { id: 3, name: "Avancé", questions: 15, icon: <BookOpen className="h-5 w-5" /> },
    { id: 4, name: "Super Quiz", questions: 20, icon: <Zap className="h-5 w-5" /> },
  ]);

  const [formations] = useState([
    { id: 1, name: "Word", progress: 75, image: "/images/word.jpg" },
    { id: 2, name: "Excel", progress: 30, image: "/images/excel.jpg" },
    { id: 3, name: "Photoshop", progress: 0, image: "/images/photoshop.jpg" },
  ]);

  const [tutoriels] = useState([
    { id: 1, title: "Comment utiliser la plateforme", duration: "30s", thumbnail: "/images/tuto1.jpg" },
    { id: 2, title: "Astuces pour réussir vos quiz", duration: "30s", thumbnail: "/images/tuto2.jpg" },
    { id: 3, title: "Système de parrainage", duration: "30s", thumbnail: "/images/tuto3.jpg" },
  ]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get categories
      try {
        const fetchedCategories = await quizService.getCategories();
        const categoriesWithColors = fetchedCategories.map((name, index) => {
          const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
          const colorClasses = ['category-blue-500', 'category-green-500', 'category-yellow-500', 'category-red-500', 'category-purple-500', 'category-pink-500'];
          
          return {
            id: name,
            name: name,
            description: `Quizzes dans la catégorie ${name}`,
            color: colors[index % colors.length],
            colorClass: colorClasses[index % colorClasses.length],
            quizCount: Math.floor(Math.random() * 10) + 1, // Sample data
          };
        });
        
        setCategories(categoriesWithColors);
      } catch (categoriesError) {
        console.error('Erreur lors de la récupération des catégories:', categoriesError);
        setError('Impossible de charger les catégories. Veuillez vérifier votre connexion ou réessayer plus tard.');
      }
      
      // Get user progress
      try {
        const progress = await progressService.getUserProgress();
        setUserProgress(progress);
      } catch (progressError) {
        console.error('Erreur lors de la récupération des progrès:', progressError);
        setUserProgress({
          quizzes_completed: 0,
          total_points: 0,
          average_score: 0
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Impossible de charger les données. Veuillez vérifier votre connexion ou réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    fetchData();
  };

  return (
    <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
      {/* En-tête avec bienvenue et progression */}
      <div className="mb-8">
      <img src="/assets/wizi-learn-logo.png" alt="Wizi Learn Logo" className="w-32 mb-6" />
        <h1 className="text-3xl font-bold mb-2">Bienvenue sur Wizi-Learn</h1>
        <p className="text-muted-foreground mb-4">Votre plateforme d'apprentissage personnalisée</p>
        
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Votre progression</h2>
            <Badge variant="outline">Niveau 3</Badge>
          </div>
          <Progress value={65} className="mb-2" />
          <p className="text-sm text-muted-foreground">65% complété - 350 points</p>
        </div>
      </div>

      {/* Section des contacts */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Vos contacts</h2>
          <Link to="/contacts">
            <Button variant="ghost" size="sm">
              Voir tous <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {commerciaux?.[0] && (
            <ContactCard contact={commerciaux[0]} />
          )}
          {formateurs?.[0] && (
            <ContactCard contact={formateurs[0]} />
          )}
          {poleRelation?.[0] && (
            <ContactCard contact={poleRelation[0]} />
          )}
        </div>
      </div>

      {/* Section des formations */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Vos formations</h2>
          <Link to="/formations">
            <Button variant="ghost" size="sm">
              Voir toutes <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {formations.map((formation) => (
            <Card key={formation.id} className="overflow-hidden">
              <div className="h-32 bg-muted relative">
                <img 
                  src={formation.image} 
                  alt={formation.name} 
                  className="w-full h-full object-cover"
                />
                {formation.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs text-center">
                    {formation.progress}% complété
                  </div>
                )}
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{formation.name}</CardTitle>
                <CardDescription>
                  {formation.progress > 0 
                    ? "Formation en cours" 
                    : "Formation disponible"}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" variant={formation.progress > 0 ? "default" : "outline"}>
                  {formation.progress > 0 ? "Continuer" : "Commencer"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Section des quiz */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Quiz disponibles</h2>
          <Link to="/quiz">
            <Button variant="ghost" size="sm">
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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tutoriels et astuces</h2>
          <Link to="/tutoriels">
            <Button variant="ghost" size="sm">
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
                  <h3 className="text-lg font-medium">Voir mes filleuls</h3>
                  <p className="text-sm text-muted-foreground">Consultez votre programme de parrainage complet</p>
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
                  <span className="text-primary">{1000 - (rank * 50)} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    
      </div>

      {/* Section de l'agenda */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Agenda</h2>
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
                <div key={event} className="flex items-start p-2 rounded bg-muted/50">
                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Cours de Word</p>
                    <p className="text-xs text-muted-foreground">Aujourd'hui, 14h00 - 16h00</p>
                    <p className="text-xs text-muted-foreground">Formateur: John Doe</p>
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
