
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockAPI, progressAPI } from '@/api';
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

        // In a real app, we would use API calls
        const categoriesData = mockAPI.getCategories();
        setCategories(categoriesData);

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

        // Mock recent results
        setRecentResults([
          {
            id: '1',
            quizId: '1',
            userId: user.id,
            score: 80,
            correctAnswers: 8,
            totalQuestions: 10,
            completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            timeSpent: 120,
          },
          {
            id: '2',
            quizId: '2',
            userId: user.id,
            score: 60,
            correctAnswers: 6,
            totalQuestions: 10,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            timeSpent: 180,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#cccccc';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Inconnu';
  };

  const getQuizName = (quizId: string) => {
    // In a real app, we would fetch the quiz name from the API
    const quizNames: Record<string, string> = {
      '1': 'Les bases de Word',
      '2': 'Excel pour débutants',
    };
    
    return quizNames[quizId] || 'Quiz inconnu';
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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
      <h1 className="text-2xl font-bold mb-6">Profil</h1>

      {/* User profile header */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mr-6">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-gray-500">Membre depuis 2024</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center">
            <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Points</div>
              <div className="text-xl font-bold">{user.points}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <Award className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Niveau</div>
              <div className="text-xl font-bold">{user.level}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <Flame className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Streak</div>
              <div className="text-xl font-bold">{userProgress?.streak || 0} jours</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <Star className="h-6 w-6 text-purple-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Badges</div>
              <div className="text-xl font-bold">{userProgress?.badges.length || 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Progress by category section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Progression par catégorie</h2>
          <div className="bg-white rounded-lg shadow p-6">
            {userProgress && Object.entries(userProgress.categoryProgress).map(([categoryId, progress]) => {
              const percentage = Math.round((progress.completedQuizzes / progress.totalQuizzes) * 100);
              return (
                <div key={categoryId} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{getCategoryName(categoryId)}</span>
                    <span className="text-sm text-gray-500">
                      {progress.completedQuizzes}/{progress.totalQuizzes} quizz
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" indicatorColor={getCategoryColor(categoryId)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Badges</h2>
          <div className="bg-white rounded-lg shadow p-6">
            {userProgress?.badges && userProgress.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Débutant</Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Apprenant Rapide</Badge>
                {/* Add more badges as needed */}
              </div>
            ) : (
              <p className="text-gray-500">Vous n'avez pas encore obtenu de badges.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent activity section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
        <div className="bg-white rounded-lg shadow">
          {recentResults.length > 0 ? (
            <ul>
              {recentResults.map((result, index) => (
                <Collapsible key={result.id}>
                  <div className={`p-4 ${index !== recentResults.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: getCategoryColor(result.quizId.charAt(0)) + '20', color: getCategoryColor(result.quizId.charAt(0)) }}
                        >
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{getQuizName(result.quizId)}</div>
                          <div className="text-xs text-gray-500">{formatDate(result.completedAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">{result.score} pts</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 ml-13 pl-13">
                      <div className="bg-gray-50 rounded p-3 ml-13">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-500">Questions correctes</div>
                            <div className="font-medium">{result.correctAnswers}/{result.totalQuestions}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Pourcentage</div>
                            <div className="font-medium">
                              {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Temps écoulé</div>
                            <div className="font-medium">
                              {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Score</div>
                            <div className="font-medium">{result.score} points</div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Aucune activité récente
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
