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
        <section className="bg-[#eaf2f0] py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {' '}
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#b47700]">
                        Formations
                    </p>
                    <h2 className="mb-4 font-poppins text-3xl font-semibold text-[#173f46] md:text-4xl">
                        Nos catégories de formations
                    </h2>
                    <p className="mx-auto max-w-lg text-base leading-relaxed text-[#526b70]">
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
