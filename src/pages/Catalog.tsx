import React from 'react';
import { BookOpen, Clock, Users, Star } from 'lucide-react';
import type { Formation } from '../types';

function Catalog() {
  const formations: Formation[] = []; // Will be fetched from API

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Catalogue des Formations</h1>

      {/* Categories */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {['Toutes', 'Bureautique', 'Langues', 'Internet', 'Création'].map((category) => (
          <button
            key={category}
            className="px-4 py-2 bg-white rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Formations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formations.length > 0 ? (
          formations.map((formation) => (
            <div key={formation.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={formation.thumbnail}
                alt={formation.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{formation.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{formation.description}</p>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formation.duration}h</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{formation.level}</span>
                  </div>
                </div>

                <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  En savoir plus
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600">Aucune formation disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;