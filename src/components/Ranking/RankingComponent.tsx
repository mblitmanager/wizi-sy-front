
import React, { useState, useEffect } from 'react';
import { rankingService } from '../../services/api';
import { RankingResponse, TrainingRanking, GlobalRanking } from '../../types/ranking';
import { useToast } from '@/hooks/use-toast';

const RankingComponent: React.FC = () => {
  const [globalRanking, setGlobalRanking] = useState<GlobalRanking | null>(null);
  const [trainingRankings, setTrainingRankings] = useState<TrainingRanking[]>([]);
  const [userPosition, setUserPosition] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setIsLoading(true);
        const response = await rankingService.getRankings() as RankingResponse;
        setGlobalRanking(response.data.global);
        setTrainingRankings(response.data.byTraining);
        setUserPosition(response.data.userPosition);
        setUserScore(response.data.userScore);
      } catch (err) {
        setError('Erreur lors du chargement des classements');
        toast({
          title: "Erreur",
          description: "Impossible de charger les classements. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRankings();
  }, [toast]);

  const handleTrainingSelect = (trainingId: string) => {
    setSelectedTraining(trainingId);
  };

  const renderRankingTable = (entries: any[], isGlobal: boolean = false) => {
    return (
      <div className="ranking-table">
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Utilisateur</th>
              <th>Score</th>
              {!isGlobal && <th>Formation</th>}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={entry.userId || entry.user_id}
                className={entry.userId === localStorage.getItem('userId') || entry.user_id === localStorage.getItem('userId') ? 'current-user' : ''}
              >
                <td>{entry.rank}</td>
                <td>
                  <div className="user-info">
                    {entry.avatarUrl && (
                      <img src={entry.avatarUrl} alt={entry.username} className="avatar" />
                    )}
                    <span>{entry.username}</span>
                  </div>
                </td>
                <td>{entry.score}</td>
                {!isGlobal && <td>{entry.trainingName}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) {
    return <div>Chargement des classements...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <h2>Classements</h2>
        <div className="user-stats">
          <div className="stat">
            <span className="label">Votre position</span>
            <span className="value">#{userPosition}</span>
          </div>
          <div className="stat">
            <span className="label">Votre score</span>
            <span className="value">{userScore}</span>
          </div>
        </div>
      </div>

      <div className="ranking-tabs">
        <button
          className={`tab ${!selectedTraining ? 'active' : ''}`}
          onClick={() => setSelectedTraining(null)}
        >
          Classement Global
        </button>
        {trainingRankings.map((training) => (
          <button
            key={training.trainingId}
            className={`tab ${selectedTraining === training.trainingId ? 'active' : ''}`}
            onClick={() => handleTrainingSelect(training.trainingId)}
          >
            {training.trainingName}
          </button>
        ))}
      </div>

      <div className="ranking-content">
        {!selectedTraining && globalRanking && (
          <>
            <h3>Classement Global</h3>
            {renderRankingTable(globalRanking.entries, true)}
            <div className="last-updated">
              Dernière mise à jour : {new Date(globalRanking.lastUpdated).toLocaleString()}
            </div>
          </>
        )}

        {selectedTraining && (
          <>
            <h3>
              Classement -{' '}
              {trainingRankings.find((t) => t.trainingId === selectedTraining)?.trainingName}
            </h3>
            {renderRankingTable(
              trainingRankings.find((t) => t.trainingId === selectedTraining)?.entries || []
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RankingComponent;
