import React, { useState, useEffect } from 'react';
import sponsorshipService from '../../services/api';
import { SponsorshipResponse, Referral, SponsorshipStats, SponsorshipLink } from '../../types/sponsorship';

const SponsorshipComponent: React.FC = () => {
  const [link, setLink] = useState<SponsorshipLink | null>(null);
  const [stats, setStats] = useState<SponsorshipStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSponsorshipData = async () => {
      try {
        setIsLoading(true);
        const response = await sponsorshipService.getLink() as SponsorshipResponse;
        setLink(response.data.link);
        setStats(response.data.stats);
        setReferrals(response.data.referrals);
      } catch (err) {
        setError('Erreur lors du chargement des données de parrainage');
      } finally {
        setIsLoading(false);
      }
    };

    loadSponsorshipData();
  }, []);

  const handleShare = async (platform: string) => {
    if (!link) return;

    const shareUrl = encodeURIComponent(link.url);
    const shareText = encodeURIComponent(link.shareText);

    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${shareText}%20${shareUrl}`;
        break;
      default:
        return;
    }

    window.open(shareLink, '_blank');
  };

  const renderReferralStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="status pending">En attente</span>;
      case 'active':
        return <span className="status active">Actif</span>;
      case 'completed':
        return <span className="status completed">Terminé</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Chargement des données de parrainage...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="sponsorship-container">
      <div className="sponsorship-header">
        <h2>Programme de Parrainage</h2>
        {stats && (
          <div className="stats-summary">
            <div className="stat">
              <span className="label">Filleuls Totaux</span>
              <span className="value">{stats.totalReferrals}</span>
            </div>
            <div className="stat">
              <span className="label">Filleuls Actifs</span>
              <span className="value">{stats.activeReferrals}</span>
            </div>
            <div className="stat">
              <span className="label">Points Gagnés</span>
              <span className="value">{stats.totalPointsEarned}</span>
            </div>
          </div>
        )}
      </div>

      {link && (
        <div className="share-section">
          <h3>Votre Lien de Parrainage</h3>
          <div className="link-container">
            <input
              type="text"
              value={link.url}
              readOnly
              className="link-input"
            />
            <button
              onClick={() => navigator.clipboard.writeText(link.url)}
              className="copy-button"
            >
              Copier
            </button>
          </div>
          <div className="share-buttons">
            <button onClick={() => handleShare('facebook')} className="share-button facebook">
              Facebook
            </button>
            <button onClick={() => handleShare('twitter')} className="share-button twitter">
              Twitter
            </button>
            <button onClick={() => handleShare('linkedin')} className="share-button linkedin">
              LinkedIn
            </button>
            <button onClick={() => handleShare('whatsapp')} className="share-button whatsapp">
              WhatsApp
            </button>
          </div>
        </div>
      )}

      {stats?.nextReward && (
        <div className="next-reward">
          <h3>Prochaine Récompense</h3>
          <div className="reward-progress">
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${((stats.totalPointsEarned / stats.nextReward.pointsRequired) * 100).toFixed(0)}%`,
                }}
              />
            </div>
            <div className="progress-text">
              {stats.nextReward.pointsRemaining} points restants pour {stats.nextReward.reward}
            </div>
          </div>
        </div>
      )}

      <div className="referrals-list">
        <h3>Vos Filleuls</h3>
        <table className="referrals-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Date d'inscription</th>
              <th>Statut</th>
              <th>Points gagnés</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral) => (
              <tr key={referral.id}>
                <td>{referral.referredUserName}</td>
                <td>{new Date(referral.joinDate).toLocaleDateString()}</td>
                <td>{renderReferralStatus(referral.status)}</td>
                <td>{referral.pointsEarned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SponsorshipComponent; 