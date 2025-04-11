
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Users, BookOpen, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-montserrat">Panneau d'administration</h1>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="font-nunito">Utilisateurs</TabsTrigger>
          <TabsTrigger value="courses" className="font-nunito">Formations</TabsTrigger>
          <TabsTrigger value="quizzes" className="font-nunito">Quizz</TabsTrigger>
          <TabsTrigger value="stats" className="font-nunito">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-montserrat">Stagiaires</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-nunito">347</div>
                <p className="text-xs text-muted-foreground font-roboto">
                  +12 ce mois-ci
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-montserrat">Nouveaux inscrits</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-nunito">24</div>
                <p className="text-xs text-muted-foreground font-roboto">
                  +4 cette semaine
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Gestion des utilisateurs</CardTitle>
              <CardDescription className="font-roboto">
                Gérez les stagiaires, administrateurs et formateurs.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Link to="/admin/users">
                <Button className="font-nunito">Accéder à la gestion des utilisateurs</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-montserrat">Formations</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-nunito">26</div>
                <p className="text-xs text-muted-foreground font-roboto">
                  Dans 4 catégories
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Gestion des formations</CardTitle>
              <CardDescription className="font-roboto">
                Ajoutez, modifiez ou supprimez des formations.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Link to="/admin/courses">
                <Button className="font-nunito">Accéder à la gestion des formations</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quizzes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Gestion des quizz</CardTitle>
              <CardDescription className="font-roboto">
                Créez et gérez les quizz pour chaque formation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Link to="/admin/quizzes">
                <Button className="font-nunito">Accéder à la gestion des quizz</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-montserrat">Quiz complétés</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-nunito">1,248</div>
                <p className="text-xs text-muted-foreground font-roboto">
                  +128 cette semaine
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Statistiques globales</CardTitle>
              <CardDescription className="font-roboto">
                Visualisez les performances et l'engagement des stagiaires.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Link to="/admin/stats">
                <Button className="font-nunito">Accéder aux statistiques</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminPage;
