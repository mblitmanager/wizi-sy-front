import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '@/data/mockData';
import { CategoryCard } from '@/components/dashboard/CategoryCard';

const slideUp = {
    hidden: { y: 18, opacity: 0 },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: { duration: 0.45, delay: i * 0.06, ease: 'easeOut' },
    }),
};

export function CategoriesSection() {
    return (
        <section className="py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {' '}
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">
                        Formations
                    </p>
                    <h2 className="text-3xl md:text-4xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600">
                        Nos catégories de formations
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
                        Découvrez notre large éventail de formations pour développer vos compétences
                        professionnelles.
                    </p>
                </motion.div>
                {/* Grid — unifié mobile + desktop, plus de double-render */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            className="h-full" // ← indispensable
                            initial="hidden"
                            animate="visible"
                            variants={slideUp}
                            custom={index}
                            whileHover={{ y: -5 }}
                        >
                            <CategoryCard category={category} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CategoriesSection;
