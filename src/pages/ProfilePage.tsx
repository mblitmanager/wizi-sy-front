import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import UserStats from '@/components/Profile/UserStats';
import RecentResults from '@/components/Profile/RecentResults';
import BadgesDisplay from '@/components/Profile/BadgesDisplay';
import CategoryProgress from '@/components/Profile/CategoryProgress';
import NotificationSettings from '@/components/Profile/NotificationSettings';
import ParrainageSection from '@/components/Profile/ParrainageSection';
import { quizAPI, progressAPI } from '@/api';
import { User } from '@/types';
import { QuizResult, Category, UserProgress } from '@/types/quiz';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    quizzes_completed: 0,
    total_points: 0,
    average_score: 0,
    badges: [],
    streak: 0,
    categoryProgress: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/auth/login');
          return;
        }
        
        // Récupérer les données du stagiaire depuis l'API
        const progressResponse = await fetch(`${import.meta.env.VITE_API_URL}/stagiaire/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (progressResponse.ok) {
          const data = await progressResponse.json();
          const stagiaire = data.stagiaire;
          
          const userData: User = {
            id: stagiaire.id.toString(),
            username: stagiaire.user.name,
            email: stagiaire.user.email,
            role: stagiaire.role,
            level: parseInt(data.progress.level),
            points: data.progress.total_points
          };
          
          setUser(userData);
          
          // Fetch categories
          const categoriesData = await quizAPI.getCategories();
          setCategories(categoriesData);
          
          // Mock quiz results (in a real app, you would fetch this from an API)
          const mockResults: QuizResult[] = [
            {
              id: 'result-1',
              quizId: 'quiz-1',
              quizName: 'Introduction à Excel',
              userId: userData.id,
              score: 85,
              correctAnswers: 17,
              totalQuestions: 20,
              completedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              timeSpent: 720
            },
            {
              id: 'result-2',
              quizId: 'quiz-2',
              quizName: 'Sécurité sur Internet',
              userId: userData.id,
              score: 92,
              correctAnswers: 11,
              totalQuestions: 12,
              completedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
              timeSpent: 540
            },
            {
              id: 'result-3',
              quizId: 'quiz-3',
              quizName: 'Vocabulaire anglais pour débutants',
              userId: userData.id,
              score: 75,
              correctAnswers: 15,
              totalQuestions: 20,
              completedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
              timeSpent: 900
            }
          ];
          
          setResults(mockResults);
          
          // Mock user progress
          const mockProgress: UserProgress = {
            quizzes_completed: 12,
            total_points: data.progress.total_points,
            average_score: data.progress.average_score || 0,
            badges: ['beginner', 'quick_learner'],
            streak: 5,
            categoryProgress: {
              'excel': { points: 85, quizzes_completed: 3 },
              'security': { points: 92, quizzes_completed: 2 },
              'english': { points: 75, quizzes_completed: 1 }
            }
          };
          
          setUserProgress(mockProgress);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données utilisateur",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
      {user && <ProfileHeader user={user} />}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="progress">Progression</TabsTrigger>
          <TabsTrigger value="results">Résultats</TabsTrigger>
          <TabsTrigger value="parrainage">Parrainage</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8 mt-6">
          <UserStats user={user} userProgress={userProgress} />
          <RecentResults results={results} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <CategoryProgress categories={categories} userProgress={userProgress} />
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          <RecentResults results={results} isLoading={isLoading} showAll />
        </TabsContent>
        
        <TabsContent value="parrainage" className="mt-6">
          <ParrainageSection />
        </TabsContent>
        
        <TabsContent value="badges" className="mt-6">
          <BadgesDisplay badges={userProgress.badges} />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
