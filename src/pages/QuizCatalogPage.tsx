import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Formation, Quiz } from '@/types';
import { quizService } from '@/services/quizService';
import { formationService } from '@/services/formationService';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import QuizCard from '@/components/Quiz/QuizCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuizCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formations, setFormations] = useState<Formation[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const fetchFormations = async () => {
    try {
      const { data } = await formationService.getFormationsByStagiaire();
      setFormations(data);
      
      // Extraire les catégories uniques
      const uniqueCategories = [...new Set(data.map(formation => formation.categorie))];
      setCategories(uniqueCategories);
      
      // Extraire tous les quiz
      const allQuizzes = data.flatMap(formation => formation.quizzes);
      setQuizzes(allQuizzes);
    } catch (err) {
      setError('Erreur lors de la récupération des formations');
      console.error('Erreur lors de la récupération des formations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  // Filter quizzes based on search criteria
  const filteredQuizzes = quizzes.filter(quiz => {
    if (!quiz || !quiz.titre || !quiz.description) return false;
    
    const matchesSearch = quiz.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? 
      formations.some(f => f.categorie === selectedCategory && f.quizzes.some(q => q.id === quiz.id)) : true;
    
    const matchesLevel = selectedLevel ? quiz.niveau === selectedLevel : true;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Get category color
  const getCategoryColor = (categoryName: string) => {
    // Default colors for categories
    const categoryColors: Record<string, string> = {
      'Bureautique': '#3D9BE9',
      'Création': '#9392BE',
      'Internet': '#FFC533',
      'Langues': '#A55E6E',
      'Autre': '#9B59B6'
    };
    return categoryColors[categoryName] || '#3D9BE9';
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchFormations();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 font-montserrat">Catalogue de Quiz</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 font-montserrat">Catalogue de Quiz</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry} 
            className="mt-2 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Réessayer
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6 font-montserrat">Catalogue de Quiz</h1>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher un quiz..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 font-roboto"
        />
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center mr-2">
          <Filter className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-sm text-gray-600 font-roboto">Filtres:</span>
        </div>
        
        {/* Category filter */}
        <Badge
          key="all-categories"
          variant={selectedCategory === '' ? "default" : "outline"}
          className="cursor-pointer font-nunito"
          onClick={() => setSelectedCategory('')}
        >
          Toutes les catégories
        </Badge>
        
        {categories.map((category, index) => (
          <Badge
            key={`category-${category}-${index}`}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer font-nunito"
            style={{ backgroundColor: selectedCategory === category ? getCategoryColor(category) : undefined }}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
        
        <Separator className="my-3" />
        
        {/* Level filter */}
        <Badge
          key="all-levels"
          variant={selectedLevel === null ? "default" : "outline"}
          className="cursor-pointer font-nunito"
          onClick={() => setSelectedLevel(null)}
        >
          Tous les niveaux
        </Badge>
        
        <Badge
          key="beginner"
          variant={selectedLevel === 'débutant' ? "default" : "outline"}
          className={`cursor-pointer font-nunito ${selectedLevel === 'débutant' ? 'bg-green-500' : ''}`}
          onClick={() => setSelectedLevel('débutant')}
        >
          Débutant
        </Badge>
        
        <Badge
          key="intermediate"
          variant={selectedLevel === 'intermédiaire' ? "default" : "outline"}
          className={`cursor-pointer font-nunito ${selectedLevel === 'intermédiaire' ? 'bg-blue-500' : ''}`}
          onClick={() => setSelectedLevel('intermédiaire')}
        >
          Intermédiaire
        </Badge>
        
        <Badge
          key="advanced"
          variant={selectedLevel === 'avancé' ? "default" : "outline"}
          className={`cursor-pointer font-nunito ${selectedLevel === 'avancé' ? 'bg-purple-500' : ''}`}
          onClick={() => setSelectedLevel('avancé')}
        >
          Avancé
        </Badge>
      </div>
      
      {/* Quiz list */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map(quiz => {
            const formation = formations.find(f => f.quizzes.some(q => q.id === quiz.id));
            return (
              <QuizCard
                key={`quiz-${quiz.id}`}
                quiz={quiz}
                categoryColor={formation ? getCategoryColor(formation.categorie) : '#3D9BE9'}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 font-roboto">
            Aucun quiz ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizCatalogPage;
