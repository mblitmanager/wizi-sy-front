import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, CheckCircle, TrendingUp } from "lucide-react";

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
    <div className="container mx-auto mb-10 p-4 sm:p-6 border rounded-2xl bg-white shadow-xl dark:bg-gray-900 dark:border-gray-800">
      {/* Titre */}
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-xl md:text-2xl font-bold text-[#FEB823] dark:text-yellow-400">
          Mes statistiques
        </h2>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {/* Carte Statistique */}
        {[
          {
            label: "Score total",
            icon: <TrendingUp size={20} />,
            value: stats.totalScore || 0,
            suffix: "",
          },
          {
            label: "Quiz complétés",
            icon: <CheckCircle size={20} />,
            value: stats.totalQuizzes || 0,
            suffix: "",
          },
          {
            label: "Score moyen",
            icon: <BarChart2 size={20} />,
            value: stats.averageScore
              ? `${Math.round(stats.averageScore)}%`
              : "0%",
            suffix: "",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl bg-yellow-100 dark:bg-yellow-700 text-yellow-900 dark:text-white shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 min-h-[120px] flex items-center"
          >
            <div className="mr-4 flex items-center justify-center w-10 h-10 rounded-full bg-yellow-300/50 dark:bg-yellow-800">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                {stat.label}
              </p>
              <p className="text-xl font-bold mt-1">
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
