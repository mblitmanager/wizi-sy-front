
import React, { useState, useEffect } from 'react';
import { progressAPI } from '@/api';
import { LeaderboardEntry } from '@/types/quiz';
import { RankingComponent } from '@/components/Ranking/RankingComponent';

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await progressAPI.getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 font-montserrat">Classement Global</h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <RankingComponent rankings={leaderboard} />
      )}
    </div>
  );
};

export default LeaderboardPage;
