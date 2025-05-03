
import React from 'react';

const BadgesDisplay: React.FC = () => {
  const badges = [
    { id: 'first-quiz', name: 'Premier Quiz', icon: '🏆', description: 'Terminer votre premier quiz' },
    { id: 'quiz-master', name: 'Maître des Quiz', icon: '🧠', description: 'Obtenir 100% à 5 quiz' },
    { id: 'fast-learner', name: 'Apprenant Rapide', icon: '⚡', description: 'Terminer un quiz en moins de 2 minutes' },
    { id: 'streak', name: 'Sur une lancée', icon: '🔥', description: 'Compléter des quiz 5 jours d\'affilée' }
  ];
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 font-montserrat">Badges Gagnés</h3>
      
      {badges.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="bg-gray-50 p-4 rounded-lg text-center shadow-sm">
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h4 className="font-medium text-sm mb-1 font-nunito">{badge.name}</h4>
              <p className="text-gray-500 text-xs font-roboto">{badge.description}</p>
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
