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
    `🚀 ${titre} : Passez à la vitesse supérieure !`,
    `🌟 Découvrez « ${titre} » !`,
    `🎯 ${titre} : Votre nouvel atout !`,
  ];
  const descriptions = [
    desc,
    "Développez vos compétences avec des modules interactifs et concrets.",
    "Rejoignez une communauté d'apprenants motivés et bénéficiez d'un accompagnement personnalisé.",
  ];
  const benefits = [
    "Progressez à votre rythme et boostez votre carrière.",
    "Accédez à des ressources exclusives et des conseils d'experts.",
    "Valorisez votre CV avec une certification reconnue.",
  ];
  const ctas = [
    "Découvrez maintenant",
    "Je m’inscris",
    "Commencer la formation",
  ];
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    benefit: benefits[Math.floor(Math.random() * benefits.length)],
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

  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-6 px-6 py-8 bg-white/20 rounded-2xl shadow-xl">
      {selected.map((formation, idx) => {
        const ad = ads[idx];
        return (
          <div
            key={formation.id || idx}
            className="flex flex-col justify-between h-full p-6 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
                {ad.emoji} <span>{ad.title}</span>
              </h3>
              <p className="text-gray-600 mb-2">{ad.description}</p>
              <p className="text-green-700 font-medium">{ad.benefit}</p>
            </div>
            <Button
              asChild
              className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white"
            >
              <a href={`/catalogue/${formation.id || ""}`}>{ad.cta}</a>
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default AdCatalogueBlock;
