import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, HelpCircle, Award, TrendingUp, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    stagiaires: 0,
    formations: 0,
    quizzes: 0,
    achievements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [stagiaireRes, formationRes, quizRes] = await Promise.all([
        api.get("/stagiaire/profile"),
        api.get("/catalogueFormations/with-formations"),
        api.get("/quiz"),
      ]);

      setStats({
        stagiaires: 150, // Exemple
        formations: formationRes.data?.data?.length || 0,
        quizzes: quizRes.data?.length || 0,
        achievements: 25,
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Stagiaires",
      value: stats.stagiaires,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Formations",
      value: stats.formations,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Quiz",
      value: stats.quizzes,
      icon: HelpCircle,
      color: "bg-purple-500",
    },
    {
      title: "Achievements",
      value: stats.achievements,
      icon: Award,
      color: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bienvenue sur le panneau d'administration
          </h2>
          <p className="text-gray-600 mt-2">
            Gérez tous les aspects de votre plateforme de formation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.color} p-2 rounded-lg`}>
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">+2.5% ce mois</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={20} />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">
                    Nouveau stagiaire inscrit
                  </p>
                  <p className="text-sm text-gray-500">Il y a 2 heures</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Nouveau
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">
                    Quiz complété
                  </p>
                  <p className="text-sm text-gray-500">Il y a 4 heures</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Complété
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">
                    Formation créée
                  </p>
                  <p className="text-sm text-gray-500">Il y a 1 jour</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  Créé
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tâches rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/admin/stagiaires"
                    className="text-blue-600 hover:underline">
                    → Gérer les stagiaires
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/formations"
                    className="text-blue-600 hover:underline">
                    → Créer une formation
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/quiz"
                    className="text-blue-600 hover:underline">
                    → Ajouter un quiz
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/catalogue"
                    className="text-blue-600 hover:underline">
                    → Gérer le catalogue
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taux de complétion</span>
                  <span className="font-bold text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-gray-600">Utilisateurs actifs</span>
                  <span className="font-bold text-gray-900">124</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
