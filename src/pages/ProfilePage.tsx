
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockAPI } from '@/api/mockAPI';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Category, UserProgress, QuizResult } from '@/types';
import { Award, Flame, Trophy, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
        if (!user) return;

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

  // Fonction pour formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date);
  };

  // Badges disponibles
  const badgeIcons: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    beginner: {
      icon: <Award className="h-4 w-4" />,
      label: 'Débutant',
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    quick_learner: {
      icon: <Flame className="h-4 w-4" />,
      label: 'Apprentissage Rapide',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    perfectionist: {
      icon: <Star className="h-4 w-4" />,
      label: 'Perfectionniste',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <h1 className="text-2xl font-bold mb-6 font-montserrat">Mon Profil</h1>

      {/* Informations utilisateur */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-4 font-nunito">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold font-montserrat">{user.username}</h2>
            <div className="text-gray-500 font-roboto">{user.email}</div>
            <div className="flex items-center mt-1">
              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium font-nunito">{user.points} points - Niveau {user.level}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        {userProgress && userProgress.badges.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 font-montserrat">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {userProgress.badges.map((badge) => {
                const badgeInfo = badgeIcons[badge];
                return (
                  <Badge key={badge} variant="outline" className={badgeInfo?.color}>
                    <span className="mr-1">{badgeInfo?.icon}</span>
                    {badgeInfo?.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4 font-montserrat">Mes statistiques</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
              <div className="text-xl font-bold font-nunito">{user.points}</div>
              <div className="text-xs text-gray-500 font-roboto">Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Award className="h-6 w-6 text-blue-500 mb-2" />
              <div className="text-xl font-bold font-nunito">{user.level}</div>
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
              <div className="text-xl font-bold font-nunito">{userProgress?.badges.length || 0}</div>
              <div className="text-xs text-gray-500 font-roboto">Badges</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Progression par catégorie */}
      {userProgress && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 font-montserrat">Ma progression</h2>
          <div className="space-y-3">
            {categories.map((category) => {
              const progress = userProgress.categoryProgress[category.id];
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

      {/* Résultats récents */}
      {recentResults.length > 0 && (
        <Collapsible className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold font-montserrat">Résultats récents</h2>
            <CollapsibleTrigger className="rounded-full p-1 hover:bg-gray-100">
              {({ open }) => (
                open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="space-y-3">
              {recentResults.map((result) => {
                const quiz = mockAPI.getAllQuizzes().find(q => q.id === result.quizId);
                if (!quiz) return null;
                
                return (
                  <div key={result.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium font-montserrat">{quiz.title}</h3>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 font-nunito">
                        {result.score}%
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mb-2 font-roboto">
                      {result.correctAnswers} / {result.totalQuestions} correctes • Complété le {formatDate(result.completedAt)}
                    </div>
                    <Progress value={result.score} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default ProfilePage;
