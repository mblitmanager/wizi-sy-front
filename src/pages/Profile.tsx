import { Layout } from "@/components/layout/Layout";
import ContactSection from "@/components/profile/ContactSection";
import CurrentFormation from "@/components/profile/CurrentFormation";
import QuickAccess from "@/components/profile/QuickAccess";
import PlatformInfo from "@/components/profile/PlatformInfo";
import ReferralSystem from "@/components/profile/ReferralSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/ProfileService";
import { Loader2 } from "lucide-react";
import { Profil } from "@/components/quiz/Profil";

const Profile = () => {
  const { user } = useUser();

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => profileService.getContacts(),
  });

  const { data: formations, isLoading: formationsLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: () => profileService.getFormations(),
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: () => profileService.getProgress(),
  });

  const { data: parrainageStats, isLoading: parrainageLoading } = useQuery({
    queryKey: ["parrainage"],
    queryFn: () => profileService.getParrainageStats(),
  });

  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["stagiaire-quizzes"],
    queryFn: () => profileService.getQuizzes(),
  });

  const isLoading = contactsLoading || formationsLoading || progressLoading || 
                    parrainageLoading || quizzesLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const currentFormation = formations?.find(f => f.status === 'current');
  const completedFormations = formations?.filter(f => f.status === 'completed') || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mon profil</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.name || "Stagiaire"}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="formation">Formation</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="platform">Plateforme</TabsTrigger>
            <TabsTrigger value="classement">Classement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <QuickAccess
              recentQuizzes={quizzes || []}
              demoQuizzes={[]}
              totalScore={progress?.totalPoints || 0}
              rank={progress?.rank || 0}
            />
            {parrainageStats && (
              <ReferralSystem
                referralCode={parrainageStats.referralCode}
                totalReferrals={parrainageStats.totalReferrals}
                referralRewards={parrainageStats.rewards}
              />
            )}
          </TabsContent>

          <TabsContent value="formation" className="space-y-6">
            <CurrentFormation
              currentFormation={currentFormation}
              completedFormations={completedFormations}
            />
          </TabsContent>

          <TabsContent value="contacts">
            {contacts && <ContactSection contacts={contacts} />}
          </TabsContent>

          <TabsContent value="platform">
            <PlatformInfo />
          </TabsContent>

          <TabsContent value="classement">
            <Profil />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
