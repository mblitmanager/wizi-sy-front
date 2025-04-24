import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Calendar,
  Users,
  ChevronRight,
  Play,
  CheckCircle,
  Lock,
  Star,
} from "lucide-react";
import HeaderSection from "@/components/features/HeaderSection";
import { catalogueFormationApi, progressAPI } from "@/services/api";

const FormationsPage = () => {
  // Données fictives pour les formations
  const [formations] = useState([
    {
      id: 1,
      name: "Word",
      description:
        "Apprenez à utiliser Microsoft Word de manière professionnelle",
      progress: 75,
      image: "/images/word.jpg",
      duration: "20h",
      level: "Débutant",
      instructor: "John Doe",
      students: 120,
      rating: 4.8,
      modules: [
        { id: 1, name: "Introduction à Word", completed: true },
        { id: 2, name: "Mise en forme du texte", completed: true },
        { id: 3, name: "Insertion d'éléments", completed: true },
        { id: 4, name: "Mise en page avancée", completed: false },
        { id: 5, name: "Styles et modèles", completed: false },
      ],
    },
    {
      id: 2,
      name: "Excel",
      description: "Maîtrisez les tableurs et l'analyse de données",
      progress: 30,
      image: "/images/excel.jpg",
      duration: "25h",
      level: "Intermédiaire",
      instructor: "Jane Smith",
      students: 85,
      rating: 4.9,
      modules: [
        { id: 1, name: "Les bases d'Excel", completed: true },
        { id: 2, name: "Formules et fonctions", completed: false },
        { id: 3, name: "Tableaux croisés", completed: false },
        { id: 4, name: "Graphiques", completed: false },
        { id: 5, name: "Macros", completed: false },
      ],
    },
    {
      id: 3,
      name: "Photoshop",
      description: "Créez et modifiez des images professionnelles",
      progress: 0,
      image: "/images/photoshop.jpg",
      duration: "30h",
      level: "Avancé",
      instructor: "Mike Johnson",
      students: 45,
      rating: 4.7,
      modules: [
        { id: 1, name: "Interface et outils", completed: false },
        { id: 2, name: "Calques et masques", completed: false },
        { id: 3, name: "Retouche photo", completed: false },
        { id: 4, name: "Effets et filtres", completed: false },
        { id: 5, name: "Composition avancée", completed: false },
      ],
    },
  ]);

  const [completedFormations, setCompletedFormations] = useState([]);

  useEffect(() => {
    getFormationByStagiaire();
  }, []);

  const getFormationByStagiaire = async () => {
    try {
      const progress = await progressAPI.getUserProgress();
      const stagiaireId = progress?.stagiaire?.id;
      const response = await catalogueFormationApi.getFomationByStagiaireId(
        stagiaireId
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching formations:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <HeaderSection titre="Formations" buttonText="Retour" />

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="available">Formations disponibles</TabsTrigger>
          <TabsTrigger value="completed">Formations terminées</TabsTrigger>
        </TabsList>

        {/* Onglet des formations disponibles */}
        <TabsContent value="available">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {formations.map((formation) => (
              <Card key={formation.id} className="overflow-hidden">
                <div className="h-48 bg-muted relative">
                  <img
                    src={formation.image}
                    alt={formation.name}
                    className="w-full h-full object-cover"
                  />
                  {formation.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Progression</span>
                        <span className="text-sm font-medium">
                          {formation.progress}%
                        </span>
                      </div>
                      <Progress value={formation.progress} className="h-1" />
                    </div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{formation.name}</CardTitle>
                    <Badge variant="outline">{formation.level}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {formation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">{formation.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">
                        {formation.students} apprenants
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">Prochain cours: 15/04</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm">{formation.rating}/5</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {formation.modules.map((module) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm">{module.name}</span>
                        {module.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    variant={formation.progress > 0 ? "default" : "outline"}>
                    {formation.progress > 0 ? "Continuer" : "Commencer"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet des formations terminées */}
        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {formations
              .filter((f) => f.progress === 100)
              .map((formation) => (
                <Card key={formation.id} className="overflow-hidden">
                  <div className="h-48 bg-muted relative">
                    <img
                      src={formation.image}
                      alt={formation.name}
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Badge className="text-lg px-4 py-2">
                        Formation terminée
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{formation.name}</CardTitle>
                    <CardDescription>Terminée le 01/04/2024</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="font-medium">Votre note: 18/20</span>
                      </div>
                      <Badge variant="secondary">Certifié</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      Voir le certificat
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormationsPage;
