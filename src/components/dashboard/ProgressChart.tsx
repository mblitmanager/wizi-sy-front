import React from 'react';
import { motion } from 'framer-motion';

interface ProgressChartProps {
  data: {
    category: string;
    completed: number;
    total: number;
  }[];
}

function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Formation Progress</h3>
      <div className="space-y-4">
        {data.map((item) => {
          const percentage = Math.round((item.completed / item.total) * 100);
          return (
            <div key={item.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{item.category}</span>
                <span className="text-gray-600">{percentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressChart;