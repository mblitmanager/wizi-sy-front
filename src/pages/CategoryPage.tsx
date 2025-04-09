
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Category, Quiz } from '@/types';
import { mockAPI } from '@/api/mockAPI';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
        
        // Récupération des informations de la catégorie
        const categories = mockAPI.getCategories();
        const foundCategory = categories.find(cat => cat.id === id) || null;
        setCategory(foundCategory);
        
        // Récupération des quiz pour cette catégorie
        if (foundCategory) {
          const categoryQuizzes = mockAPI.getQuizzesByCategory(id);
          setQuizzes(categoryQuizzes);
        }
      } catch (error) {
        console.error('Échec de récupération des données de catégorie:', error);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">Catégorie non trouvée</h2>
        <p className="text-gray-600 mb-8 font-roboto">La catégorie que vous recherchez n'existe pas.</p>
        <Link to="/">
          <Button className="font-nunito">Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

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

  const renderQuizzesByLevel = (level: 'débutant' | 'intermédiaire' | 'avancé' | 'super') => {
    const filteredQuizzes = quizzes.filter(quiz => quiz.level === level);
    
    if (filteredQuizzes.length === 0) return null;
    
    return (
      <div>
        <h3 className="text-lg font-semibold mb-3 font-montserrat">
          {level.charAt(0).toUpperCase() + level.slice(1)}
          {level === 'super' && ' Quiz'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredQuizzes.map(quiz => (
            <Link to={`/quiz/${quiz.id}`} key={quiz.id}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-transform hover:shadow-md hover:translate-y-[-2px]">
                <div className="h-2" style={{ backgroundColor: category.color }}></div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 font-montserrat">{quiz.title}</h3>
                    {getLevelBadge(quiz.level)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 mb-3 font-roboto">{quiz.description}</p>
                  <div className="flex items-center text-xs text-gray-500 font-nunito">
                    <span>{quiz.questions.length} questions • {quiz.points} points</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4 font-nunito">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Retour
      </Link>
      
      <div className={`h-2 w-24 mb-4 rounded-full ${category.colorClass.replace('category-', 'bg-')}`}></div>
      
      <h1 className="text-3xl font-bold mb-2 font-montserrat">{category.name}</h1>
      <p className="text-gray-600 mb-8 font-roboto">{category.description}</p>
      
      {renderQuizzesByLevel('débutant')}
      {renderQuizzesByLevel('intermédiaire')}
      {renderQuizzesByLevel('avancé')}
      {renderQuizzesByLevel('super')}
      
      {quizzes.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-roboto">Aucun quiz disponible dans cette catégorie pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
