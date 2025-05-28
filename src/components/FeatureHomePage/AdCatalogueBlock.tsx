import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CatalogueFormation } from "@/types/stagiaire";
import DownloadPdfButton  from "@/components/FeatureHomePage/DownloadPdfButton"; 

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
    stripHtml(formation.description) ||
    "Une formation incontournable pour progresser rapidement.";
  // Associe une icône à chaque formation selon le titre
  const iconMap: Record<string, string> = {
    word: "📝",
    excel: "📊",
    powerpoint: "📈",
    outlook: "📧",
    photoshop: "🖌️",
    illustrator: "🎨",
    google: "🌐",
    googleworkspace: "🌐",
    docs: "📄",
    sheets: "📊",
    slides: "📈",
    wordpress: "🌍",
    gimp: "🦊",
    sketchup: "🏗️",
    canva: "🎬",
    notion: "🗒️",
    figma: "🖼️",
    autocad: "📐",
    indesign: "📚",
    premiere: "🎥",
    aftereffects: "✨",
    lightroom: "🌅",
    affinity: "🖌️",
    "google office": "🌐",
  };
  const titreKey = titre.toLowerCase();
  const emoji =
    Object.entries(iconMap).find(([key]) => titreKey.includes(key))?.[1] || "📚";

  const titles = [
    titre
    // ,
    // `Nouveau : ${titre}`,
    // `À découvrir : ${titre}`,
    // `Boostez vos compétences avec ${titre}`,
  ];
  const descriptions = [
    desc,
    "Développez vos compétences avec des modules interactifs et concrets.",
    "Rejoignez une communauté d'apprenants motivés et bénéficiez d'un accompagnement personnalisé.",
  ];
  const ctas = [
    "Découvrez maintenant",
    "Je m'inscris",
    // "Commencer la formation",
  ];
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    cta: ctas[Math.floor(Math.random() * ctas.length)],
    emoji,
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
            className="flex flex-col justify-between h-full rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
            style={{ minHeight: "340px" }}
          >
            <div className="p-5">
              {/* En-tête avec emoji et badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl animate-bounce-slow drop-shadow-sm select-none">
                  {ad.emoji || "📚"}
                </span>
                <span className="text-xs bg-blue-100/80 text-blue-800 px-3 py-1 rounded-full font-medium uppercase tracking-wider shadow-sm">
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
              </div>
            </div>

            {/* Bouton avec effet de gradient amélioré */}
            <div className="px-5 pb-5 flex flex-col items-center justify-center">
              <DownloadPdfButton formationId={formation.id} />
              <div className="flex gap-2 w-full mt-3">
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg py-3 transition-all shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              >
                <a href={`/catalogue-formation/${formation.id || ""}`}>
                <span className="drop-shadow-sm">{ad.cta}</span>
                </a>
              </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdCatalogueBlock;
