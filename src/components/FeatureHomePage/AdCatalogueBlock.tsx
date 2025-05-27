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
    Object.entries(iconMap).find(([key]) => titreKey.includes(key))?.[1] ||
    "📚";

  const titles = [
    titre,
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
    "Commencer la formation",
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
  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-3 px-4 py-3">
      {selected.map((formation, idx) => {
        const ad = ads[idx];
        return (
          <div
            key={formation.id || idx}
            className="flex flex-col justify-between h-full rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
            style={{ minHeight: "340px" }}>
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
            <div className="px-5 pb-5">
              <div className="flex gap-2">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg py-3 transition-all shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">
                  <a href={`/catalogue/${formation.id || ""}`}>
                    <span className="drop-shadow-sm">{ad.cta}</span>
                  </a>
                </Button>
                {/* {formation.cursus_pdf && ( */}
                <Button
                  asChild
                  variant="outline"
                  className="flex-none bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg py-3 transition-all shadow-sm hover:shadow-md focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                  <a
                    href={`/api/catalogueFormations/formations/${formation.id}/download-pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const response = await fetch(
                          `/api/catalogueFormations/formations/${formation.id}/download-pdf`
                        );
                        const data = await response.json();
                        if (data.success && data.data.url) {
                          window.open(data.data.url, "_blank");
                        }
                      } catch (error) {
                        console.error(
                          "Erreur lors du téléchargement du PDF:",
                          error
                        );
                      }
                    }}>
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    PDF
                  </a>
                </Button>
                {/* )} */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdCatalogueBlock;
