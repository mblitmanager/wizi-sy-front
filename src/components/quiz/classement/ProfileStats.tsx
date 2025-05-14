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
    <div className="container mx-auto mb-2 sm:p-4 border rounded-xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
      {/* Titre */}
      <div className="mb-4 text-center md:text-left">
        <h3 className="text-lg md:text-xl font-semibold text-[#FEB823] dark:text-yellow-400">
          Mes statistiques
        </h3>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Score total",
            icon: <TrendingUp size={18} className="text-yellow-500" />,
            value: stats.totalScore || 0,
            suffix: "",
          },
          {
            label: "Quiz complétés",
            icon: <CheckCircle size={18} className="text-green-500" />,
            value: stats.totalQuizzes || 0,
            suffix: "",
          },
          {
            label: "Score moyen",
            icon: <BarChart2 size={18} className="text-blue-500" />,
            value: stats.averageScore
              ? `${Math.round(stats.averageScore)}%`
              : "0%",
            suffix: "",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-yellow-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-600">
              {stat.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
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
