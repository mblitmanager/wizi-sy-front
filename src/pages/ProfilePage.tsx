import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import UserStats from '@/components/Profile/UserStats';
import { RecentResults } from '@/components/Profile/RecentResults';
import BadgesDisplay from '@/components/Profile/BadgesDisplay';
import CategoryProgress from '@/components/Profile/CategoryProgress';
import NotificationSettings from '@/components/Profile/NotificationSettings';
import ParrainageSection from '@/components/Profile/ParrainageSection';
import { quizService } from '@/services/quizService';
import { progressService } from '@/services/progressService';
import { User } from '@/types/index';
import { QuizResult, Category, UserProgress } from '@/types/quiz';
import { useToast } from '@/components/ui/use-toast';
import { userService } from '../services/userService';
import { formationService } from '../services/formationService';
import { Formation } from '../types';
import { Stagiaire } from '../types/stagiaire';

const mapStagiaireToUser = (stagiaire: Stagiaire): User => ({
  id: stagiaire.id.toString(),
  username: stagiaire.prenom,
  email: '', // Email not available in Stagiaire type
  role: stagiaire.role,
  level: 1, // Default level since not available in Stagiaire type
  points: 0, // Default points since not available in Stagiaire type
  name: stagiaire.prenom
});

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
  const [profile, setProfile] = useState<User | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [error, setError] = useState<string | null>(null);

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
            username: stagiaire.prenom,
            email: '', // Email not available in Stagiaire type
            role: stagiaire.role,
            level: 1, // Default level since not available in Stagiaire type
            points: 0, // Default points since not available in Stagiaire type
            name: stagiaire.prenom
          };
          
          setUser(userData);
          
          // Fetch categories
          const categoriesData = await quizService.getQuizCategories();
          const categoriesWithColors = categoriesData.map((name, index) => ({
            id: name,
            name: name,
            description: `Quizzes dans la catégorie ${name}`,
            color: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6],
            colorClass: ['category-blue-500', 'category-green-500', 'category-yellow-500', 'category-red-500', 'category-purple-500', 'category-pink-500'][index % 6],
            quizCount: 0
          }));
          setCategories(categoriesWithColors);
          
          // Mock quiz results (in a real app, you should fetch this from an API)
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
          
          // Update user progress with API data
          const progress: UserProgress = {
            quizzes_completed: data.progress.quizzes_completed || 0,
            total_points: data.progress.total_points || 0,
            average_score: data.progress.average_score || 0,
            badges: data.progress.badges || [],
            streak: data.progress.streak || 0,
            categoryProgress: data.progress.categoryProgress || {}
          };
          
          setUserProgress(progress);
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileData, formationsData] = await Promise.all([
          userService.getProfile(),
          formationService.getFormationsByStagiaire()
        ]);

        const mapStagiaireToUser = (stagiaire: Stagiaire): User => ({
          id: stagiaire.id.toString(),
          username: stagiaire.prenom,
          email: '', // Email not available in Stagiaire type
          role: stagiaire.role,
          level: 1, // Default level since not available in Stagiaire type
          points: 0, // Default points since not available in Stagiaire type
          name: stagiaire.prenom
        });

        setProfile(mapStagiaireToUser(profileData.stagiaire));
        setFormations(formationsData.data as Formation[]);
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error('Error fetching profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileUpdate = async (data: Partial<User>) => {
    try {
      await userService.updateProfile(data);
      // Refresh profile data
      const updatedProfile = await userService.getProfile();
      setProfile(mapStagiaireToUser(updatedProfile.stagiaire));
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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

      <div>
        <h2>Formations</h2>
        {formations.map((formation) => (
          <div key={formation.id}>
            <h3>{formation.titre}</h3>
            <p>{formation.description}</p>
          </div>
        ))}
      </div>

      {userProgress && (
        <div>
          <h2>Progress</h2>
          <p>Quizzes completed: {userProgress.quizzes_completed}</p>
          <p>Total points: {userProgress.total_points}</p>
          <p>Average score: {userProgress.average_score}%</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
