
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockAPI } from '@/api/mockAPI';
import { Category, UserProgress, QuizResult } from '@/types';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import BadgesDisplay from '@/components/Profile/BadgesDisplay';
import UserStats from '@/components/Profile/UserStats';
import CategoryProgress from '@/components/Profile/CategoryProgress';
import RecentResults from '@/components/Profile/RecentResults';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentResults, setRecentResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Dans une vraie application, nous utiliserions des appels API
        const categoriesData = mockAPI.getCategories();
        setCategories(categoriesData);

        // Mock de progression utilisateur
        setUserProgress({
          userId: user.id,
          categoryProgress: {
            '1': { completedQuizzes: 3, totalQuizzes: 8, points: 150 },
            '2': { completedQuizzes: 2, totalQuizzes: 6, points: 100 },
            '3': { completedQuizzes: 1, totalQuizzes: 5, points: 50 },
            '4': { completedQuizzes: 0, totalQuizzes: 7, points: 0 },
          },
          badges: ['beginner', 'quick_learner', 'perfectionist'],
          streak: 3,
          lastActive: new Date().toISOString(),
        });

        // Mock de résultats récents
        setRecentResults([
          {
            id: '1',
            quizId: '1',
            userId: user.id,
            score: 90,
            correctAnswers: 9,
            totalQuestions: 10,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            timeSpent: 180,
          },
          {
            id: '2',
            quizId: '4',
            userId: user.id,
            score: 80,
            correctAnswers: 4,
            totalQuestions: 5,
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            timeSpent: 120,
          },
        ]);
      } catch (error) {
        console.error('Échec de récupération des données utilisateur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Handle loading or no user state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg font-medium text-gray-700 mb-2">Vous n'êtes pas connecté</div>
        <p className="text-gray-500">Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <h1 className="text-2xl font-bold mb-6 font-montserrat">Mon Profil</h1>

      {/* Profile Header with User Info */}
      <ProfileHeader user={user} />
      
      {/* Badges */}
      {userProgress && <BadgesDisplay badges={userProgress.badges} />}

      {/* Statistics */}
      <UserStats user={user} userProgress={userProgress} />

      {/* Category Progress */}
      {userProgress && <CategoryProgress categories={categories} userProgress={userProgress} />}

      {/* Recent Results */}
      {recentResults.length > 0 && <RecentResults results={recentResults} />}
    </div>
  );
};

export default ProfilePage;
