
import { Layout } from "@/components/layout/Layout";
import ContactSection from "@/components/profile/ContactSection";
import CurrentFormation from "@/components/profile/CurrentFormation";
import QuickAccess from "@/components/profile/QuickAccess";
import PlatformInfo from "@/components/profile/PlatformInfo";
import ReferralSystem from "@/components/profile/ReferralSystem";
import ProfileSettings from "@/components/profile/ProfileSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { userProfileService } from "@/services/ProfileService";
import { Loader2, User, Book, Phone, Info, Trophy, Settings } from "lucide-react";
import { Classement } from "@/components/quiz/Classement"; 
import { motion } from "framer-motion";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Contact, ContactResponse } from "@/types/contact";
import { Quiz } from "@/types/quiz";
import { Formation } from "@/types/stagiaire";

// Interface pour la formation utilisateur adaptée pour TypeScript
interface UserFormation {
  id: string; // Changé de number à string pour être compatible avec Formation
  title: string;
  description: string;
  progress?: number;
  startDate?: string;
  status: 'current' | 'completed' | 'pending';
}

// Interface pour la formation utilisateur adaptée pour TypeScript
interface UserFormation {
  id: number;
  title: string; // renommé depuis titre
  description: string;
  progress?: number;
  startDate?: string;
  status: 'current' | 'completed' | 'pending';
}

const Profile = () => {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => userProfileService.getContacts(),
  });

  const { data: formations, isLoading: formationsLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: async () => {
      const data = await userProfileService.getFormations();
      // Add status property to match expected format and convert id to string
      return data.map((f: any) => ({
        ...f,
        id: String(f.id), // Convertir en string
        title: f.titre || f.title || 'Formation sans titre',
        status: f.status || 'pending'
      })) as Formation[];
    }
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: () => userProfileService.getProgress(),
  });

  const { data: parrainageStats, isLoading: parrainageLoading } = useQuery({
    queryKey: ["parrainage"],
    queryFn: () => userProfileService.getParrainageStats(),
  });

  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["stagiaire-quizzes"],
    queryFn: async () => {
      const data = await userProfileService.getStagiaireQuizzes();
      // Ajouter les propriétés nécessaires pour être compatible avec Quiz
      return data.map((q: any) => ({
        ...q,
        id: String(q.id), // Convertir en string
        title: q.titre,
        category: 'N/A', // Valeur par défaut pour la catégorie
      })) as Quiz[];
    }
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

  const currentFormation = formations?.find(f => f.status === 'current') as Formation;
  const completedFormations = formations?.filter(f => f.status === 'completed') as Formation[];

  // Transform the rewards structure to match what ReferralSystem expects
  const referralRewards = parrainageStats?.rewards ? {
    points: parrainageStats.rewards.total || 0,
    quizzes: parrainageStats.rewards.received || 0
  } : { points: 0, quizzes: 0 };

  // Fonction pour formatter les données de contact
  const formatContactData = () => {
    if (!contacts) return { formateurs: [], commerciaux: [], pole_relation: [] };

    const ensureArray = (data: unknown) => Array.isArray(data) ? data : [];

    return {
      formateurs: ensureArray(contacts.formateurs),
      commerciaux: ensureArray(contacts.commerciaux),
      pole_relation: ensureArray((contacts as any).pole_relation ?? contacts.poleRelation)
    };
  };

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

        {isMobile ? (
          // Vue mobile avec un drawer
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full mb-4">
                {getTriggerLabel(activeTab)} <span className="ml-2">▼</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 space-y-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="flex flex-col w-full gap-2">
                    <TabsTrigger value="overview" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" /> Vue d'ensemble
                    </TabsTrigger>
                    <TabsTrigger value="formation" className="w-full justify-start">
                      <Book className="h-4 w-4 mr-2" /> Formation
                    </TabsTrigger>
                    <TabsTrigger value="contacts" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" /> Contacts
                    </TabsTrigger>
                    <TabsTrigger value="platform" className="w-full justify-start">
                      <Info className="h-4 w-4 mr-2" /> Plateforme
                    </TabsTrigger>
                    <TabsTrigger value="classement" className="w-full justify-start">
                      <Trophy className="h-4 w-4 mr-2" /> Classement
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" /> Paramètres
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          // Vue desktop avec tabs horizontales
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-4 z-10 w-full justify-start rounded-lg border p-1 overflow-x-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Vue d'ensemble</span>
                <span className="sm:hidden">Vue</span>
              </TabsTrigger>
              <TabsTrigger value="formation" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span className="hidden sm:inline">Formation</span>
                <span className="sm:hidden">Form</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Contacts</span>
                <span className="sm:hidden">Contacts</span>
              </TabsTrigger>
              <TabsTrigger value="platform" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Plateforme</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger value="classement" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Classement</span>
                <span className="sm:hidden">Rank</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Paramètres</span>
                <span className="sm:hidden">Param</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                recentQuizzes={quizzes ? (Array.isArray(quizzes) ? quizzes : []) : []}
                demoQuizzes={[]}
                totalScore={progress?.totalScore || 0}
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
                  referralCode={parrainageStats.referralCode || ''}
                  totalReferrals={parrainageStats.totalReferrals || 0}
                  referralRewards={referralRewards}
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
              <ContactSection contacts={formatContactData()} />
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
          
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileSettings />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

// Fonction utilitaire pour obtenir le libellé du tab actif
function getTriggerLabel(activeTab: string) {
  switch (activeTab) {
    case "overview":
      return "Vue d'ensemble";
    case "formation":
      return "Formation";
    case "contacts":
      return "Contacts";
    case "platform":
      return "Plateforme";
    case "classement":
      return "Classement";
    case "settings":
      return "Paramètres";
    default:
      return "Sélectionner une section";
  }
}

export default Profile;
