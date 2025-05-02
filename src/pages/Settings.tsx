
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProfileSettings from "@/components/profile/ProfileSettings";
import { ErrorState } from "@/components/quiz/quiz-play/ErrorState";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useUser();

  if (!user) {
    return (
      <Layout>
        <ErrorState 
          title="Accès non autorisé" 
          description="Vous devez être connecté pour accéder à cette page."
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <p className="text-muted-foreground">
                Configurez vos préférences de notifications ici. Cette section sera bientôt disponible.
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
              <p className="text-muted-foreground">
                Gérez vos paramètres de sécurité ici. Cette section sera bientôt disponible.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
