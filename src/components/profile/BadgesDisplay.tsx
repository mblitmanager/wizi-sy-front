
import React from 'react';

interface Badge {
  id: number | string;
  name: string;
  description?: string;
  icon?: string;
  level?: string;
  type?: string;
}

interface BadgesDisplayProps {
  badges: Badge[];
  loading?: boolean;
}

const badgeIcons: Record<string, string> = {
  connexion_serie: '🔥',
  points_total: '🏆',
  palier: '🥇',
  quiz: '🧠',
};

const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ badges, loading }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 font-montserrat">Badges Gagnés</h3>
      {loading ? (
        <div className="text-center py-8">Chargement des badges...</div>
      ) : badges && badges.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="bg-gray-50 p-4 rounded-lg text-center shadow-sm">
              <div className="text-3xl mb-2">
                {badge.icon || badgeIcons[badge.type || ''] || '🏅'}
              </div>
              <h4 className="font-medium text-sm mb-1 font-nunito">{badge.name}</h4>
              <p className="text-gray-500 text-xs font-roboto">{badge.description}</p>
              {badge.level && (
                <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-bold">
                  {badge.level}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-3xl mb-4">🏅</div>
          <p className="text-gray-500 font-roboto">
            Vous n'avez pas encore de badges. Complétez des quiz pour en gagner !
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgesDisplay;
