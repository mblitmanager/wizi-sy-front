import React from "react";
import { motion } from "framer-motion";
import { Gift, X } from "lucide-react";

const AdvertBanner = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="transform -translate-x-1/2 bg-gradient-to-r from-[#FF6B35] via-[#FFD700] to-[#FFC300] text-white p-4 rounded-lg shadow-lg flex items-center gap-4 z-50">
      <Gift className="w-10 h-10 animate-bounce" />
      <span className="font-semibold text-lg">{message}</span>
      <button onClick={onClose} className="ml-auto">
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default AdvertBanner;
