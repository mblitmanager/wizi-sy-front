
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardEntry } from "@/types/quiz";

export interface GlobalRankingProps {
  ranking?: LeaderboardEntry[];
  loading?: boolean; 
}

export function GlobalRanking({ ranking = [], loading = false }: GlobalRankingProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement du classement...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-gray-100 animate-pulse">
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
      <CardContent className="space-y-4">
        {ranking.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Aucun classement disponible pour le moment
          </p>
        ) : (
          ranking.map((entry, index) => (
            <div 
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-md ${
                index < 3 ? 'bg-amber-50' : 'bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center font-semibold">
                {index < 3 ? (
                  <Trophy className={`h-6 w-6 ${
                    index === 0 ? 'text-yellow-500' : 
                    index === 1 ? 'text-gray-400' : 'text-amber-700'
                  }`} />
                ) : (
                  <span className="text-gray-500">{index + 1}</span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-1">
                <Avatar>
                  <AvatarImage 
                    src={entry.image} 
                    alt={entry.name} 
                  />
                  <AvatarFallback>
                    {entry.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{entry.name}</span>
              </div>
              <div className="text-lg font-semibold text-primary">
                {entry.score}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
