import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, UserProgress } from '@/types';
import { quizAPI, progressAPI } from '@/api';
import CategoryCard from '@/components/Home/CategoryCard';
import ProgressCard from '@/components/Home/ProgressCard';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get categories
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
        
        // Get user progress
        try {
          const progress = await progressAPI.getUserProgress();
          setUserProgress(progress);
        } catch (error) {
          console.error('Erreur lors de la récupération des progrès:', error);
          setUserProgress({
            quizzes_completed: 0,
            total_points: 0,
            average_score: 0
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <div className="mb-8">
        <ProgressCard progress={userProgress} />
      </div>
      
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
