import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CatalogueFormation } from "@/types/stagiaire";

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

function getRandomItems<T>(array: T[], n: number): T[] {
  const arr = [...array];
  const result: T[] = [];
  while (arr.length && result.length < n) {
    const idx = Math.floor(Math.random() * arr.length);
    result.push(arr.splice(idx, 1)[0]);
  }
  return result;
}

function getAdContent(formation: CatalogueFormation) {
  const titre = formation.titre || "Formation";
  const desc =
    stripHtml(formation.description)?.slice(0, 120) ||
    "Une formation incontournable pour progresser rapidement.";
  const titles = [
    `🚀 ${titre}`,
    `🌟 ${titre} `,
    `🎯 ${titre}`,
  ];
  const descriptions = [
    desc,
    "Développez vos compétences avec des modules interactifs et concrets.",
    "Rejoignez une communauté d'apprenants motivés et bénéficiez d'un accompagnement personnalisé.",
  ];
  // const benefits = [
  //   "Progressez à votre rythme et boostez votre carrière.",
  //   "Accédez à des ressources exclusives et des conseils d'experts.",
  //   "Valorisez votre CV avec une certification reconnue.",
  // ];
  const ctas = [
    "Découvrez maintenant",
    "Je m’inscris",
    "Commencer la formation",
  ];
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    // benefit: benefits[Math.floor(Math.random() * benefits.length)],
    cta: ctas[Math.floor(Math.random() * ctas.length)],
  };
}

interface AdCatalogueBlockProps {
  formations: CatalogueFormation[];
}

const AdCatalogueBlock: React.FC<AdCatalogueBlockProps> = ({ formations }) => {
  const selected = useMemo(() => getRandomItems(formations, 3), [formations]);
  const ads = useMemo(() => selected.map(getAdContent), [selected]);

  if (!formations || formations.length === 0) return null;
  console.log("ads", ads);
  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-3 px-4 py-3">
      {selected.map((formation, idx) => {
        const ad = ads[idx];
        return (
          <div
            key={formation.id || idx}
            className="flex flex-col justify-between h-full rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            style={{ minHeight: "320px" }} // Hauteur fixe pour l'uniformité
          >
            <div className="p-5">
              {/* En-tête avec emoji et badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl animate-wiggle">
                  {ad.emoji || "📚"}
                </span>
                <span className="text-xs bg-blue-100/80 text-blue-800 px-3 py-1 rounded-full font-medium uppercase tracking-wider">
                  Formation
                </span>
              </div>

              {/* Contenu texte */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {ad.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {ad.description}
                </p>
                {/* <div className="flex items-center text-green-600 text-xs font-medium">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {ad.benefit}
                </div> */}
              </div>
            </div>

            {/* Bouton avec effet de gradient amélioré */}
            <div className="px-5 pb-5">
              <Button
                asChild
                className="w-full bg-gradient-to-r bg-blue-custom-300 hover:to-blue-700 text-white font-medium rounded-lg py-3 transition-all shadow-sm hover:shadow-md"
              >
                <a href={`/catalogue/${formation.id || ""}`}>
                  <span className="drop-shadow-sm">{ad.cta}</span>
                </a>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdCatalogueBlock;
