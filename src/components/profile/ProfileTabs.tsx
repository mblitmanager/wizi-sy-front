
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserStats from '@/components/profile/UserStats';
import { RecentResults } from '@/components/profile/RecentResults';
import BadgesDisplay from '@/components/profile/BadgesDisplay';
import CategoryProgress from '@/components/profile/CategoryProgress';
import NotificationSettings from '@/components/profile/NotificationSettings';
import ParrainageSection from '@/components/profile/ParrainageSection';
import ContactsSection from '@/components/profile/ContactsSection';
import RankingComponent from '@/components/Ranking/RankingComponent';
import { User } from '@/types';
import { Category, QuizResult, UserProgress } from '@/types/quiz';

interface ProfileTabsProps {
  user: User | null;
  results: QuizResult[];
  categories: Category[];
  userProgress: UserProgress | null;
  isLoading: boolean;
  rankings: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  user, 
  results, 
  categories, 
  userProgress, 
  isLoading,
  rankings,
  activeTab,
  setActiveTab
}) => {
  // Transform rankings data to ensure we have all required properties with valid values
  const safeRankings = rankings.map((entry, index) => ({
    stagiaire: {
      id: entry?.stagiaire?.id || entry?.id?.toString() || `rank-${index}`,
      prenom: entry?.stagiaire?.prenom || entry?.prenom || 'Anonyme',
      image: null
    },
    totalPoints: entry?.totalPoints || entry?.points || 0,
    quizCount: entry?.quizCount || entry?.completed_quizzes || 0,
    averageScore: entry?.averageScore || entry?.average_score || 0,
    rang: entry?.rang || index + 1
  }));

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
      <TabsList className="flex flex-wrap justify-start gap-2 mb-6">
        <TabsTrigger value="overview" className="text-xs sm:text-sm px-3 py-2">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="progress" className="text-xs sm:text-sm px-3 py-2">Progression</TabsTrigger>
        <TabsTrigger value="results" className="text-xs sm:text-sm px-3 py-2">Résultats</TabsTrigger>
        <TabsTrigger value="contacts" className="text-xs sm:text-sm px-3 py-2">Contacts</TabsTrigger>
        <TabsTrigger value="classement" className="text-xs sm:text-sm px-3 py-2">Classement</TabsTrigger>
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
          <RecentResults results={results} isLoading={isLoading} showAll={true} />
        </div>
      </TabsContent>

      <TabsContent value="contacts" className="mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <ContactsSection />
        </div>
      </TabsContent>

      <TabsContent value="classement" className="mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4 font-montserrat">Classement Global</h3>
          <RankingComponent rankings={safeRankings} />
        </div>
      </TabsContent>
      
      <TabsContent value="parrainage" className="mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <ParrainageSection />
        </div>
      </TabsContent>
      
      <TabsContent value="badges" className="mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <BadgesDisplay />
        </div>
      </TabsContent>
      
      <TabsContent value="settings" className="mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <NotificationSettings />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
