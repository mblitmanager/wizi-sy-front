
import React, { useState, useEffect } from 'react';
import { mockAPI } from '@/api/mockAPI';
import { Quiz, Category } from '@/types';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import QuizCard from '@/components/Quiz/QuizCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const QuizCatalogPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Dans une vraie application, nous utiliserions des appels API
        const categoriesData = mockAPI.getCategories();
        setCategories(categoriesData);
        
        const allQuizzes = mockAPI.getAllQuizzes();
        setQuizzes(allQuizzes);
      } catch (error) {
        console.error('Échec de récupération des quizz:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les quiz en fonction des critères de recherche
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? quiz.categoryId === selectedCategory : true;
    
    const matchesLevel = selectedLevel ? quiz.level === selectedLevel : true;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Obtenir la couleur de la catégorie
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#3D9BE9';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <h1 className="text-2xl font-bold mb-6 font-montserrat">Catalogue de Quiz</h1>
      
      {/* Barre de recherche */}
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
      
      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center mr-2">
          <Filter className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-sm text-gray-600 font-roboto">Filtres:</span>
        </div>
        
        {/* Filtre par catégorie */}
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer font-nunito"
          onClick={() => setSelectedCategory(null)}
        >
          Toutes les catégories
        </Badge>
        
        {categories.map(category => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="cursor-pointer font-nunito"
            style={{ backgroundColor: selectedCategory === category.id ? category.color : undefined }}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Badge>
        ))}
        
        <Separator className="my-3" />
        
        {/* Filtre par niveau */}
        <Badge
          variant={selectedLevel === null ? "default" : "outline"}
          className="cursor-pointer font-nunito"
          onClick={() => setSelectedLevel(null)}
        >
          Tous les niveaux
        </Badge>
        
        <Badge
          variant={selectedLevel === 'débutant' ? "default" : "outline"}
          className={`cursor-pointer font-nunito ${selectedLevel === 'débutant' ? 'bg-green-500' : ''}`}
          onClick={() => setSelectedLevel('débutant')}
        >
          Débutant
        </Badge>
        
        <Badge
          variant={selectedLevel === 'intermédiaire' ? "default" : "outline"}
          className={`cursor-pointer font-nunito ${selectedLevel === 'intermédiaire' ? 'bg-blue-500' : ''}`}
          onClick={() => setSelectedLevel('intermédiaire')}
        >
          Intermédiaire
        </Badge>
        
        <Badge
          variant={selectedLevel === 'avancé' ? "default" : "outline"}
          className={`cursor-pointer font-nunito ${selectedLevel === 'avancé' ? 'bg-purple-500' : ''}`}
          onClick={() => setSelectedLevel('avancé')}
        >
          Avancé
        </Badge>
        
        <Badge
          variant={selectedLevel === 'super' ? "default" : "outline"}
          className={`cursor-pointer font-nunito ${selectedLevel === 'super' ? 'bg-red-500' : ''}`}
          onClick={() => setSelectedLevel('super')}
        >
          Super Quiz
        </Badge>
      </div>
      
      {/* Liste des quiz */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              categoryColor={getCategoryColor(quiz.categoryId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-roboto">
            Aucun quiz ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizCatalogPage;
