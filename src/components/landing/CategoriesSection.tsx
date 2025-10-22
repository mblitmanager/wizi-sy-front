import React from "react";
import { motion } from "framer-motion";
import { categories } from "@/data/mockData";
import { CategoryCard } from "@/components/dashboard/CategoryCard";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, when: "beforeChildren" } },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600" variants={slideUp}>
            Nos catégories de formations
          </motion.h2>
          <motion.p className="text-gray-600 max-w-3xl mx-auto text-lg" variants={slideUp}>
            Découvrez notre large éventail de formations pour développer vos compétences professionnelles.
          </motion.p>
        </motion.div>

        <motion.div className="relative md:hidden" whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <div className="relative bg-white p-6 md:p-8 rounded-xl shadow-md">
                <div className="grid grid-cols-2 gap-4 md:gap-5">
                    {[
                        { name: "Bureautique", icon: null, bgColor: "bg-bureautique", textColor: "text-white" },
                        { name: "Langues", icon: null, bgColor: "bg-langues", textColor: "text-white" },
                        { name: "Internet", icon: null, bgColor: "bg-internet", textColor: "text-black" },
                        { name: "IA", icon: null, bgColor: "bg-ia", textColor: "text-black" },
                        { name: "Création", icon: null, bgColor: "bg-creation", textColor: "text-white" },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.2 } }}
                            onClick={() => (window.location.href = "/")}
                            role="link"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") window.location.href = "/";
                            }}
                        >
                            <div className={`bg-${item.bgColor.split("-")[1]}/10 p-3 rounded-lg flex items-center gap-3 transition-all duration-200 hover:shadow-sm cursor-pointer`}>
                                <div className={`${item.bgColor} ${item.textColor} p-2 rounded-md`}>{item.icon}</div>
                                <span className="font-medium text-base">{item.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>

        <motion.div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8" initial="hidden" animate="visible" variants={staggerContainer}>
          {categories.map((category) => (
            <motion.div key={category.id} variants={slideUp} whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 220 }}>
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CategoriesSection;
