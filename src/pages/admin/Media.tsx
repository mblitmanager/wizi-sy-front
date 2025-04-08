import React, { useState } from 'react';
import { Plus, Search, Filter, Play, Upload, Trash2 } from 'lucide-react';

function MediaManagement() {
  const [selectedType, setSelectedType] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Médias</h1>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Ajouter un média</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des médias..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les types</option>
                <option value="video">Vidéos</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
              </select>
              <button className="btn btn-secondary flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filtres</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upload Card */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 cursor-pointer">
              <Upload className="w-12 h-12 mb-4" />
              <p className="text-sm font-medium">Glissez des fichiers ici</p>
              <p className="text-xs mt-1">ou cliquez pour parcourir</p>
            </div>

            {/* Example Media Card */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <Play className="absolute inset-0 m-auto w-12 h-12 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">Example Video</h3>
                <p className="text-sm text-gray-600 mt-1">Uploaded on: 01/01/2024</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="p-2 text-gray-600 hover:text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaManagement;