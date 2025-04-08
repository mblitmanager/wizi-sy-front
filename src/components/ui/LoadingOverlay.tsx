import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
  transparent?: boolean;
}

function LoadingOverlay({ message = 'Chargement...', transparent = false }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        transparent ? 'bg-white/50' : 'bg-white'
      }`}
    >
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </motion.div>
  );
}

export default LoadingOverlay;