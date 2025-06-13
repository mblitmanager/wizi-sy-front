import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, Medal, Trophy, User } from "lucide-react";
import "@/styles/Ranking.css";
import { useUser } from "@/hooks/useAuth";

interface Stagiaire {
  id: string;
  prenom: string;
  image: string | null;
}

interface RankingEntry {
  stagiaire: Stagiaire;
  totalPoints: number;
  quizCount: number;
  averageScore: number;
  rang: number;
}

interface RankingComponentProps {
  rankings: RankingEntry[];
}

const RankingComponent: React.FC<RankingComponentProps> = ({ rankings }) => {
  const { user } = useUser();
  const currentUserId = user?.id?.toString();

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Quizz Complétés</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-gray-500">
                  Aucune donnée de classement disponible
                </TableCell>
              </TableRow>
            ) : (
              rankings.map((entry) => {
                const isCurrentUser = entry.stagiaire.id === currentUserId;
                return (
                  <TableRow
                    key={entry.stagiaire.id}
                    className={
                      isCurrentUser
                        ? "bg-blue-100 font-medium"
                        : entry.rang <= 3
                        ? "font-medium"
                        : ""
                    }>
                    <TableCell className="relative text-center">
                      {entry.rang === 1 && (
                        <Trophy className="h-5 w-5 text-yellow-500 inline-block" />
                      )}
                      {entry.rang === 2 && (
                        <Medal className="h-5 w-5 text-gray-400 inline-block" />
                      )}
                      {entry.rang === 3 && (
                        <Award className="h-5 w-5 text-amber-700 inline-block" />
                      )}
                      {entry.rang > 3 && <span>{entry.rang}</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={entry.stagiaire.image || ""}
                            alt={entry.stagiaire.prenom}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {entry.stagiaire.prenom
                              ? entry.stagiaire.prenom.charAt(0).toUpperCase()
                              : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          <span className="truncate max-w-[150px]">
                            {entry.stagiaire.prenom}
                          </span>
                          {isCurrentUser && (
                            <User className="h-4 w-4 ml-2 text-primary" />
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">{entry.totalPoints}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.quizCount}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RankingComponent;
