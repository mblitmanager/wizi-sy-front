
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { FileText, MessageSquare, Globe, Palette } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Map category icons
  const renderIcon = () => {
    switch (category.icon) {
      case 'file-text':
        return <FileText className="h-8 w-8" />;
      case 'message-square':
        return <MessageSquare className="h-8 w-8" />;
      case 'globe':
        return <Globe className="h-8 w-8" />;
      case 'palette':
        return <Palette className="h-8 w-8" />;
      default:
        return <FileText className="h-8 w-8" />;
    }
  };

  return (
    <Link to={`/category/${category.id}`}>
      <div className={`category-card ${category.colorClass} hover:scale-105`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
            <p className="text-sm opacity-90 mb-4">{category.description}</p>
            <div className="text-sm font-medium">
              {category.quizCount} {category.quizCount > 1 ? 'Quiz' : 'Quiz'}
            </div>
          </div>
          <div className="p-2 rounded-full bg-white bg-opacity-20">
            {renderIcon()}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
