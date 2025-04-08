import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`border-4 border-blue-200 rounded-full ${spinnerSizes[size]}`}
        style={{
          borderTopColor: '#3B82F6',
          borderRightColor: '#3B82F6'
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}

export default LoadingSpinner;