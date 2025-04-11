
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StatsPage: React.FC = () => {
  const { isAdmin } = useAuth();

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // Données fictives pour les graphiques
  const completionData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Quiz Complétés',
        data: [65, 78, 90, 81, 110, 125],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryData = {
    labels: ['Dev Web', 'Bases de données', 'UX/UI', 'Cybersécurité', 'IA', 'Cloud'],
    datasets: [
      {
        label: 'Quiz par catégorie',
        data: [25, 18, 15, 20, 12, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const progressData = {
    labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
    datasets: [
      {
        label: 'Score moyen',
        data: [72, 75, 82, 85],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-montserrat">Statistiques</h1>

      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary" className="font-nunito">Résumé</TabsTrigger>
          <TabsTrigger value="courses" className="font-nunito">Formations</TabsTrigger>
          <TabsTrigger value="users" className="font-nunito">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Complétion des Quiz</CardTitle>
                <CardDescription className="font-roboto">Nombre de quiz complétés par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={completionData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Répartition par Catégorie</CardTitle>
                <CardDescription className="font-roboto">Nombre de quiz par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart data={categoryData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Progression des Scores</CardTitle>
              <CardDescription className="font-roboto">Évolution du score moyen sur les 4 dernières semaines</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart data={progressData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Statistiques par Formation</CardTitle>
              <CardDescription className="font-roboto">
                Détails de performance pour chaque formation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 font-roboto">Fonctionnalité en développement...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Statistiques par Utilisateur</CardTitle>
              <CardDescription className="font-roboto">
                Analyse de l'activité des utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 font-roboto">Fonctionnalité en développement...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsPage;
