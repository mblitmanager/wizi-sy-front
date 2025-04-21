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
import ContactsSection from '@/components/Profile/ContactsSection';
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
            id: name.toString(),
            name: name.toString(),
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
              quiz_id: 'quiz-1',
              user_id: userData.id,
              score: 85,
              correct_answers: 17,
              total_questions: 20,
              completed_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              time_spent: 720,
              max_streak: 5,
              mode: 'normal'
            },
            {
              id: 'result-2',
              quiz_id: 'quiz-2',
              user_id: userData.id,
              score: 92,
              correct_answers: 11,
              total_questions: 12,
              completed_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
              time_spent: 540,
              max_streak: 8,
              mode: 'normal'
            },
            {
              id: 'result-3',
              quiz_id: 'quiz-3',
              user_id: userData.id,
              score: 75,
              correct_answers: 15,
              total_questions: 20,
              completed_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
              time_spent: 900,
              max_streak: 3,
              mode: 'normal'
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
        <TabsList className="flex flex-wrap justify-start gap-2 mb-6">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-3 py-2">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="progress" className="text-xs sm:text-sm px-3 py-2">Progression</TabsTrigger>
          <TabsTrigger value="results" className="text-xs sm:text-sm px-3 py-2">Résultats</TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs sm:text-sm px-3 py-2">Contacts</TabsTrigger>
          <TabsTrigger value="parrainage" className="text-xs sm:text-sm px-3 py-2">Parrainage</TabsTrigger>
          <TabsTrigger value="badges" className="text-xs sm:text-sm px-3 py-2">Badges</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm px-3 py-2">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <UserStats user={user} userProgress={userProgress} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 font-montserrat">Résultats récents</h3>
              <RecentResults results={results} isLoading={isLoading} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <CategoryProgress categories={categories} userProgress={userProgress} />
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <RecentResults results={results} isLoading={isLoading} showAll />
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <ContactsSection />
          </div>
        </TabsContent>
        
        <TabsContent value="parrainage" className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <ParrainageSection />
          </div>
        </TabsContent>
        
        <TabsContent value="badges" className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <BadgesDisplay badges={userProgress.badges} />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <NotificationSettings />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 space-y-12">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold font-montserrat mb-4">Mes formations</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {formations.map((formation) => (
              <div key={formation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h3 className="font-medium font-nunito">{formation.titre}</h3>
                <p className="text-sm text-muted-foreground mt-1">{formation.description}</p>
              </div>
            ))}
          </div>
        </div>

        {userProgress && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold font-montserrat mb-4">Progression globale</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Quizzes complétés</p>
                <p className="text-lg font-semibold font-nunito">{userProgress.quizzes_completed}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Points totaux</p>
                <p className="text-lg font-semibold font-nunito">{userProgress.total_points}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <p className="text-lg font-semibold font-nunito">{userProgress.average_score}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
