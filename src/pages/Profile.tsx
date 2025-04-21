import { Layout } from "@/components/layout/Layout";
import ContactSection from "@/components/profile/ContactSection";
import CurrentFormation from "@/components/profile/CurrentFormation";
import QuickAccess from "@/components/profile/QuickAccess";
import PlatformInfo from "@/components/profile/PlatformInfo";
import ReferralSystem from "@/components/profile/ReferralSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";

const Profile = () => {
  const { user } = useUser();

  // Données mockées pour la démonstration
  const mockData = {
    contacts: {
      formateur: {
        name: "Jean Dupont",
        role: "Formateur",
        email: "jean.dupont@example.com",
        phone: "01 23 45 67 89",
      },
      commercial: {
        name: "Marie Martin",
        role: "Commercial",
        email: "marie.martin@example.com",
        phone: "01 98 76 54 32",
      },
      relationClient: {
        name: "Sophie Bernard",
        role: "Relation Client",
        email: "sophie.bernard@example.com",
        phone: "01 11 22 33 44",
      },
    },
    currentFormation: {
      id: "1",
      title: "Formation Excel Avancé",
      progress: 65,
      startDate: "2024-03-01",
      endDate: "2024-04-30",
      status: "current" as const,
    },
    completedFormations: [
      {
        id: "2",
        title: "Formation Word",
        progress: 100,
        startDate: "2024-01-01",
        endDate: "2024-02-28",
        status: "completed" as const,
      },
    ],
    recentQuizzes: [
      {
        id: "1",
        title: "Excel - Formules avancées",
        category: "Excel",
      },
      {
        id: "2",
        title: "Excel - Tableaux croisés",
        category: "Excel",
      },
    ],
    demoQuizzes: [
      {
        id: "3",
        title: "PowerPoint - Introduction",
        category: "PowerPoint",
        isDemo: true,
      },
      {
        id: "4",
        title: "Access - Bases de données",
        category: "Access",
        isDemo: true,
      },
      {
        id: "5",
        title: "Word - Mise en page",
        category: "Word",
        isDemo: true,
      },
    ],
    totalScore: 1250,
    rank: 42,
    referralCode: "QUIZZY2024",
    totalReferrals: 3,
    referralRewards: {
      points: 150,
      quizzes: 2,
    },
  };

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
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <QuickAccess
              recentQuizzes={mockData.recentQuizzes}
              demoQuizzes={mockData.demoQuizzes}
              totalScore={mockData.totalScore}
              rank={mockData.rank}
            />
            <ReferralSystem
              referralCode={mockData.referralCode}
              totalReferrals={mockData.totalReferrals}
              referralRewards={mockData.referralRewards}
            />
          </TabsContent>

          <TabsContent value="formation" className="space-y-6">
            <CurrentFormation
              currentFormation={mockData.currentFormation}
              completedFormations={mockData.completedFormations}
            />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactSection contacts={mockData.contacts} />
          </TabsContent>

          <TabsContent value="platform">
            <PlatformInfo />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
