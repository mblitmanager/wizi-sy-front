
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, CheckCircle, TrendingUp, Award, Star } from "lucide-react";

export interface ProfileStatsProps {
  profile: any;
  stats: any;
  loading?: boolean;
}

export function ProfileStats({
  profile,
  stats,
  loading = false,
}: ProfileStatsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des statistiques...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 animate-pulse rounded-md"
                />
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Aucune statistique disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto mb-10 p-4 sm:p-6 border rounded-2xl bg-gradient-to-br from-white to-yellow-50 shadow-xl dark:bg-gray-900 dark:border-gray-800">
      {/* Titre avec animation */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400 animate-fade-in">
          <span className="inline-block animate-bounce-slow">🏆</span> Mes statistiques
        </h2>
        <p className="text-sm text-gray-500 mt-1">Suivez votre progression</p>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          {
            label: "Score total",
            icon: <TrendingUp size={20} className="text-emerald-600" />,
            value: stats.totalScore || 0,
            suffix: " pts",
            color: "from-emerald-100 to-emerald-50",
            iconBg: "bg-emerald-200",
            textColor: "text-emerald-800"
          },
          {
            label: "Quiz complétés",
            icon: <CheckCircle size={20} className="text-blue-600" />,
            value: stats.totalQuizzes || 0,
            suffix: "",
            color: "from-blue-100 to-blue-50",
            iconBg: "bg-blue-200",
            textColor: "text-blue-800"
          },
          {
            label: "Score moyen",
            icon: <BarChart2 size={20} className="text-purple-600" />,
            value: stats.averageScore
              ? `${Math.round(stats.averageScore)}%`
              : "0%",
            suffix: "",
            color: "from-purple-100 to-purple-50",
            iconBg: "bg-purple-200",
            textColor: "text-purple-800"
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 min-h-[120px] flex items-center`}
          >
            <div className={`mr-4 flex items-center justify-center w-12 h-12 rounded-full ${stat.iconBg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>
                {stat.value}
                {stat.suffix}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
