
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ranking } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface RankingCardProps {
  rankings: Ranking[];
  currentUserId: string;
}

export function RankingCard({ rankings, currentUserId }: RankingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Classement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rankings.map((ranking) => (
            <div
              key={ranking.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-md",
                ranking.userId === currentUserId && "bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6">
                  {ranking.position <= 3 ? (
                    <span
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-white font-semibold",
                        ranking.position === 1 && "bg-yellow-500",
                        ranking.position === 2 && "bg-gray-400",
                        ranking.position === 3 && "bg-amber-600"
                      )}
                    >
                      {ranking.position}
                    </span>
                  ) : (
                    <span>{ranking.position}</span>
                  )}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={ranking.userAvatar} alt={ranking.userName} />
                  <AvatarFallback>
                    {ranking.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm truncate max-w-[120px]">
                  {ranking.userName}
                </span>
              </div>
              <span className="font-semibold">{ranking.score} pts</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link
            to="/classement"
            className="text-sm text-primary hover:underline block text-center"
          >
            Voir le classement complet
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
