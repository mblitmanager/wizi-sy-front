import React, { useState, useEffect } from 'react';
import { progressService } from '@/services/progressService';
import { LeaderboardEntry } from '@/types/quiz';
import RankingComponent from '@/components/Ranking/RankingComponent';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await progressService.getLeaderboard();
      console.log("Leaderboard data:", data);
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setError('Impossible de charger les données du classement. Le serveur est peut-être indisponible.');
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleRetry = () => {
    fetchLeaderboard();
  };

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 font-montserrat">Classement Global</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry} 
            className="mt-2 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Réessayer
          </Button>
        </Alert>
      )}
      
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
