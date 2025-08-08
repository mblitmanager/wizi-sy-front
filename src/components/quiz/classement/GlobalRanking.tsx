import { useState, useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Medal,
  Award,
  User,
  LayoutList,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LeaderboardEntry } from "@/types/quiz";

export interface GlobalRankingProps {
  ranking?: LeaderboardEntry[];
  loading?: boolean;
  currentUserId?: string;
}

type SortKey = "rang" | "name" | "quizCount" | "averageScore" | "score";
type SortOrder = "asc" | "desc";

export function GlobalRanking({
  ranking = [],
  loading = false,
  currentUserId,
}: GlobalRankingProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rang");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [search, setSearch] = useState("");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredRanking = useMemo(() => {
    return ranking.filter((entry: any) =>
      entry.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [ranking, search]);

  const sortedRanking = useMemo(() => {
    return [...filteredRanking].sort((a: any, b: any) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      if (sortKey === "name") {
        aValue = aValue?.toLowerCase() || "";
        bValue = bValue?.toLowerCase() || "";
      }

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRanking, sortKey, sortOrder]);

  // Calcul des totaux
  const totalPoints = sortedRanking.reduce(
    (sum, entry) => sum + (entry.score || 0),
    0
  );
  const totalQuizzes = sortedRanking.reduce(
    (sum, entry) => sum + (entry.quizCount || 0),
    0
  );
  const maxScore = Math.max(
    ...sortedRanking.map((entry) => entry.score || 0),
    1
  );

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronUp className="h-4 w-4 opacity-0" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <Card className="border rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutList className="h-6 w-6" />
            <span>Classement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-md bg-gray-100 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-10 bg-gray-200 rounded" />
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-4 border-b bg-gradient-to-r ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Classement Général
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un stagiaire..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="p-4 border-b bg-gray-50">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-xs border">
            <div className="text-sm text-gray-500">Participants</div>
            <div className="text-2xl font-bold">{sortedRanking.length}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-xs border">
            <div className="text-sm text-gray-500">Total Points</div>
            <div className="text-2xl font-bold">{totalPoints}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-xs border">
            <div className="text-sm text-gray-500">Total Quiz</div>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
          </div>
          {/* <div className="bg-white p-3 rounded-lg shadow-xs border">
            <div className="text-sm text-gray-500">Moyenne</div>
            <div className="text-2xl font-bold">
              {sortedRanking.length > 0
                ? Math.round(totalPoints / sortedRanking.length)
                : 0}
            </div>
          </div> */}
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">
        {/* Mobile View */}
        <div className="sm:hidden space-y-3">
          {sortedRanking.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                <Trophy className="w-full h-full" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">
                Aucun résultat
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun stagiaire ne correspond à votre recherche
              </p>
            </div>
          ) : (
            sortedRanking.map((entry, index) => {
              const isCurrentUser = entry.id?.toString() === currentUserId;
              const percentage = Math.round(
                ((entry.score || 0) / maxScore) * 100
              );

              return (
                <div
                  key={entry.id || index}
                  className={`p-4 rounded-lg border shadow-xs ${
                    isCurrentUser
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center h-10 w-10 rounded-full ${
                          index < 3
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        } font-bold`}>
                        {entry.rang || index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="font-medium text-gray-900">
                            {entry.name || "Inconnu"}
                          </h3>
                          {isCurrentUser && (
                            <Badge
                              variant="secondary"
                              className="px-1.5 py-0.5 text-xs">
                              Vous
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entry.quizCount} quiz complétés
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {entry.score}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span>{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          {sortedRanking.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                <Trophy className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Aucun résultat
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun stagiaire ne correspond à votre recherche
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border shadow-xs">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("rang")}>
                      <div className="flex items-center gap-1">
                        Rang
                        <SortIcon column="rang" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">
                        Stagiaire
                        <SortIcon column="name" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("quizCount")}>
                      <div className="flex items-center gap-1">
                        Quiz
                        <SortIcon column="quizCount" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("score")}>
                      <div className="flex items-center gap-1">
                        Points
                        <SortIcon column="score" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progression
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedRanking.map((entry, index) => {
                    const isCurrentUser =
                      entry.id?.toString() === currentUserId;
                    const percentage = Math.round(
                      ((entry.score || 0) / maxScore) * 100
                    );

                    return (
                      <tr
                        key={entry.id || index}
                        className={
                          isCurrentUser ? "bg-blue-50" : "hover:bg-gray-50"
                        }>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`flex items-center justify-center h-8 w-8 rounded-full ${
                              index < 3
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            } font-bold`}>
                            {entry.rang || index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={entry.avatar} />
                              <AvatarFallback>
                                {entry.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {entry.name || "Inconnu"}
                              </span>
                              {isCurrentUser && (
                                <Badge
                                  variant="secondary"
                                  className="px-1.5 py-0.5 text-xs">
                                  Vous
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {entry.quizCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">
                          {entry.score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Progress value={percentage} className="h-2 w-32" />
                            <span className="text-sm text-gray-500">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
