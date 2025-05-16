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
  const desc = stripHtml(formation.description)?.slice(0, 120) ||
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
    <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-1 my-8">
      {selected.map((formation, idx) => {
        const ad = ads[idx];
        return (
          <div
            key={formation.id || idx}
            className="rounded-xl shadow-lg bg-white p-6 flex flex-col justify-between border border-gray-100 hover:shadow-2xl transition-all"
          >
            <h3 className="text-xl font-bold mb-2 text-blue-700">{ad.title}</h3>
            <p className="mb-2 text-gray-700">{ad.description}</p>
            <p className="mb-4 text-green-700 font-semibold">{ad.benefit}</p>
            <Button asChild className="w-full mt-auto">
              <a href={"/catalogue/" + (formation.id || "")}>
                {ad.cta}
              </a>
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default AdCatalogueBlock;
