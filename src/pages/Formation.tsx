import { Layout } from "@/components/layout/Layout";
import { Formation as FormationComponent } from "@/components/quiz/Formation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Video, FileText, Brain } from "lucide-react";

const Formation = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Formations et Tutoriels</h1>
          <p className="text-muted-foreground">
            Découvrez nos formations interactives et tutoriels pour progresser à votre rythme
          </p>
        </div>

        <Tabs defaultValue="formations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="formations" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Formations
            </TabsTrigger>
            <TabsTrigger value="tutoriels" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Tutoriels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formations">
            <FormationComponent />
          </TabsContent>

          <TabsContent value="tutoriels">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Tutoriel Vidéo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Apprenez à travers des vidéos explicatives et des démonstrations pratiques.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Consultez nos articles détaillés pour approfondir vos connaissances.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Exercices Pratiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Mettez en pratique vos connaissances avec des exercices interactifs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Formation; 