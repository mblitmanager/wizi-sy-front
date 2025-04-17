import React, { useEffect, useState } from 'react';
import { parrainageService } from '../../services/parrainageService';
import { ParrainageStats as ParrainageStatsType } from '../../services/parrainageService';

const ParrainageStats: React.FC = () => {
  const [stats, setStats] = useState<ParrainageStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await parrainageService.getParrainageStats();
        setStats(data);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Statistiques de Parrainage</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700">Filleuls</h3>
          <p className="text-3xl font-bold">{stats.total_filleuls}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700">Points Gagnés</h3>
          <p className="text-3xl font-bold">{stats.total_points}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-700">Récompenses</h3>
          <p className="text-3xl font-bold">{stats.total_rewards}</p>
        </div>
      </div>
    </div>
  );
};

export default ParrainageStats; 