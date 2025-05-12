
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { rankingService } from '@/services/rankingService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export function ClassementSection() {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ['rankings', 'global'],
    queryFn: () => rankingService.getGlobalRanking(),
  });

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case 2:
        return "bg-gray-100 border-gray-300 text-gray-700";
      case 3:
        return "bg-amber-100 border-amber-300 text-amber-800";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="mt-12 mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
          Top 3 Classement
        </h2>
        <Link to="/classement" className="text-primary hover:underline text-sm">
          Voir tout
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
          ))
        ) : rankings && rankings.length > 0 ? (
          rankings
            .slice(0, 3)
            .map((user, index) => {
              const position = index + 1;
              const initial = (user.stagiaire_name || user.name || "?").charAt(0);
              
              return (
                <Card
                  key={user.id || index}
                  className={`border-2 overflow-hidden ${getRankColor(position)}`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-primary-100">
                          {user.image_url ? (
                            <img
                              src={user.image_url}
                              alt={user.stagiaire_name || user.name}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {initial}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -top-1 -left-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-gray-200">
                          {getRankIcon(position)}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium truncate max-w-[120px]">
                          {user.stagiaire_name || user.name}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {position === 1 ? "Champion" : position === 2 ? "Vice-champion" : "Médaillé"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{user.score || user.points} pts</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
        ) : (
          <div className="col-span-3 text-center p-4 bg-gray-50 rounded-lg">
            Aucun classement disponible
          </div>
        )}
      </div>
    </div>
  );
}
