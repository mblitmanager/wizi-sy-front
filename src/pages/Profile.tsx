import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import ProfileTabs from '@/components/Profile/ProfileTabs';
import FormationCatalogue from '@/components/Profile/FormationCatalogue';
import StatsSummary from '@/components/Profile/StatsSummary';
import { quizService } from '@/services/quizServiceA';
import { rankingService } from '@/services/rankingService';
import { User } from '@/types/index';
import { QuizResult, Category, UserProgress } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userServiceA';
import { formationService } from '@/services/formationServiceA';
import { Stagiaire } from '@/types/stagiaire';
import { Layout } from "@/components/layout/Layout";

const mapStagiaireToUser = (stagiaire: Stagiaire): User => ({
  id: stagiaire.id.toString(),
  username: stagiaire.prenom,
  email: '', // Email not available in Stagiaire type
  role: 'stagiaire', // Using fixed value since Stagiaire type doesn't match User type exactly
  level: 1, // Default level since not available in Stagiaire type
  points: 0, // Default points since not available in Stagiaire type
});

const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get('tab') || 'overview';
  
  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  const [rankings, setRankings] = useState<any[]>([]);
  const { toast } = useToast();
  const [formations, setFormations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch profile data
        const profileData = await userService.getProfile();
        if (profileData && profileData.stagiaire) {
          const user = mapStagiaireToUser(profileData.stagiaire);
          setUser(user);
        }
        
        // Fetch quiz results
        const quizResults = await quizService.getUserResults();
        setResults(quizResults || []);
        
        // Fetch categories
        const categoriesData = await quizService.getQuizCategories();
        if (categoriesData && Array.isArray(categoriesData)) {
          const categoriesWithColors = categoriesData.map((name, index) => ({
            id: name?.toString() || `category-${index}`,
            name: name?.toString() || `Category ${index}`,
            description: `Quizzes dans la catégorie ${name || index}`,
            color: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6],
            colorClass: ['category-blue-500', 'category-green-500', 'category-yellow-500', 'category-red-500', 'category-purple-500', 'category-pink-500'][index % 6],
            quizCount: 0
          }));
          setCategories(categoriesWithColors);
        }
        
        // Fetch user progress
        const progressData = await rankingService.getUserProgress();
        if (progressData && progressData.total) {
          // Créer un objet conforme à l'interface UserProgress
          const userProgressData: UserProgress = {
            id: progressData.id || '',
            stagiaire_id: progressData.stagiaire_id || '',
            total_points: progressData.total.points || 0,
            completed_quizzes: progressData.total.completed_quizzes || 0,
            average_score: progressData.total.average_score || 0,
            current_streak: progressData.current_streak || 0,
            longest_streak: progressData.longest_streak || 0,
            last_quiz_date: progressData.last_quiz_date || '',
            category_progress: progressData.by_category || {}
          };
          setUserProgress(userProgressData);
        }
        
        // Fetch rankings
        const rankingsData = await rankingService.getGlobalRanking();
        setRankings(rankingsData || []);
        
        // Fetch formations
        const formationsData = await formationService.getFormationsByStagiaire();
        setFormations(formationsData?.data || []);
        
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
  }, [toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">Chargement...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>Error: {error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
        {user && <ProfileHeader user={user} />}
        <div className="mt-16 space-y-12">
          
          {userProgress && <StatsSummary userProgress={userProgress} />}
          <FormationCatalogue formations={formations} />
        </div>
        <ProfileTabs
          user={user}
          results={results}
          categories={categories}
          userProgress={userProgress}
          isLoading={isLoading}
          rankings={rankings}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />

    
      </div>
    </Layout>
  );
};

export default ProfilePage;
