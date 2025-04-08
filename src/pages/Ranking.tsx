import React from 'react';
import { Trophy, Medal, Star } from 'lucide-react';

function Ranking() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Classement</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 3 Players */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Top 3</h2>
          <div className="flex justify-around items-end space-x-4">
            {/* Second Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Medal className="w-8 h-8 text-gray-600" />
              </div>
              <div className="h-32 bg-gray-100 rounded-t-lg px-4 pt-4">
                <p className="font-semibold">2ème</p>
                <p className="text-sm text-gray-600">Score: 850</p>
              </div>
            </div>
            
            {/* First Place */}
            <div className="text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-yellow-600" />
              </div>
              <div className="h-40 bg-yellow-50 rounded-t-lg px-4 pt-4">
                <p className="font-semibold">1er</p>
                <p className="text-sm text-gray-600">Score: 1000</p>
              </div>
            </div>
            
            {/* Third Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Star className="w-8 h-8 text-gray-600" />
              </div>
              <div className="h-28 bg-gray-100 rounded-t-lg px-4 pt-4">
                <p className="font-semibold">3ème</p>
                <p className="text-sm text-gray-600">Score: 700</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Mes Statistiques</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Position actuelle</p>
              <p className="text-2xl font-semibold">#0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Score total</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quiz complétés</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Classement Global</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Complétés</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-600" colSpan={4}>
                  Aucun classement disponible
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Ranking;
