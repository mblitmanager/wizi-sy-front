import React from "react";
import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, when: "beforeChildren" } },
};

export function HowItWorks() {
  const { user } = useUser();
  const items = [
    {
      step: "1",
      title: "Choisissez un quiz",
      description: "Sélectionnez parmi nos quiz, suivant votre formation.",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      step: "2",
      title: "Testez vos connaissances",
      description: "Répondez aux questions dans différents formats: QCM, vrai/faux, remplir les blancs et plus encore.",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: <ClipboardCheck className="h-6 w-6" />,
    },
    {
      step: "3",
      title: "Suivez votre progression",
      description: "Consultez vos statistiques, comparez vos performances et remportez des défis pour gagner des points.",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: <TrendingUp className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500" variants={slideUp}>
            Comment ça marche
          </motion.h2>
          <motion.p className="text-gray-800 max-w-3xl mx-auto text-lg" variants={slideUp}>
            Une approche simple et efficace pour améliorer vos compétences grâce à notre plateforme de quiz.
          </motion.p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10" initial="hidden" animate="visible" variants={staggerContainer}>
          {items.map((item, index) => {
            const target = user ? "/quiz" : "/login";
            return (
              <Link to={target} key={index} className="block" aria-label={`Aller à ${target} pour ${item.title}`}>
              <motion.div className={`${item.bgColor} p-6 rounded-lg shadow-sm transition-all cursor-pointer`} variants={slideUp} whileHover={{ y: -4, scale: 1.01 }}>
                <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center mb-5`}>
                  <div className={`${item.textColor}`}>{item.icon}</div>
                </div>
                <div className={`${item.textColor} font-bold text-lg mb-2`}>Étape {item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
