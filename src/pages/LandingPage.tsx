import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PenTool,
  FileText,
  MessageSquare,
  Globe,
  WifiOff,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Smartphone,
  Apple,
} from "lucide-react";
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
      <div className="bg-gradient-to-br from-[#FDF6ED] via-[#F7E7D2] to-[#F9E0C7] min-h-screen">
        {/* Offline Alert */}
        {!isOnline && (
          <Alert variant="destructive" className="mb-4 mx-4 mt-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Vous êtes hors ligne</AlertTitle>
            <AlertDescription>
              Certaines fonctionnalités peuvent être limitées. Les données
              affichées peuvent ne pas être à jour.
            </AlertDescription>
          </Alert>
        )}

        {/* Header with Logo */}
        <header className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={logo}
                  alt="Logo Wizi Learn"
                  className="h-20 w-auto transition-all duration-300 hover:scale-105"
                  loading="eager"
                />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 md:py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
              <motion.div
                className="space-y-6 md:space-y-8 order-2 lg:order-1"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600"
                  variants={slideUp}
                >
                  Apprenez de façon interactive et ludique
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-gray-700 leading-relaxed"
                  variants={slideUp}
                >
                  Bienvenue sur Wizi Learn, la plateforme de quiz éducatifs pour
                  nos stagiaires. Testez vos connaissances, suivez votre
                  progression et développez vos compétences professionnelles.
                </motion.p>
                <motion.div className="flex flex-wrap gap-4" variants={slideUp}>
                  <Button
                    size="lg"
                    asChild
                    className="w-full md:w-auto bg-black hover:bg-[#8B5C2A] text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2"
                    >
                      Commencer maintenant
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full md:w-auto border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 rounded-lg px-6 py-3 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                  >
                    <Link
                      to="/login"
                      className="flex items-center justify-center"
                    >
                      Connexion
                    </Link>
                  </Button>
                </motion.div>
                <motion.div className="mt-8 text-center" variants={slideUp}>
                  <p className="text-sm text-orange-600 mb-4">Ou téléchargez l'application mobile</p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="w-full md:w-auto border-orange-300 text-orange-700 hover:bg-yellow-100 hover:text-yellow-800 rounded-lg px-6 py-3 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                    >
                        <a
                        href="https://www.wizi-learn.com/application/wizi-learn.apk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                        >
                            <Smartphone className="h-5 w-5" />
                            Google Play
                        </a>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="w-full md:w-auto border-orange-300 text-orange-700 hover:bg-yellow-100 hover:text-yellow-800 rounded-lg px-6 py-3 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                        <a
                        href="https://apps.apple.com/mg/app/wizi-learn/id6752468866"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                        >
                            <Apple className="h-5 w-5" />
                            App Store
                        </a>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                className="lg:w-1/2 relative order-1 lg:order-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute -top-6 -left-6 w-48 md:w-64 h-48 md:h-64 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -bottom-10 -right-10 w-56 md:w-72 h-56 md:h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600"
                variants={slideUp}
              >
                Nos catégories de formations
              </motion.h2>
              <motion.p
                className="text-gray-600 max-w-3xl mx-auto text-lg"
                variants={slideUp}
              >
                Découvrez notre large éventail de formations pour développer vos
                compétences professionnelles.
              </motion.p>
            </motion.div>
            {/* Mobile */}
            <motion.div
              className="relative md:hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-4 md:gap-5">
                  {[
                    {
                      name: "Bureautique",
                      icon: <FileText className="h-5 w-5" />,
                      bgColor: "bg-bureautique",
                      textColor: "text-white",
                    },
                    {
                      name: "Langues",
                      icon: <MessageSquare className="h-5 w-5" />,
                      bgColor: "bg-langues",
                      textColor: "text-white",
                    },
                    {
                      name: "Internet",
                      icon: <Globe className="h-5 w-5" />,
                      bgColor: "bg-internet",
                      textColor: "text-black",
                    },
                    {
                      name: "Création",
                      icon: <PenTool className="h-5 w-5" />,
                      bgColor: "bg-creation",
                      textColor: "text-white",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.15,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{
                        y: -5,
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div
                        className={`bg-${item.bgColor.split("-")[1]}/10 p-4 rounded-xl flex items-center gap-3 transition-all duration-200 hover:shadow-md`}
                      >
                        <div
                          className={`${item.bgColor} ${item.textColor} p-2 rounded-lg`}
                        >
                          {item.icon}
                        </div>
                        <span className="font-medium text-base">
                          {item.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            {/* Desktop */}
            <motion.div
              className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={slideUp}
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500"
                variants={slideUp}
              >
                Comment ça marche
              </motion.h2>
              <motion.p
                className="text-gray-800 max-w-3xl mx-auto text-lg"
                variants={slideUp}
              >
                Une approche simple et efficace pour améliorer vos compétences
                grâce à notre plateforme de quiz.
              </motion.p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {[
                {
                  step: "1",
                  title: "Choisissez un quiz",
                  description:
                    "Sélectionnez parmi nos quiz, suivant votre formation.",
                  bgColor: "bg-orange-100",
                  textColor: "text-orange-800",
                  icon: <BookOpen className="h-6 w-6" />,
                },
                {
                  step: "2",
                  title: "Testez vos connaissances",
                  description:
                    "Répondez aux questions dans différents formats: QCM, vrai/faux, remplir les blancs et plus encore.",
                  bgColor: "bg-yellow-100",
                  textColor: "text-yellow-800",
                  icon: <ClipboardCheck className="h-6 w-6" />,
                },
                {
                  step: "3",
                  title: "Suivez votre progression",
                  description:
                    "Consultez vos statistiques, comparez vos performances et remportez des défis pour gagner des points.",
                  bgColor: "bg-green-100",
                  textColor: "text-green-800",
                  icon: <TrendingUp className="h-6 w-6" />,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`${item.bgColor} p-8 rounded-2xl shadow-md transition-all hover:shadow-xl`}
                  variants={slideUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div
                    className={`w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center mb-6`}
                  >
                    <div className={`${item.textColor}`}>{item.icon}</div>
                  </div>
                  <div
                    className={`${item.textColor} font-bold text-lg mb-2`}
                  >
                    Étape {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
