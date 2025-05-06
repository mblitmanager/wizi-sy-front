
import { useState, useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LeaderboardEntry } from "@/types/quiz";
import { useAuth } from "@/hooks/useAuth";

export interface GlobalRankingProps {
  ranking?: LeaderboardEntry[];
  loading?: boolean;
}

type SortKey = "rang" | "name" | "quizCount" | "averageScore" | "score";

type SortOrder = "asc" | "desc";

export function GlobalRanking({ ranking = [], loading = false }: GlobalRankingProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rang");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  
  const currentUserId = user?.id?.toString();

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
                className="flex items-center gap-3 p-3 rounded-md bg-gray-100 animate-pulse"
              >
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
    <Card>
      <CardHeader>
        <CardTitle>Classement global</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            type="text"
            placeholder="Rechercher un prénom..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-64"
          />
        </div>
        {sortedRanking.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Aucun classement disponible pour le moment
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("rang")}>Rang {sortKey === "rang" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("name")}>Stagiaire {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("quizCount")}>Quiz {sortKey === "quizCount" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("averageScore")}>Score moyen {sortKey === "averageScore" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("score")}>Points {sortKey === "score" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                </tr>
              </thead>
              <tbody>
                {sortedRanking.map((entry: any, index: number) => {
                  const isCurrentUser = entry.id?.toString() === currentUserId;
                  return (
                  <tr
                    key={entry.id || index}
                    className={`hover:bg-blue-50 transition ${
                      isCurrentUser ? "bg-blue-100" : ""
                    } ${index < 3 ? "font-bold" : ""}`}
                  >
                    <td className="px-4 py-2">
                      {index < 3 ? (
                        <Trophy
                          className={`inline h-5 w-5 align-middle mr-1 ${
                            index === 0
                              ? "text-yellow-500"
                              : index === 1
                              ? "text-gray-400"
                              : "text-amber-700"
                          }`}
                        />
                      ) : null}
                      {entry.rang || index + 1}
                    </td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={entry.image} alt={entry.name || "User"} />
                        <AvatarFallback>
                          {entry.name && entry.name.length > 0
                            ? entry.name.substring(0, 2).toUpperCase()
                            : "UN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center">
                        <span>{entry.name || "Unknown"}</span>
                        {isCurrentUser && (
                          <User className="h-4 w-4 ml-2 text-primary" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">{entry.quizCount}</td>
                    <td className="px-4 py-2">{Math.round(entry.averageScore)}%</td>
                    <td className="px-4 py-2 text-primary font-semibold">{entry.score}</td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
