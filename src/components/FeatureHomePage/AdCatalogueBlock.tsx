import React, { useMemo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { CatalogueFormation } from "@/types/stagiaire";
import DownloadPdfButton from "@/components/FeatureHomePage/DownloadPdfButton";
import { inscrireAFormation } from "@/services/inscriptionApi";
import {
  BUREAUTIQUE,
  CATALOGUE_FORMATION_DETAILS,
  CREATION,
  INTERNET,
  LANGUES,
  RETOUR,
} from "@/utils/langue-type";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, ClockIcon, EuroIcon } from "lucide-react";

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
}
const AdCatalogueBlock: React.FC<AdCatalogueBlockProps> = ({ formations }) => {
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
    <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-3 px-4 py-3 mt-[-10%]">
      {selected.map((formation, idx) => {
        const ad = ads[idx];
        const isOpen = showDetailsIdx === idx;
        return (
          <div
            key={formation.id || idx}
            className="flex flex-col justify-between h-full rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            style={{
              minHeight: "340px",
              backgroundImage: formation.image_url ? `url(${formation.image_url})` : undefined,
              backgroundSize: formation.image_url ? 'cover' : undefined,
              backgroundPosition: formation.image_url ? 'center' : undefined,
              backgroundRepeat: 'no-repeat',
              backgroundColor: formation.image_url ? 'rgba(255,255,255,0.95)' : undefined,
            }}
          >
            {formation.image_url && (
              <div
                className="absolute inset-0 w-full h-full bg-white"
                style={{ opacity: 0.95, zIndex: 1 }}
                aria-hidden="true"
              />
            )}
            <div className="relative z-10">
              {/* Header Section */}
              <div className="p-5 space-y-4">
                {/* Category Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  {formation.formation ? (
                    <>
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full border"
                        style={{
                          color:
                            formation.formation.categorie === "Bureautique"
                              ? "#3D9BE9"
                              : formation.formation.categorie === "Langues"
                              ? "#A55E6E"
                              : formation.formation.categorie === "Internet"
                              ? "#FFC533"
                              : formation.formation.categorie === "Création"
                              ? "#9392BE"
                              : "#888",
                          borderColor: "currentColor",
                          backgroundColor: "transparent",
                        }}
                      >
                        {formation.formation.categorie?.toUpperCase() ||
                          "CATÉGORIE"}
                      </span>
                      <span
                        className="text-xs text-white px-3 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor:
                            formation.formation.categorie === "Bureautique"
                              ? "#3D9BE9"
                              : formation.formation.categorie === "Langues"
                              ? "#A55E6E"
                              : formation.formation.categorie === "Internet"
                              ? "#FFC533"
                              : formation.formation.categorie === "Création"
                              ? "#9392BE"
                              : "#888",
                        }}
                      >
                        {formatTitle(formation?.formation?.titre || "FORMATION")}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {formatTitle(formation?.titre) || "SANS TITRE"}
                    </span>
                  )}
                </div>

                {/* Content Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors">
                    {formatTitle(ad.title.toUpperCase()) || "SANS TITRE"}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {ad.description}
                  </p>
                </div>
              </div>

              {/* Details Section */}
              {formation.formation && isOpen && (
                <div className="px-5 pb-3 space-y-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        <span>
                          <strong>Durée :</strong>{" "}
                          {formation.formation.duree || formation.duree} heures
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <EuroIcon className="w-4 h-4 mr-2" />
                        <span>
                          <strong>Tarif :</strong>{" "}
                          <span className="text-orange-600 font-extrabold drop-shadow-lg">
                            {formation.tarif
                              ? `${
                                  Number.isInteger(Number(formation.tarif))
                                    ? parseInt(formation.tarif)
                                    : formation.tarif
                                } € HT`
                              : "-"}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <BadgeCheckIcon className="w-4 h-4 mr-2" />
                        <span>
                          <strong>Certification :</strong>{" "}
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                            {formation.certification || "-"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center pt-2">
                    <DownloadPdfButton formationId={formation.id} />
                  </div>
                </div>
              )}

              {/* Footer Section */}
              <div className="p-5 pt-0 space-y-3 border-t border-gray-100">
                {/* Toggle Details Button */}
                {formation.formation && (
                  <button
                    onClick={() => setShowDetailsIdx(isOpen ? null : idx)}
                    className="w-full text-center text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors"
                  >
                    {isOpen ? "Voir moins de détails" : "Voir plus de détails"}
                  </button>
                )}

                {/* Registration Button */}
                <Button
                  onClick={() => handleInscription(idx)}
                  disabled={inscriptionLoading === idx}
                  className="w-full bg-[#8B5C2A] hover:bg-[#A56B32] text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
                >
                  {inscriptionLoading === idx
                    ? "Inscription en cours..."
                    : "S'inscrire à la formation"}
                </Button>

                {/* Status Messages */}
                <div className="text-center">
                  {inscriptionSuccessIdx === idx &&
                    inscriptionLoading === null && (
                      <p className="text-green-600 text-sm">
                        Inscription réussie !
                      </p>
                    )}
                  {inscriptionErrorIdx === idx && inscriptionLoading === null && (
                    <p className="text-red-600 text-sm">
                      Erreur lors de l'inscription. Veuillez réessayer.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdCatalogueBlock;
