
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { progressAPI } from '@/api';
import { UserProgress, QuizResult, Category } from '@/types';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import BadgesDisplay from '@/components/Profile/BadgesDisplay';
import CategoryProgress from '@/components/Profile/CategoryProgress';
import UserStats from '@/components/Profile/UserStats';
import RecentResults from '@/components/Profile/RecentResults';
import NotificationSettings from '@/components/Profile/NotificationSettings';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [recentResults, setRecentResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch user progress data
        const progress = await progressAPI.getUserProgress(user.id);
        setUserProgress(progress);
        
        // Fetch categories from API
        const categoriesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://laravel.test/api'}/formations`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
        
        // Fetch recent quiz results
        const recentResultsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://laravel.test/api'}/stagiaires/${user.id}/formations`);
        if (recentResultsResponse.ok) {
          const userStatData = await recentResultsResponse.json();
          // The API might return results in a different format, so we're adapting it
          if (userStatData.recentResults) {
            setRecentResults(userStatData.recentResults);
          } else {
            // Create a fallback with empty results if the API doesn't provide this data
            setRecentResults([]);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger vos données de profil. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        
        // Fallback to empty data
        setUserProgress({
          completedQuizzes: 0,
          badges: [],
          streak: 0,
          totalPointsEarned: 0,
          rank: 0,
          categoryProgress: []
        });
        setRecentResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileHeader user={user} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentResults results={recentResults} />
          
          <Card>
            <CardContent className="pt-6">
              <NotificationSettings />
            </CardContent>
          </Card>
          
          <CategoryProgress categories={categories} userProgress={userProgress} />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <BadgesDisplay badges={userProgress?.badges || []} />
          <UserStats user={user} userProgress={userProgress} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
