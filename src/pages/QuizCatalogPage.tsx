import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '@/services/quizService';
import { QuizData } from '@/services/quizService';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import QuizCard from '@/components/Quiz/QuizCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Formation } from '@/types';

const QuizCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formationsByCategory, setFormationsByCategory] = useState<Record<string, Formation[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categories = await quizService.getQuizCategories();
        setCategories(categories.filter(Boolean)); // Filtrer les catégories vides

        // Récupérer les formations pour chaque catégorie
        const formationsByCategory: Record<string, Formation[]> = {};
        for (const category of categories) {
          if (category) {
            const formations = await quizService.getFormationsByCategory(category);
            formationsByCategory[category] = formations;
          }
        }
        setFormationsByCategory(formationsByCategory);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter quizzes based on search criteria
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? quiz.category === selectedCategory : true;
    
    const matchesLevel = selectedLevel ? quiz.level === selectedLevel : true;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Get category color
  const getCategoryColor = (categoryName: string) => {
    // Default colors for categories
    const categoryColors: Record<string, string> = {
      'Général': '#3D9BE9',
      'Technique': '#FF6B6B',
      'Commercial': '#4ECDC4',
      'Relation Client': '#FFD166',
      'Management': '#9B59B6'
    };
    return categoryColors[categoryName] || '#3D9BE9';
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
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer font-nunito"
          onClick={() => setSelectedCategory(null)}
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
        
        <Badge
          key="super"
          variant={selectedLevel === 'super' ? "default" : "outline"}
          className={`cursor-pointer font-nunito ${selectedLevel === 'super' ? 'bg-red-500' : ''}`}
          onClick={() => setSelectedLevel('super')}
        >
          Super Quiz
        </Badge>
      </div>
      
      {/* Quiz list */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map(quiz => (
            <QuizCard
              key={`quiz-${quiz.id}`}
              quiz={quiz}
              categoryColor={getCategoryColor(quiz.category)}
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
