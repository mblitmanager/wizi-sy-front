
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Category, UserProgress } from '@/types';
import { mockAPI, progressAPI } from '@/api';
import CategoryCard from '@/components/Home/CategoryCard';
import ProgressCard from '@/components/Home/ProgressCard';
import { Award, Flame, Star, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories and user progress
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would use API calls instead of mockAPI
        const categoriesData = mockAPI.getCategories();
        setCategories(categoriesData);

        if (user) {
          // This would be a real API call in production
          // const userProgressData = await progressAPI.getUserProgress(user.id);
          // setUserProgress(userProgressData);
          
          // Using mock data for now
          setUserProgress({
            userId: user.id,
            categoryProgress: {
              '1': { completedQuizzes: 3, totalQuizzes: 8, points: 150 },
              '2': { completedQuizzes: 2, totalQuizzes: 6, points: 100 },
              '3': { completedQuizzes: 1, totalQuizzes: 5, points: 50 },
              '4': { completedQuizzes: 0, totalQuizzes: 7, points: 0 },
            },
            badges: ['beginner', 'quick_learner'],
            streak: 3,
            lastActive: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate total completion percentage
  const calculateTotalCompletion = () => {
    if (!userProgress) return 0;
    
    let completed = 0;
    let total = 0;
    
    Object.values(userProgress.categoryProgress).forEach(progress => {
      completed += progress.completedQuizzes;
      total += progress.totalQuizzes;
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Get all categories the user has started
  const getInProgressCategories = () => {
    if (!userProgress) return [];
    
    return categories.filter(category => {
      const progress = userProgress.categoryProgress[category.id];
      return progress && progress.completedQuizzes > 0 && progress.completedQuizzes < progress.totalQuizzes;
    });
  };

  const inProgressCategories = getInProgressCategories();
  const totalCompletion = calculateTotalCompletion();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      {/* Welcome section */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Bonjour, {user?.username}!</h1>
        <p className="text-gray-600">Continuez votre apprentissage là où vous l'avez laissé.</p>
      </section>

      {/* Stats cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
            <div className="text-xl font-bold">{user?.points}</div>
            <div className="text-xs text-gray-500">Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Award className="h-6 w-6 text-blue-500 mb-2" />
            <div className="text-xl font-bold">{user?.level}</div>
            <div className="text-xs text-gray-500">Niveau</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Flame className="h-6 w-6 text-red-500 mb-2" />
            <div className="text-xl font-bold">{userProgress?.streak || 0}</div>
            <div className="text-xs text-gray-500">Jours consécutifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Star className="h-6 w-6 text-purple-500 mb-2" />
            <div className="text-xl font-bold">{totalCompletion}%</div>
            <div className="text-xs text-gray-500">Complété</div>
          </CardContent>
        </Card>
      </section>

      {/* Continue learning section */}
      {inProgressCategories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Continuez votre apprentissage</h2>
          <div className="space-y-3">
            {inProgressCategories.map(category => {
              const progress = userProgress?.categoryProgress[category.id];
              if (!progress) return null;
              
              return (
                <ProgressCard
                  key={category.id}
                  title={category.name}
                  value={progress.completedQuizzes}
                  max={progress.totalQuizzes}
                  color={category.color}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
