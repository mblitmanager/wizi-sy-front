
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
  title: string;
  value: number;
  max: number;
  color: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, value, max, color }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
      <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
        <span>{value} terminés</span>
        <span>{max} total</span>
      </div>
      <Progress value={percentage} className="h-2" indicatorColor={color} />
    </div>
  );
};

export default ProgressCard;
