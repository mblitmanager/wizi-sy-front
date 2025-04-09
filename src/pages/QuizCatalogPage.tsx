
import React, { useState, useEffect } from 'react';
import { mockAPI } from '@/api/mockAPI';
import { Quiz, Category } from '@/types';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const QuizCatalogPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allCategories = mockAPI.getCategories();
        setCategories(allCategories);
        
        // Récupérer tous les quiz de toutes les catégories
        const allQuizzes: Quiz[] = [];
        allCategories.forEach(category => {
          const categoryQuizzes = mockAPI.getQuizzesByCategory(category.id);
          allQuizzes.push(...categoryQuizzes);
        });
        
        setQuizzes(allQuizzes);
      } catch (error) {
        console.error('Échec de récupération des données de quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = searchTerm === '' || 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || quiz.categoryId === selectedCategory;
    
    const matchesLevel = selectedLevel === 'all' || quiz.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'débutant':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-nunito">Débutant</Badge>;
      case 'intermédiaire':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 font-nunito">Intermédiaire</Badge>;
      case 'avancé':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 font-nunito">Avancé</Badge>;
      case 'super':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 font-nunito">Super Quiz</Badge>;
      default:
        return null;
    }
  };

  const getCategoryColor = (categoryId: string | undefined) => {
    if (!categoryId) return '#cccccc';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#cccccc';
  };

  const levels = ['débutant', 'intermédiaire', 'avancé', 'super'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <h1 className="text-3xl font-bold mb-6 font-montserrat">Catalogue des Quiz</h1>
      
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Rechercher un quiz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-roboto"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="font-nunito">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-nunito">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id} className="font-nunito">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-1/2">
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="font-nunito">
                <SelectValue placeholder="Filtrer par niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-nunito">Tous les niveaux</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level} className="font-nunito">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuizzes.map(quiz => (
            <Link to={`/quiz/${quiz.id}`} key={quiz.id}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform hover:shadow-md hover:translate-y-[-2px]">
                <div className="h-2" style={{ backgroundColor: getCategoryColor(quiz.categoryId) }}></div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 font-montserrat">{quiz.title}</h3>
                    {getLevelBadge(quiz.level)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 mb-3 font-roboto">{quiz.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 font-nunito">
                    <span>{quiz.category}</span>
                    <span>{quiz.points} points</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Filter className="mx-auto h-10 w-10 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 font-montserrat">Aucun résultat</h3>
          <p className="text-gray-600 font-roboto">
            Aucun quiz ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizCatalogPage;
