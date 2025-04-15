
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Award, Medal, Trophy } from 'lucide-react';
import { LeaderboardEntry } from '@/types/quiz';
import '@/styles/Ranking.css';

interface RankingComponentProps {
  rankings: LeaderboardEntry[];
}

const RankingComponent: React.FC<RankingComponentProps> = ({ rankings }) => {
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
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                  Aucune donnée de classement disponible
                </TableCell>
              </TableRow>
            ) : (
              rankings.map((entry, index) => (
                <TableRow key={entry.user_id || index} className={index < 3 ? 'font-medium' : ''}>
                  <TableCell className="relative text-center">
                    {index === 0 && (
                      <Trophy className="h-5 w-5 text-yellow-500 inline-block" />
                    )}
                    {index === 1 && (
                      <Medal className="h-5 w-5 text-gray-400 inline-block" />
                    )}
                    {index === 2 && (
                      <Award className="h-5 w-5 text-amber-700 inline-block" />
                    )}
                    {index > 2 && <span>{index + 1}</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.avatar || ''} alt={entry.username} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {entry.username ? entry.username.charAt(0).toUpperCase() : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[150px]">{entry.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">{entry.total_points || 0}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.quizzes_completed || 0}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RankingComponent;
