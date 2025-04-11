
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockAPI } from '@/api/mockAPI';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import BadgesDisplay from '@/components/Profile/BadgesDisplay';
import CategoryProgress from '@/components/Profile/CategoryProgress';
import UserStats from '@/components/Profile/UserStats';
import RecentResults from '@/components/Profile/RecentResults';
import NotificationSettings from '@/components/Profile/NotificationSettings';
import { Card, CardContent } from '@/components/ui/card';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  // Get user's recent quiz results and progress
  const recentResults = mockAPI.getRecentQuizResults(user?.id || '');
  const userProgress = mockAPI.getUserProgress(user?.id || '');
  
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
          
          <CategoryProgress progress={userProgress} />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <BadgesDisplay badges={userProgress.badges} />
          <UserStats userId={user?.id || ''} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
