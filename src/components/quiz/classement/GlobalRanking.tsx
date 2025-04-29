
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalRankingProps {
  classement: any[];
  currentUserId?: string;
}

export const GlobalRanking: React.FC<GlobalRankingProps> = ({ classement, currentUserId }) => {
  if (!classement || classement.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classement Global</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-muted-foreground">Aucune donnée de classement disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classement Global</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rang</TableHead>
              <TableHead>Stagiaire</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Quiz Completés</TableHead>
              <TableHead>Score Moyen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classement.map((item, index) => (
              <TableRow 
                key={item.stagiaire.id}
                className={cn(
                  item.stagiaire.id === currentUserId && "bg-primary/5"
                )}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                    {index === 1 && <Crown className="h-5 w-5 text-gray-400" />}
                    {index === 2 && <Crown className="h-5 w-5 text-amber-700" />}
                    <span className="font-bold">{index + 1}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.stagiaire.image || undefined} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.stagiaire.prenom}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold">{item.totalPoints}</TableCell>
                <TableCell>{item.quizCount}</TableCell>
                <TableCell>{Math.round(item.averageScore)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
