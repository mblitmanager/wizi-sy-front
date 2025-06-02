import React from "react";
import { motion } from "framer-motion";
import { Gift, X } from "lucide-react";
import { Link } from "react-router-dom";
import parainage from "../../assets/parinne.svg";

const AdvertBanner = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative w-[calc(100%-2rem)] bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white p-4 mb-4 rounded-2xl flex items-center mx-auto gap-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 z-50 overflow-hidden">
      <Link
        to="/parainage"
        className="flex items-center flex-1 gap-4 cursor-pointer"
        onClick={(e) => e.stopPropagation()}>
        <Gift
          className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce flex-shrink-0"
          aria-hidden="true"
        />
        <div className="flex-1">
          <span className="font-bold text-lg sm:text-xl mb-1 block">
            {message}
          </span>
          <span className="text-sm sm:text-base text-brown-shade opacity-80">
            Profitez de notre offre de parrainage dès maintenant !
          </span>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Fermer la notification">
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </motion.div>
  );
};

export default AdvertBanner;
