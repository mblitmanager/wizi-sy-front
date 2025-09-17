import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import useDisplaySettings from "@/hooks/useDisplaySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProfileSettings from "@/components/profile/ProfileSettings";
import { ErrorState } from "@/components/quiz/quiz-play/ErrorState";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useAuth";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useUser();
  const { settings, setInterfaceChoice, setShowTutorials, reset } =
    useDisplaySettings();

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
            <TabsTrigger value="display">Affichage</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="display">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Affichage</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Interface</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez le style d'affichage pour les quiz.
                  </p>

                  <div className="mt-3 flex gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="interface"
                        value="classic"
                        checked={settings.interfaceChoice === "classic"}
                        onChange={() => setInterfaceChoice("classic")}
                      />
                      <span>Classique</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="interface"
                        value="modern"
                        checked={settings.interfaceChoice === "modern"}
                        onChange={() => setInterfaceChoice("modern")}
                      />
                      <span>Moderne</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="interface"
                        value="compact"
                        checked={settings.interfaceChoice === "compact"}
                        onChange={() => setInterfaceChoice("compact")}
                      />
                      <span>Compact</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Afficher les didacticiels</h3>
                    <p className="text-sm text-muted-foreground">
                      Activer pour afficher les guides et conseils lors des
                      quiz.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showTutorials}
                    onChange={(e) => setShowTutorials(e.target.checked)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={reset} className="mr-2">
                    Réinitialiser
                  </Button>
                  <Button>Enregistrer</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <p className="text-muted-foreground">
                Configurez vos préférences de notifications ici. Cette section
                sera bientôt disponible.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
              <p className="text-muted-foreground">
                Gérez vos paramètres de sécurité ici. Cette section sera bientôt
                disponible.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
