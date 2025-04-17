import React, { useState, useEffect } from 'react';
import { rankingService } from '../../services/api';
import { RewardsResponse, Reward } from '../../types/ranking';

const RewardsComponent: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [nextReward, setNextReward] = useState<Reward | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setIsLoading(true);
        const response = await rankingService.getRewards() as RewardsResponse;
        setRewards(response.data.rewards);
        setTotalPoints(response.data.totalPoints);
        setNextReward(response.data.nextReward || null);
      } catch (err) {
        setError('Erreur lors du chargement des récompenses');
      } finally {
        setIsLoading(false);
      }
    };

    loadRewards();
  }, []);

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'badge':
        return '🎖️';
      case 'medal':
        return '🏅';
      case 'trophy':
        return '🏆';
      default:
        return '🌟';
    }
  };

  const renderRewardCard = (reward: Reward) => {
    return (
      <div key={reward.id} className="reward-card">
        <div className="reward-icon">{getRewardIcon(reward.type)}</div>
        <div className="reward-content">
          <h3>{reward.name}</h3>
          <p>{reward.description}</p>
          <div className="reward-meta">
            <span className="points">{reward.pointsRequired} points</span>
            {reward.trainingId && (
              <span className="training">{reward.trainingId}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Chargement des récompenses...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="rewards-container">
      <div className="rewards-header">
        <h2>Vos Récompenses</h2>
        <div className="points-summary">
          <div className="total-points">
            <span className="label">Points Totaux</span>
            <span className="value">{totalPoints}</span>
          </div>
          {nextReward && (
            <div className="next-reward">
              <span className="label">Prochaine Récompense</span>
              <span className="value">
                {nextReward.name} ({nextReward.pointsRequired - totalPoints} points restants)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="rewards-grid">
        {rewards.length > 0 ? (
          rewards.map(renderRewardCard)
        ) : (
          <div className="no-rewards">
            <p>Vous n'avez pas encore de récompenses</p>
            {nextReward && (
              <div className="next-reward-preview">
                <h3>Prochaine récompense à débloquer</h3>
                {renderRewardCard(nextReward)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rewards-categories">
        <h3>Catégories de Récompenses</h3>
        <div className="categories-grid">
          <div className="category">
            <h4>Formation</h4>
            <p>Récompenses obtenues en complétant des formations</p>
          </div>
          <div className="category">
            <h4>Global</h4>
            <p>Récompenses basées sur votre score total</p>
          </div>
          <div className="category">
            <h4>Spécial</h4>
            <p>Récompenses pour accomplissements particuliers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsComponent; 