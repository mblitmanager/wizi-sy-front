
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Category, UserProgress } from '@/types';
import CategoryCard from '@/components/Home/CategoryCard';
import { Award, Flame, Star, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { quizAPI, progressAPI } from '@/api';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // If user is admin, redirect to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  // Récupération des catégories et de la progression de l'utilisateur
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories from API
        const categoriesData = await quizAPI.getCategories();
        
        // Transform the data to match the Category type
        const formattedCategories = Array.isArray(categoriesData) ? categoriesData.map((cat, index) => ({
          id: typeof cat === 'string' ? cat : String(index),
          name: typeof cat === 'string' ? cat : cat.name || 'Category',
          description: 'Description de la catégorie',
          icon: 'book',
          color: '#4F46E5',
          colorClass: 'bg-indigo-500',
          quizCount: 5
        })) : [];
        
        setCategories(formattedCategories);

        if (user) {
          try {
            const userProgressData = await progressAPI.getUserProgress();
            setUserProgress(userProgressData);
          } catch (error) {
            console.error('Error fetching user progress:', error);
            // Fallback progress data
            setUserProgress({
              user_id: user.id,
              quiz_id: '',
              score: 0,
              completed_at: new Date().toISOString(),
              attempts: 0
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Provide fallback categories if API fails
        setCategories([
          {
            id: '1',
            name: 'Informatique',
            description: 'Apprenez les bases de l\'informatique',
            icon: 'laptop',
            color: '#4F46E5',
            colorClass: 'bg-indigo-500',
            quizCount: 5
          },
          {
            id: '2',
            name: 'Langues',
            description: 'Améliorez vos compétences linguistiques',
            icon: 'globe',
            color: '#10B981',
            colorClass: 'bg-green-500',
            quizCount: 3
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calcul du pourcentage de progression total (placeholder for now)
  const calculateTotalCompletion = () => {
    return 45; // Placeholder value
  };

  // Récupération des catégories commencées par l'utilisateur (placeholder)
  const getInProgressCategories = () => {
    return categories.slice(0, 1); // Just return the first category as in-progress
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
        <h1 className="text-2xl font-bold mb-2 font-montserrat">Bonjour, {user?.username || 'Utilisateur'}!</h1>
        <p className="text-gray-600 font-roboto">Continuez votre apprentissage là où vous l'avez laissé.</p>
      </section>

      {/* Cartes de statistiques */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
            <div className="text-xl font-bold font-nunito">{user?.points || 0}</div>
            <div className="text-xs text-gray-500 font-roboto">Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Award className="h-6 w-6 text-blue-500 mb-2" />
            <div className="text-xl font-bold font-nunito">{user?.level || 1}</div>
            <div className="text-xs text-gray-500 font-roboto">Niveau</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Flame className="h-6 w-6 text-red-500 mb-2" />
            <div className="text-xl font-bold font-nunito">0</div>
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
            {inProgressCategories.map(category => (
              <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-1 font-montserrat">{category.name}</h3>
                <div className="flex justify-between items-center mb-1 text-xs text-gray-500 font-roboto">
                  <span>2 terminés</span>
                  <span>{category.quizCount || 5} total</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            ))}
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
