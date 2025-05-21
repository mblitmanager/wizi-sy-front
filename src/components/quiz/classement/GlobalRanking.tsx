import { useState, useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

  // Calcul des totaux à partir du classement global
  const totalPoints = sortedRanking.reduce(
    (sum, entry) => sum + (entry.score || 0),
    0
  );
  const totalQuizzes = sortedRanking.reduce(
    (sum, entry) => sum + (entry.quizCount || 0),
    0
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement du classement...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-md bg-gray-100 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-10 bg-gray-200 rounded" />
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-sm rounded-lg">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-base font-semibold text-gray-700">
          Classement global
        </h2>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring focus:ring-blue-100"
          />
        </div>

        {/* Empty State */}
        {sortedRanking.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            Aucun classement disponible
          </div>
        ) : (
          <div className="space-y-2 sm:hidden">
            {sortedRanking.map((entry, index) => {
              const isCurrentUser = entry.id?.toString() === currentUserId;
              return (
                <div
                  key={entry.id || index}
                  className={`p-2 border rounded shadow-sm ${
                    isCurrentUser
                      ? "bg-blue-100 border-blue-200"
                      : "bg-white border-gray-200"
                  }`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium mr-2 text-sm">
                        {entry.rang || index + 1}.
                      </span>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">
                          {entry.name || "Unknown"}
                        </span>
                        {isCurrentUser && (
                          <User className="h-3 w-3 ml-1 text-blue-500" />
                        )}
                      </div>
                    </div>
                    <div className="font-semibold text-blue-600 text-sm">
                      {entry.score} pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden sm:block">
          <div className="overflow-hidden border rounded shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-gray-500">Rang</th>
                  <th className="px-3 py-2 text-left text-gray-500">
                    Stagiaire
                  </th>
                  <th className="px-3 py-2 text-left text-gray-500">Quiz</th>
                  <th className="px-3 py-2 text-left text-gray-500">Points</th>
                </tr>
              </thead>
              <tbody>
                {sortedRanking.map((entry, index) => {
                  const isCurrentUser = entry.id?.toString() === currentUserId;
                  return (
                    <tr
                      key={entry.id || index}
                      className={`border-b ${
                        isCurrentUser ? "bg-blue-50" : "bg-white"
                      } hover:bg-gray-50`}>
                      <td className="px-3 py-2">{entry.rang || index + 1}</td>
                      <td className="px-3 py-2 flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          {entry.name || "Unknown"}
                        </span>
                        {isCurrentUser && (
                          <User className="h-4 w-4 ml-1 text-blue-500" />
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {entry.quizCount}
                      </td>
                      <td className="px-3 py-2 font-semibold text-blue-600">
                        {entry.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
