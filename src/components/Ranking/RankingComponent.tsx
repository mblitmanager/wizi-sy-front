
import React from 'react';
import { LeaderboardEntry } from '@/types/quiz';
import { Avatar } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Award, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RankingComponentProps {
  rankings: LeaderboardEntry[];
}

const RankingComponent: React.FC<RankingComponentProps> = ({ rankings }) => {
  // Helper function to render rank icon based on position
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Award className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="font-semibold">{rank}</span>;
  };

  // Get current user ID from localStorage to highlight current user
  const currentUserId = localStorage.getItem('userId');
  
  return (
    <Card className="border rounded-lg shadow-sm">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl font-semibold">Classement des stagiaires</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Rang</TableHead>
              <TableHead>Stagiaire</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.length > 0 ? (
              rankings.map((entry, index) => (
                <TableRow 
                  key={entry.id || index}
                  className={entry.userId === currentUserId ? "bg-blue-50" : ""}
                >
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      {getRankIcon(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <img 
                          src={entry.avatarUrl || "/placeholder.svg"} 
                          alt={entry.username} 
                          className="h-full w-full object-cover"
                        />
                      </Avatar>
                      <span>{entry.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{entry.score} pts</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                  Aucune donnée de classement disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RankingComponent;
