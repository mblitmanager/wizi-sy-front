import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen, Tag, Eye } from 'lucide-react';

function CatalogManagement() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion du Catalogue</h1>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Ajouter au catalogue</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Formations publiées</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Catégories</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vues totales</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher dans le catalogue..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les catégories</option>
                <option value="bureautique">Bureautique</option>
                <option value="langues">Langues</option>
                <option value="internet">Internet</option>
                <option value="creation">Création</option>
              </select>
              <button className="btn btn-secondary flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filtres</span>
              </button>
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add Formation Card */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 cursor-pointer">
              <Plus className="w-12 h-12 mb-4" />
              <p className="text-sm font-medium">Ajouter une formation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogManagement;