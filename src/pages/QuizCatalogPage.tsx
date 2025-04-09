
import React, { useState, useEffect } from 'react';
import { mockAPI } from '@/api';
import { Category, Quiz } from '@/types';
import QuizCard from '@/components/Quiz/QuizCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const QuizCatalogPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesData = mockAPI.getCategories();
        setCategories(categoriesData);

        // Fetch all quizzes across categories
        const allQuizzes: Quiz[] = [];
        categoriesData.forEach(category => {
          const categoryQuizzes = mockAPI.getQuizzesByCategory(category.id);
          allQuizzes.push(...categoryQuizzes);
        });
        setQuizzes(allQuizzes);
      } catch (error) {
        console.error('Failed to fetch quiz data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterQuizzes = (quiz: Quiz) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      quiz.title.toLowerCase().includes(searchLower) ||
      quiz.description.toLowerCase().includes(searchLower)
    );
  };

  const getQuizzesByCategory = (categoryId: string) => {
    return quizzes.filter(quiz => quiz.category === categoryId && filterQuizzes(quiz));
  };

  const getLevelQuizzes = (level: 'débutant' | 'intermédiaire' | 'avancé' | 'super') => {
    return quizzes.filter(quiz => quiz.level === level && filterQuizzes(quiz));
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#cccccc';
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
      <h1 className="text-2xl font-bold mb-6">Catalogue de Quiz</h1>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher un quiz..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="category">
        <TabsList className="mb-6">
          <TabsTrigger value="category">Par catégorie</TabsTrigger>
          <TabsTrigger value="level">Par niveau</TabsTrigger>
        </TabsList>

        {/* By Category tab */}
        <TabsContent value="category">
          {categories.map(category => {
            const categoryQuizzes = getQuizzesByCategory(category.id);
            if (categoryQuizzes.length === 0) return null;
            
            return (
              <div key={category.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></span>
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryQuizzes.map(quiz => (
                    <QuizCard key={quiz.id} quiz={quiz} categoryColor={category.color} />
                  ))}
                </div>
              </div>
            );
          })}
          
          {categories.every(category => getQuizzesByCategory(category.id).length === 0) && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun quiz trouvé pour cette recherche.</p>
            </div>
          )}
        </TabsContent>

        {/* By Level tab */}
        <TabsContent value="level">
          {['débutant', 'intermédiaire', 'avancé', 'super'].map((level) => {
            const levelQuizzes = getLevelQuizzes(level as any);
            if (levelQuizzes.length === 0) return null;
            
            return (
              <div key={level} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                  {level === 'super' && ' Quiz'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelQuizzes.map(quiz => (
                    <QuizCard key={quiz.id} quiz={quiz} categoryColor={getCategoryColor(quiz.category)} />
                  ))}
                </div>
              </div>
            );
          })}
          
          {['débutant', 'intermédiaire', 'avancé', 'super'].every(
            level => getLevelQuizzes(level as any).length === 0
          ) && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun quiz trouvé pour cette recherche.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizCatalogPage;
