
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Category, Quiz } from '@/types';
import { mockAPI } from '@/api';
import QuizCard from '@/components/Quiz/QuizCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        // Get category information
        const categories = mockAPI.getCategories();
        const foundCategory = categories.find(cat => cat.id === id) || null;
        setCategory(foundCategory);
        
        // Get quizzes for this category
        if (foundCategory) {
          const categoryQuizzes = mockAPI.getQuizzesByCategory(id);
          setQuizzes(categoryQuizzes);
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Catégorie non trouvée</h2>
        <p className="text-gray-600 mb-8">La catégorie que vous recherchez n'existe pas.</p>
        <Link to="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  const renderQuizzesByLevel = (level: 'débutant' | 'intermédiaire' | 'avancé' | 'super') => {
    const filteredQuizzes = quizzes.filter(quiz => quiz.level === level);
    
    if (filteredQuizzes.length === 0) return null;
    
    return (
      <div>
        <h3 className="text-lg font-semibold mb-3">
          {level.charAt(0).toUpperCase() + level.slice(1)}
          {level === 'super' && ' Quiz'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredQuizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} categoryColor={category.color} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Retour
      </Link>
      
      <div className={`h-2 w-24 mb-4 rounded-full ${category.colorClass.replace('category-', 'bg-')}`}></div>
      
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-8">{category.description}</p>
      
      {renderQuizzesByLevel('débutant')}
      {renderQuizzesByLevel('intermédiaire')}
      {renderQuizzesByLevel('avancé')}
      {renderQuizzesByLevel('super')}
      
      {quizzes.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun quiz disponible dans cette catégorie pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
