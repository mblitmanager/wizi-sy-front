
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Flame, Star } from 'lucide-react';

interface BadgesDisplayProps {
  badges: string[];
}

const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ badges }) => {
  if (!badges.length) return null;

  // Badges available
  const badgeIcons: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    beginner: {
      icon: <Award className="h-4 w-4" />,
      label: 'Débutant',
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    quick_learner: {
      icon: <Flame className="h-4 w-4" />,
      label: 'Apprentissage Rapide',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    perfectionist: {
      icon: <Star className="h-4 w-4" />,
      label: 'Perfectionniste',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2 font-montserrat">Badges</h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => {
          const badgeInfo = badgeIcons[badge];
          return (
            <Badge key={badge} variant="outline" className={badgeInfo?.color}>
              <span className="mr-1">{badgeInfo?.icon}</span>
              {badgeInfo?.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesDisplay;
