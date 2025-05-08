import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { rankingService } from "@/services/api";

export function RankingCard() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await rankingService.getGlobalRanking();
        const data = res.data;
        const mapped = (data || []).map((item: any) => ({
          id: item.stagiaire.id,
          name: item.stagiaire.prenom,
          image: item.stagiaire.image,
          score: item.totalPoints,
          quizCount: item.quizCount,
          averageScore: item.averageScore,
          rang: item.rang,
        }));
        setRanking(mapped);
      } catch (e) {
        setRanking([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchProfile = async () => {
      try {
        const profile = await import("@/services/quiz/QuizSubmissionService").then(m => m.quizSubmissionService.getStagiaireProfile());
        setCurrentUserId(profile?.stagiaire?.id?.toString());
      } catch (e) {
        setCurrentUserId(undefined);
      }
    };
    fetchData();
    fetchProfile();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {ranking.map((item) => {
            const isCurrentUser = item.id === currentUserId;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md",
                  isCurrentUser && "bg-blue-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6">
                    {item.rang <= 3 ? (
                      <span
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-white font-semibold",
                          item.rang === 1 && "bg-yellow-500",
                          item.rang === 2 && "bg-gray-400",
                          item.rang === 3 && "bg-amber-600"
                        )}
                      >
                        {item.rang}
                      </span>
                    ) : (
                      <span>{item.rang}</span>
                    )}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback>
                      {item.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    <span className="font-medium text-sm truncate max-w-[120px]">
                      {item.name}
                    </span>
                    {isCurrentUser && (
                      <User className="h-4 w-4 ml-1 text-primary" />
                    )}
                  </div>
                </div>
                <span className="font-semibold">{item.score} pts</span>
              </div>
            );
          })}
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
