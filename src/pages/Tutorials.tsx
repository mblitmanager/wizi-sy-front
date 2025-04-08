import React from 'react';
import { Play, Clock, Tag } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  category: string;
}

function Tutorials() {
  const tutorials: Tutorial[] = []; // Will be fetched from API

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tutoriels et Astuces</h1>

      {/* Categories */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {['Tous', 'Bureautique', 'Langues', 'Internet', 'Création'].map((category) => (
          <button
            key={category}
            className="px-4 py-2 bg-white rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.length > 0 ? (
          tutorials.map((tutorial) => (
            <div key={tutorial.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{tutorial.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{tutorial.description}</p>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{tutorial.duration} min</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    <span>{tutorial.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600">Aucun tutoriel disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tutorials;
