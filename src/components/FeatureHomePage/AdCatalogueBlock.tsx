import React, { useMemo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { CatalogueFormation } from "@/types/stagiaire";
import DownloadPdfButton from "@/components/FeatureHomePage/DownloadPdfButton";
import { inscrireAFormation } from "@/services/inscriptionApi";
import { BUREAUTIQUE, CREATION, INTERNET, LANGUES } from "@/utils/constants";

import { ArrowRight, Clock, Loader2, User } from "lucide-react";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import { Link, useNavigate } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;
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
    // "Je m'inscris",
    "Commencer la formation",
  ];
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    cta: ctas[Math.floor(Math.random() * ctas.length)],
    emoji,
    formation, // <-- Ajout de la formation d'origine
  };
}

interface AdCatalogueBlockProps {
  formations: CatalogueFormation[];
  // stagiaireId?: string | number;
}
const AdCatalogueBlock: React.FC<AdCatalogueBlockProps> = ({ formations }) => {
  const navigate = useNavigate();
  const [inscriptionLoading, setInscriptionLoading] = useState<number | null>(
    null
  );
  const [showDetailsIdx, setShowDetailsIdx] = useState<number | null>(null);
  const [inscriptionSuccessIdx, setInscriptionSuccessIdx] = useState<
    number | null
  >(null);
  const [inscriptionErrorIdx, setInscriptionErrorIdx] = useState<number | null>(
    null
  );

  const getCategoryColor = useCallback((category?: string): string => {
    switch (category) {
      case BUREAUTIQUE:
        return "#3D9BE9";
      case LANGUES:
        return "#A55E6E";
      case INTERNET:
        return "#FFC533";
      case CREATION:
        return "#9392BE";
      default:
        return "#E0E0E0";
    }
  }, []);
  const selected = useMemo(() => getRandomItems(formations, 3), [formations]);
  const ads = useMemo(() => selected.map(getAdContent), [selected]);

  const handleInscription = async (idx: number) => {
    setInscriptionLoading(idx);
    setInscriptionSuccessIdx(null);
    setInscriptionErrorIdx(null);
    try {
      await inscrireAFormation(selected[idx]?.id);
      setInscriptionSuccessIdx(idx);
    } catch (e) {
      setInscriptionErrorIdx(idx);
    } finally {
      setInscriptionLoading(null);
    }
  };

  const formatTitle = (title: string) => {
    if (!title) return "Sans titre";
    return title
      .replace(/formations?/gi, "")
      .trim()
      .replace(/\s{2,}/g, " ") // Supprime les espaces multiples
      .replace(/^\w/, (c) => c.toUpperCase()); // Première lettre en majuscule
  };

  if (!formations || formations.length === 0) return null;
  return (
    <div className="mb-12 px-4 sm:px-6 lg:px-8">
      {/* Header avec gradient accrocheur */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
            Boostez vos compétences dès aujourd'hui !
          </h2>
          <p className="text-gray-600 mt-2">
            Des formations certifiantes adaptées à vos besoins.
          </p>
        </div>
        <Link
          to="/catalogue"
          className="group flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold transition-colors">
          Explorer le catalogue
          <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid des formations - Design "Card Hover" */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {selected.map((formation, idx) => {
          const isOpen = showDetailsIdx === idx;
          return (
            <div
              key={formation.id || idx}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              {/* Badge "Populaire" ou "Certifié" */}
              {formation.certification && (
                <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full z-10">
                  {formation.certification}
                </div>
              )}

              {/* Image de fond avec overlay */}
              {formation.image_url && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={formation.image_url}
                    alt={formation.formation?.titre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}

              {/* Contenu de la carte */}
              <div className="p-6">
                {/* Catégorie + Titre */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        getCategoryColor(formation.formation?.categorie) + "20",
                      color: getCategoryColor(formation.formation?.categorie),
                    }}>
                    {formation.formation?.categorie?.toUpperCase() ||
                      "FORMATION"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]">
                  {formatTitle(formation?.titre || "Sans titre")}
                </h3>

                {/* Description avec effet "Lire plus" */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {stripHtmlTags(formation.description) ||
                    "Description non disponible"}
                </p>

                {/* Infos clés (Durée, Prix) */}
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formation.formation?.duree || formation.duree} heures
                  </span>
                  <span className="text-lg font-extrabold text-orange-600">
                    {formation.tarif
                      ? `${Math.trunc(Number(formation.tarif)).toLocaleString(
                          "fr-FR"
                        )} € HT`
                      : "Gratuit"}
                  </span>
                </div>

                {/* Bouton principal - Effet "Shine" au hover */}
                <button
                  onClick={() => handleInscription(idx)}
                  disabled={inscriptionLoading === idx}
                  className={`
                    w-full relative overflow-hidden
                    bg-black
                    text-white font-bold py-3 px-6 rounded-lg
                    shadow-md hover:shadow-lg transition-all
                    hover:brightness-110
                    ${inscriptionLoading === idx ? "opacity-80" : ""}
                  `}>
                  <span className="relative z-10">
                    {inscriptionLoading === idx ? (
                      <span className="flex justify-center">
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Traitement...
                      </span>
                    ) : (
                      "S'inscrire maintenant"
                    )}
                  </span>
                  {/* Effet shine au survol */}
                  <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                </button>

                {/* Témoignage factice (optionnel) */}
                {/* <div className="mt-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500 italic">
                      "Formation très pratique, j'ai doublé mon salaire après
                      cette certification !"
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdCatalogueBlock;
