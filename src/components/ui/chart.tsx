
import React from 'react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }[];
}

interface ChartProps {
  data: ChartData;
  height?: number;
}

export const BarChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  // Ceci est un composant fictif pour simuler un graphique en barres
  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
  
  return (
    <div style={{ height: `${height}px` }} className="w-full">
      <div className="flex h-full items-end space-x-2">
        {data.labels.map((label, index) => {
          const value = data.datasets[0].data[index];
          const heightPercentage = (value / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <div className="text-xs mt-1 text-center">{label}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-xs text-center text-gray-500">{data.datasets[0].label}</div>
    </div>
  );
};

export const LineChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  // Ceci est un composant fictif pour simuler un graphique en ligne
  return (
    <div style={{ height: `${height}px` }} className="w-full flex flex-col justify-between">
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Graphique linéaire (simulé)</div>
        </div>
        <div className="border-b border-gray-200 absolute bottom-0 w-full"></div>
        <div className="border-l border-gray-200 absolute left-0 h-full"></div>
      </div>
      <div className="flex justify-between mt-2">
        {data.labels.map((label, index) => (
          <div key={index} className="text-xs text-center">{label}</div>
        ))}
      </div>
      <div className="mt-4 text-xs text-center text-gray-500">{data.datasets[0].label}</div>
    </div>
  );
};

export const PieChart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  // Ceci est un composant fictif pour simuler un graphique en camembert
  return (
    <div style={{ height: `${height}px` }} className="w-full flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 rounded-full bg-gray-100 overflow-hidden">
        <div className="absolute text-gray-400 inset-0 flex items-center justify-center">Camembert (simulé)</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.labels.map((label, index) => (
          <div key={index} className="flex items-center text-xs">
            <div 
              className="w-3 h-3 mr-1 rounded-sm" 
              style={{ backgroundColor: Array.isArray(data.datasets[0].backgroundColor) 
                ? data.datasets[0].backgroundColor[index] 
                : data.datasets[0].backgroundColor }}
            ></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
