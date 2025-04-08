import React from 'react';
import { Trophy, Star, Target, Zap, Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  progress: number;
  total: number;
  unlocked: boolean;
}

function Achievements() {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Premier Pas',
      description: 'Complétez votre premier quiz',
      icon: Star,
      progress: 0,
      total: 1,
      unlocked: false
    },
    {
      id: '2',
      title: 'Expert en Devenir',
      description: 'Obtenez 10 scores parfaits',
      icon: Trophy,
      progress: 0,
      total: 10,
      unlocked: false
    },
    {
      id: '3',
      title: 'Marathon',
      description: 'Connectez-vous 7 jours consécutifs',
      icon: Target,
      progress: 0,
      total: 7,
      unlocked: false
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Récompenses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const progress = (achievement.progress / achievement.total) * 100;

          return (
            <div
              key={achievement.id}
              className={`bg-white rounded-lg shadow-sm p-6 ${
                achievement.unlocked ? 'border-2 border-yellow-400' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    achievement.unlocked ? 'text-yellow-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progression</span>
                      <span className="text-gray-900 font-medium">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          achievement.unlocked ? 'bg-yellow-400' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistiques */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Statistiques globales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Récompenses</p>
              <p className="text-2xl font-semibold">0/12</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Points XP</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Niveau</p>
              <p className="text-2xl font-semibold">1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Achievements;
