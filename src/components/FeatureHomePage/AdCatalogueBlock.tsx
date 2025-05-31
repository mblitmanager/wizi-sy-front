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
  const [inscriptionLoading, setInscriptionLoading] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [inscriptionSuccess, setInscriptionSuccess] = useState<string | null>(null);
  const [inscriptionError, setInscriptionError] = useState<string | null>(null);

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
    setInscriptionSuccess(null);
    setInscriptionError(null);
    try {
      await inscrireAFormation(selected[idx]?.id);
      setInscriptionSuccess("Inscription réussie !");
    } catch (e) {
      setInscriptionError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setInscriptionLoading(null);
    }
  };

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
                {/* <span className="text-3xl animate-bounce-slow drop-shadow-sm select-none">
                  {ad.emoji || "📚"}
                </span> */}
                {/* Badge catégorie avant le bouton PDF */}
                {formation.formation && (
                  <div className="pt-2 pb-2 w-full flex items-center gap-2">
                    <span
                      className="inline-block text-xs rounded-full px-3 py-1 font-semibold"
                      style={{
                        color: formation.formation.categorie === "Bureautique"
                          ? "#3D9BE9"
                          : formation.formation.categorie === "Langues"
                            ? "#A55E6E"
                            : formation.formation.categorie === "Internet"
                              ? "#FFC533"
                              : formation.formation.categorie === "Création"
                                ? "#9392BE"
                                : "#888",
                        backgroundColor: "transparent",
                      }}
                    >
                      {(formation.formation.categorie || "Non spécifiée").toUpperCase()} :
                    </span>
                    <span className="text-xs text-white px-3 py-1 rounded-full font-medium uppercase tracking-wider shadow-sm"   style={{
                        backgroundColor: formation.formation.categorie === "Bureautique"
                          ? "#3D9BE9"
                          : formation.formation.categorie === "Langues"
                            ? "#A55E6E"
                            : formation.formation.categorie === "Internet"
                              ? "#FFC533"
                              : formation.formation.categorie === "Création"
                                ? "#9392BE"
                                : "#888",
                        
                      }}>
                      {formation.formation?.titre || formation.titre || "Formation"}
                    </span>
                  </div>
                )}
                {!formation.formation && (
                  <span className="text-xs text-orange-600 px-3 py-1 rounded-full font-medium uppercase tracking-wider shadow-sm">
                    {formation.titre || "Formation"}
                  </span>
                )}

              </div>

              {/* Contenu texte */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                  {ad.title.toUpperCase()}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {ad.description}
                </p>
              </div>
            </div>
        <div className="flex flex-col items-center">
      {/* Bouton Voir plus */}
      {formation.formation && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-orange-500 text-sm mb-2 underline focus:outline-none"
        >
          {showDetails ? "Voir moins" : "Voir plus"}
        </button>
      )}
      

      {/* Bloc détaillé */}
      {formation.formation && showDetails && (
        
        <div className="overflow-hidden w-full justify-center">
         
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2 p-6 space-y-4">
              <div className="p-0 text-gray-700 dark:text-gray-300 space-y-2">
                <ul className="text-sm space-y-1">
                  <li className="text-gray-500">
                    <strong>Durée :</strong> {formation.formation.duree || formation.duree} heures
                  </li>
                  <li className="text-gray-500">
                    <strong>Tarif :</strong> {formation.tarif ? `${formation.tarif} € HT` : "-"}
                  </li>
                  <li className="text-gray-500">
                    <strong>Certification :</strong>{" "}
                    <span className="inline-block bg-yellow-500 text-orange-800 text-xs px-2 py-1 rounded font-medium">
                      {formation.certification || "-"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
           <div className="flex justify-center w-full">
        <DownloadPdfButton formationId={formation.id} />
      </div>
            
      
        </div>
      )}

    
    </div>
  
            <div className="flex gap-2 w-full mt-3 justify-center">

              <div className="pt-2">
                <Button
                  onClick={() => handleInscription(idx)}
                  disabled={inscriptionLoading === idx}
                  className="w-full md:w-auto bg-[#8B5C2A]  hover:bg-[#FFC533] text-white font-semibold shadow-md transition"
                >
                  {inscriptionLoading === idx
                    ? "Inscription en cours..."
                    : "S'inscrire à la formation"}
                </Button>
                {inscriptionSuccess && inscriptionLoading === null && (
                  <div className="text-yellow-400 mt-2 text-sm">
                    {inscriptionSuccess}
                  </div>
                )}
                {inscriptionError && inscriptionLoading === null && (
                  <div className="text-red-600 mt-2 text-sm">
                    {inscriptionError}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdCatalogueBlock;
