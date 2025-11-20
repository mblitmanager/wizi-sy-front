import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Apple } from "lucide-react";

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export function Hero({ logo }: { logo: string }) {
  return (
    <section className="py-12 md:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ Inversion sur mobile : logo au-dessus du texte */}
        <div className="flex flex-col-reverse items-center gap-8 md:gap-12">
          {/* ✅ Texte principal */}
          <motion.div
            className="space-y-6 md:space-y-12 "
            initial="hidden"
            animate="visible"
            variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
            layout="position"
            layoutId="hero-content"
            transition={{ type: "spring", bounce: 0.2 }}>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600"
              variants={slideUp}>
              Apprenez de façon interactive et ludique
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-700 leading-relaxed"
              variants={slideUp}>
              Bienvenue sur Wizi Learn, la plateforme de quiz éducatifs pour nos
              stagiaires. Testez vos connaissances, suivez votre progression et
              développez vos compétences professionnelles.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center gap-4"
              variants={slideUp}>
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl px-8 py-4 shadow-xl transition-all duration-200 hover:shadow-2xl focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-3">
                  Se connecter
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
            </motion.div>

            <motion.div className="mt-8 text-center" variants={slideUp}>
              <p className="text-sm text-orange-600 mb-4 font-medium">
                Ou téléchargez l'application mobile
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center">
                <div className="flex flex-col items-center">
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full md:w-auto border-orange-300 text-orange-700 bg-white rounded-full px-6 py-3 flex items-center gap-3 shadow-sm hover:bg-orange-50 transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-orange-300">
                    <a
                      href="https://apps.apple.com/mg/app/wizi-learn/id6752468866"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Ouvrir la page Wizi Learn sur l'App Store"
                      className="flex items-center justify-center gap-2">
                      <Apple className="h-5 w-5" aria-hidden="true" />
                      App Store
                    </a>
                  </Button>
                  <span className="text-xs text-gray-500 mt-2">
                    iOS • App Store
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    size="lg"
                    asChild
                    className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full px-6 py-3 flex items-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-orange-400">
                    <a
                      href="./application/wizi-learn.apk"
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Télécharger l'APK Wizi Learn pour Android"
                      className="flex items-center justify-center gap-2">
                      <Smartphone className="h-5 w-5" aria-hidden="true" />
                      Télécharger APK
                    </a>
                  </Button>
                  <span className="text-xs text-gray-500 mt-2">
                    Version Android • fichier APK
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          {/* ✅ Logo (placé au-dessus sur mobile, à droite sur desktop) */}
          <motion.div
            className="lg:w-1/2 relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}>
            <div className="w-full max-w-md p-6 flex items-center justify-center">
              <img
                src={logo}
                alt="NS Conseil logo"
                className="max-w-[200px] md:max-w-[300px] lg:max-w-full h-auto object-contain mx-auto"
                loading="lazy"
              />
              <img
                src="./assets/logo.png"
                alt="Wizi Learn logo"
                className="max-w-[200px] md:max-w-[300px] lg:max-w-full h-auto object-contain mx-auto"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
