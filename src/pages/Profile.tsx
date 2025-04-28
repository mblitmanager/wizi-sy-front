
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
import { Classement } from "@/components/quiz/Classement"; // Fixed: Correct capitalization
import { motion } from "framer-motion";

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold hover:text-primary transition-colors">Mon profil</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.name || "Stagiaire"}
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-4 z-10 w-full justify-start rounded-lg border p-1">
            <TabsTrigger value="overview" className="relative">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="formation" className="relative">
              Formation
            </TabsTrigger>
            <TabsTrigger value="contacts" className="relative">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="platform" className="relative">
              Plateforme
            </TabsTrigger>
            <TabsTrigger value="classement" className="relative">
              Classement
            </TabsTrigger>
          </TabsList>

          <TabsContent 
            value="overview" 
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <QuickAccess
                recentQuizzes={quizzes || []}
                demoQuizzes={[]}
                totalScore={progress?.totalPoints || 0}
                rank={progress?.rank || 0}
              />
            </motion.div>
            {parrainageStats && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ReferralSystem
                  referralCode={parrainageStats.referralCode}
                  totalReferrals={parrainageStats.totalReferrals}
                  referralRewards={parrainageStats.rewards}
                />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="formation">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentFormation
                currentFormation={currentFormation}
                completedFormations={completedFormations}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="contacts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {contacts && <ContactSection contacts={contacts} />}
            </motion.div>
          </TabsContent>

          <TabsContent value="platform">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PlatformInfo />
            </motion.div>
          </TabsContent>

          <TabsContent value="classement">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Classement />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Profile;
