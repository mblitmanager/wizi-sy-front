
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Category, UserProgress } from '@/types';
import { mockAPI } from '@/api/mockAPI';
import CategoryCard from '@/components/Home/CategoryCard';
import { Award, Flame, Star, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Récupération des catégories et de la progression de l'utilisateur
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Dans une vraie application, nous utiliserions des appels API au lieu de mockAPI
        const categoriesData = mockAPI.getCategories();
        setCategories(categoriesData);

        if (user) {
          // Ceci serait un vrai appel API en production
          // const userProgressData = await progressAPI.getUserProgress(user.id);
          // setUserProgress(userProgressData);
          
          // Utilisation de données mock pour l'instant
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
        console.error('Échec de récupération des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calcul du pourcentage de progression total
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

  // Récupération des catégories commencées par l'utilisateur
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
      {/* Section d'accueil */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-2 font-montserrat">Bonjour, {user?.username}!</h1>
        <p className="text-gray-600 font-roboto">Continuez votre apprentissage là où vous l'avez laissé.</p>
      </section>

      {/* Cartes de statistiques */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
            <div className="text-xl font-bold font-nunito">{user?.points}</div>
            <div className="text-xs text-gray-500 font-roboto">Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Award className="h-6 w-6 text-blue-500 mb-2" />
            <div className="text-xl font-bold font-nunito">{user?.level}</div>
            <div className="text-xs text-gray-500 font-roboto">Niveau</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Flame className="h-6 w-6 text-red-500 mb-2" />
            <div className="text-xl font-bold font-nunito">{userProgress?.streak || 0}</div>
            <div className="text-xs text-gray-500 font-roboto">Jours consécutifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Star className="h-6 w-6 text-purple-500 mb-2" />
            <div className="text-xl font-bold font-nunito">{totalCompletion}%</div>
            <div className="text-xs text-gray-500 font-roboto">Complété</div>
          </CardContent>
        </Card>
      </section>

      {/* Section "Continuez votre apprentissage" */}
      {inProgressCategories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 font-montserrat">Continuez votre apprentissage</h2>
          <div className="space-y-3">
            {inProgressCategories.map(category => {
              const progress = userProgress?.categoryProgress[category.id];
              if (!progress) return null;
              
              const percentage = (progress.completedQuizzes / progress.totalQuizzes) * 100;
              
              return (
                <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700 mb-1 font-montserrat">{category.name}</h3>
                  <div className="flex justify-between items-center mb-1 text-xs text-gray-500 font-roboto">
                    <span>{progress.completedQuizzes} terminés</span>
                    <span>{progress.totalQuizzes} total</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section Catégories */}
      <section>
        <h2 className="text-xl font-semibold mb-4 font-montserrat">Catégories</h2>
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
