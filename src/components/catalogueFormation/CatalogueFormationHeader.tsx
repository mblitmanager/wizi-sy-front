
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CatalogueFormationHeaderProps {
  title: string;
  onSearch: (term: string) => void;
  onFilterChange: (category: string) => void;
  categories: string[];
  activeCategory: string;
}

const CatalogueFormationHeader: React.FC<CatalogueFormationHeaderProps> = ({
  title,
  onSearch,
  onFilterChange,
  categories,
  activeCategory
}) => {
  return (
    <div className="mb-6 space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search bar */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10" 
            placeholder="Rechercher une formation..." 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange('all')}
          >
            Toutes
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogueFormationHeader;
