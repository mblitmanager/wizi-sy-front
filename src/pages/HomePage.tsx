
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, UserProgress } from '@/types';
import { quizAPI, progressAPI } from '@/api';
import CategoryCard from '@/components/Home/CategoryCard';
import ProgressCard from '@/components/Home/ProgressCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    quizzes_completed: 0,
    total_points: 0,
    average_score: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get categories
      try {
        const fetchedCategories = await quizAPI.getCategories();
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
        const progress = await progressAPI.getUserProgress();
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
    <div className="pb-20 md:pb-0 md:pl-64">
      <div className="mb-8">
        <ProgressCard progress={userProgress} />
      </div>
      
      {error && (
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
      )}
      
      <h2 className="text-2xl font-bold mb-6 text-gray-800 font-montserrat">Catégories</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
