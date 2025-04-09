
import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/types';
import { mockAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Award, Medal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would use an API call
        // const data = await progressAPI.getLeaderboard();
        const data = mockAPI.getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getUserRank = (): number | null => {
    if (!user) return null;
    
    const userEntry = leaderboard.find(entry => entry.userId === user.id);
    return userEntry ? userEntry.rank : null;
  };

  const userRank = getUserRank();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-semibold">{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <h1 className="text-2xl font-bold mb-6">Classement</h1>

      <Tabs defaultValue="points">
        <TabsList className="mb-6">
          <TabsTrigger value="points">Points</TabsTrigger>
          <TabsTrigger value="level">Niveau</TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="space-y-6">
          {/* User's rank card (if logged in) */}
          {user && userRank && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                  {getRankIcon(userRank)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <div className="font-semibold">{user.username} (Vous)</div>
                      <div className="text-sm text-gray-500">Niveau {user.level}</div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">{user.points} pts</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard list */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center p-4 border-b border-gray-100 text-sm text-gray-500">
              <div className="w-12 text-center">Rang</div>
              <div className="flex-grow">Utilisateur</div>
              <div className="w-24 text-right">Points</div>
            </div>

            {leaderboard.map((entry) => (
              <div 
                key={entry.userId} 
                className={`flex items-center p-4 border-b border-gray-100 ${
                  entry.userId === user?.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-12 text-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex-grow flex items-center">
                  <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.username} className="rounded-full" />
                    ) : (
                      <span>{entry.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {entry.username} 
                      {entry.userId === user?.id && <span className="text-gray-500 text-sm ml-1">(Vous)</span>}
                    </div>
                    <div className="text-xs text-gray-500">Niveau {entry.level}</div>
                  </div>
                </div>
                <div className="w-24 text-right font-semibold">{entry.points} pts</div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="level" className="space-y-6">
          {/* Similar content but sorted by level */}
          {user && userRank && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                  {getRankIcon(userRank)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <div className="font-semibold">{user.username} (Vous)</div>
                      <div className="text-sm text-gray-500">{user.points} points</div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">Niveau {user.level}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center p-4 border-b border-gray-100 text-sm text-gray-500">
              <div className="w-12 text-center">Rang</div>
              <div className="flex-grow">Utilisateur</div>
              <div className="w-24 text-right">Niveau</div>
            </div>

            {leaderboard
              .sort((a, b) => b.level - a.level || b.points - a.points)
              .map((entry, index) => (
                <div 
                  key={entry.userId} 
                  className={`flex items-center p-4 border-b border-gray-100 ${
                    entry.userId === user?.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="w-12 text-center">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="flex-grow flex items-center">
                    <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      {entry.avatar ? (
                        <img src={entry.avatar} alt={entry.username} className="rounded-full" />
                      ) : (
                        <span>{entry.username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {entry.username}
                        {entry.userId === user?.id && <span className="text-gray-500 text-sm ml-1">(Vous)</span>}
                      </div>
                      <div className="text-xs text-gray-500">{entry.points} points</div>
                    </div>
                  </div>
                  <div className="w-24 text-right font-semibold">Niveau {entry.level}</div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderboardPage;
