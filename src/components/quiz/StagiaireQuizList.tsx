import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { quizService } from "@/services/QuizService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Award, AlertCircle, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Category } from "@/services/QuizService";

// Fonction pour obtenir la couleur du niveau
const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'débutant':
      return 'secondary';
    case 'intermédiaire':
      return 'default';
    case 'avancé':
    case 'super quiz':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Fonction pour obtenir la couleur de fond du niveau
const getLevelBackgroundColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'débutant':
      return 'bg-green-100 text-green-800';
    case 'intermédiaire':
      return 'bg-blue-100 text-blue-800';
    case 'avancé':
    case 'super quiz':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return '';
  }
};

// Modifier la fonction getCategoryColor pour utiliser l'ID de la catégorie
const getCategoryColor = (categoryId: string, categories: Category[] | undefined) => {
  if (!categories) return '#000000';
  
  const category = categories.find(c => c.id === categoryId);
  if (!category) return '#000000';

  switch (category.name.toLowerCase()) {
    case 'bureautique':
      return '#3D9BE9';
    case 'langues':
      return '#A55E6E';
    case 'internet':
      return '#FFC533';
    case 'création':
      return '#9392BE';
    default:
      return '#000000';
  }
};

export function StagiaireQuizList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  
  const { data: quizzes, isLoading: quizzesLoading, error: quizzesError } = useQuery({
    queryKey: ["stagiaire-quizzes"],
    queryFn: () => quizService.getStagiaireQuizzes(),
    enabled: !!localStorage.getItem('token')
  });
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => quizService.getCategories(),
    enabled: !!localStorage.getItem('token')
  });
  
  const isLoading = quizzesLoading || categoriesLoading;
  const error = quizzesError;

  // Extraire les niveaux uniques des quizzes
  const levels = useMemo(() => {
    if (!quizzes) return [];
    const uniqueLevels = new Set<string>();
    quizzes.forEach(quiz => {
      if (quiz.niveau) uniqueLevels.add(quiz.niveau);
    });
    return Array.from(uniqueLevels);
  }, [quizzes]);

  // Filtrer les quizzes en fonction des sélections
  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    
    return quizzes.filter(quiz => {
      const categoryMatch = selectedCategory === "all" || quiz.categorieId === selectedCategory;
      const levelMatch = selectedLevel === "all" || quiz.niveau === selectedLevel;
      return categoryMatch && levelMatch;
    });
  }, [quizzes, selectedCategory, selectedLevel]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors du chargement de vos quiz. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  if (!quizzes?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun quiz disponible pour vous</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Mes Quiz</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filtrer par:</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories?.map((category: Category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {(selectedCategory !== "all" || selectedLevel !== "all") && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
      
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun quiz ne correspond à vos filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Link key={quiz.id} to={`/quiz/${quiz.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow relative">
                <div 
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                  style={{ 
                    backgroundColor: getCategoryColor(quiz.categorieId, categories)
                  }}
                />
                <CardHeader>
                  <CardTitle className="text-xl">{quiz.titre}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Badge 
                      variant={getLevelColor(quiz.niveau)} 
                      className={`text-sm ${getLevelBackgroundColor(quiz.niveau)}`}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {quiz.niveau}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Award className="w-4 h-4 mr-2" />
                      {quiz.points} pts
                    </Badge>
                    {categories && (
                      <Badge 
                        variant="outline" 
                        className="text-sm"
                        style={{ 
                          borderColor: categories.find(c => c.id === quiz.categorieId)?.color || '#000',
                          color: categories.find(c => c.id === quiz.categorieId)?.color || '#000'
                        }}
                      >
                        {categories.find(c => c.id === quiz.categorieId)?.name || quiz.categorie}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 