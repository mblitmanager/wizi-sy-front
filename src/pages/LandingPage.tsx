import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, PenTool, FileText, MessageSquare, Globe, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/data/mockData";
import { CategoryCard } from "@/components/dashboard/CategoryCard";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};
const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

export default function LandingPage() {
  const isOnline = useOnlineStatus();
  return (
    <Layout>
      <div className="bg-gradient-to-br from-[#FDF6ED] via-[#F7E7D2] to-[#F9E0C7]) min-h-screen mt-[-2%]">
        {!isOnline && (
          <Alert variant="destructive" className="mb-4 mx-4 mt-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Vous êtes hors ligne</AlertTitle>
            <AlertDescription>
              Certaines fonctionnalités peuvent être limitées. Les données affichées peuvent ne pas être à jour.
            </AlertDescription>
          </Alert>
        )}
        {/* Ajouter le logo */}
        <div className="flex justify-center lg:justify-start mt-8 lg:ml-8">
          <img src={logo} alt="Wizi Learn Logo" className="h-32 w-auto" loading="lazy" />
        </div>
        {/* Section avec le background de login */}
        <div className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-12">
              <motion.div
                className="lg:w-1/2 space-y-4 md:space-y-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}>
                <motion.h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-orange-400"
                  variants={slideUp}>
                  Apprenez de façon interactive et ludique
                </motion.h1>
                <motion.p className="text-base md:text-lg text-gray-700" variants={slideUp}>
                  Bienvenue sur Wizi Learn, la plateforme de quiz éducatifs pour nos stagiaires. Testez vos connaissances, suivez votre progression et développez vos compétences professionnelles.
                </motion.p>
                <motion.div className="flex flex-wrap gap-3 md:gap-4" variants={slideUp}>
                  <Button size="lg" asChild className="w-full md:w-auto">
                    <Link to="/login" className="flex items-center justify-center bg-[#B07661] hover:bg-[#A76C36] text-white font-semibold rounded-md px-4 py-2 transition-colors duration-200">
                      Commencer maintenant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full md:w-auto border-[#FF9900] text-[#FFF] bg-orange-500 hover:text-white hover:bg-[#FF9900]">
                    <Link to="/login">Connexion</Link>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="lg:w-1/2 relative mt-8 md:mt-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}>
                <div className="absolute -top-6 -left-6 w-48 md:w-64 h-48 md:h-64 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute -bottom-10 -right-10 w-56 md:w-72 h-56 md:h-72 bg-purple-200 rounded-full blur-3xl opacity-40"></div>
                <motion.div className="relative" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="relative">
                    <div className="absolute -top-6 -left-6 w-48 md:w-64 h-48 md:h-64 bg-bureautique/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-56 md:w-72 h-56 md:h-72 bg-creation/20 rounded-full blur-3xl"></div>
                    <div className="relative bg-white p-4 md:p-6 rounded-xl shadow-lg">
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-bureautique/10 p-3 md:p-4 rounded-lg flex items-center gap-2 md:gap-3">
                          <div className="bg-bureautique text-white p-1.5 md:p-2 rounded-md">
                            <FileText className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <span className="font-medium text-sm md:text-base">Bureautique</span>
                        </div>
                        <div className="bg-langues/10 p-3 md:p-4 rounded-lg flex items-center gap-2 md:gap-3">
                          <div className="bg-langues text-white p-1.5 md:p-2 rounded-md">
                            <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <span className="font-medium text-sm md:text-base">Langues</span>
                        </div>
                        <div className="bg-internet/10 p-3 md:p-4 rounded-lg flex items-center gap-2 md:gap-3">
                          <div className="bg-internet text-black p-1.5 md:p-2 rounded-md">
                            <Globe className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <span className="font-medium text-sm md:text-base">Internet</span>
                        </div>
                        <div className="bg-creation/10 p-3 md:p-4 rounded-lg flex items-center gap-2 md:gap-3">
                          <div className="bg-creation text-white p-1.5 md:p-2 rounded-md">
                            <PenTool className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <span className="font-medium text-sm md:text-base">Création</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        {/* Categories Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-4 text-orange-400">Nos catégories de formations</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Découvrez notre large éventail de formations pour développer vos compétences professionnelles.
              </p>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={staggerContainer}>
              {categories.map((category) => (
                <motion.div key={category.id} variants={slideUp} whileHover={{ y: -5 }}>
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        {/* How It Works Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-4 text-orange-400">Comment ça marche</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Une approche simple et efficace pour améliorer vos compétences grâce à notre plateforme de quiz.
              </p>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial="hidden" animate="visible" variants={staggerContainer}>
              {[
                {
                  step: "1",
                  title: "Choisissez un quiz",
                  description: "Sélectionnez parmi nos quiz, suivant votre formation.",
                  color: "indigo",
                },
                {
                  step: "2",
                  title: "Testez vos connaissances",
                  description: "Répondez aux questions dans différents formats: QCM, vrai/faux, remplir les blancs et plus encore.",
                  color: "purple",
                },
                {
                  step: "3",
                  title: "Suivez votre progression",
                  description: "Consultez vos statistiques, comparez vos performances et remportez des défis pour gagner des points.",
                  color: "blue",
                },
              ].map((item, index) => (
                <motion.div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100" variants={slideUp} whileHover={{ y: -5 }}>
                  <div className={`w-12 h-12 bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center mb-4`}>
                    <span className="font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
