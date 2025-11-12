import React, { useMemo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { CatalogueFormation } from "@/types/stagiaire";
import DownloadPdfButton from "@/components/FeatureHomePage/DownloadPdfButton";
import { inscrireAFormation } from "@/services/inscriptionApi";
import {
  BUREAUTIQUE,
  CREATION,
  FORMATIONMETADATA,
  INTERNET,
  LANGUES,
  IA,
} from "@/utils/constants";

import { ArrowRight, Clock, Loader2, User, X, CheckCircle } from "lucide-react";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import { Link, useNavigate } from "react-router-dom";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;

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

  const titles = [titre];
  const descriptions = [
    desc,
    "Développez vos compétences avec des modules interactifs et concrets.",
    "Rejoignez une communauté d'apprenants motivés et bénéficiez d'un accompagnement personnalisé.",
  ];
  const ctas = ["Découvrez maintenant", "Commencer la formation"];
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    cta: ctas[Math.floor(Math.random() * ctas.length)],
    emoji,
    formation,
  };
}

interface AdCatalogueBlockProps {
  formations: CatalogueFormation[];
}

// Composant Modal pour le succès de l'inscription
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  formationTitle: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  message,
  formationTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Demande d'inscription envoyée avec succès !
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 mb-3">
            Votre demande d'inscription a été envoyée pour la formation :
          </p>
          <p className="font-semibold text-gray-900 mb-4 text-center bg-gray-50 py-2 px-4 rounded-lg">
            {formationTitle}
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm text-center">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Continuer à explorer
          </button>
        </div>
      </div>
    </div>
  );
};

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

  // États pour le modal de succès
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successFormationTitle, setSuccessFormationTitle] = useState("");

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
      const response = await inscrireAFormation(selected[idx]?.id);

      // Afficher le modal de succès avec le message de l'API
      setSuccessMessage(
        response.message ||
          "Inscription réussie, mails et notification envoyés."
      );
      setSuccessFormationTitle(selected[idx]?.titre || "Formation");
      setShowSuccessModal(true);
      setInscriptionSuccessIdx(idx);
    } catch (e) {
      setInscriptionErrorIdx(idx);
    } finally {
      setInscriptionLoading(null);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
    setSuccessFormationTitle("");
  };

  const formatTitle = (title: string) => {
    if (!title) return "Sans titre";
    return title
      .replace(/formations?/gi, "")
      .trim()
      .replace(/\s{2,}/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  if (!formations || formations.length === 0) return null;

  return (
    <>
      {/* Header avec gradient accrocheur */}
      <div className="flex justify-between items-center mb-8">
        <div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selected.map((formation, idx) => {
          const isOpen = showDetailsIdx === idx;
          return (
            <div
              key={formation.id || idx}
              onClick={() => setShowDetailsIdx(isOpen ? null : idx)}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 cursor-pointer">
              {/* Image de fond avec overlay */}
              {formation.image_url && (
                <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm group hover:shadow-md transition-all duration-300">
                  {/* Image dans une bulle à droite */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-md flex-shrink-0">
                    <img
                      src={VITE_API_URL_MEDIA + "/" + formation.image_url}
                      alt={formation.formation?.titre || formation.titre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* Texte à gauche */}
                  <div className="flex-1 pr-4">
                    <h3 className="text-m font-bold text-gray-900 mb-2 text-center">
                      {formatTitle(formation?.titre || "Sans titre")}
                    </h3>
                  </div>
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
                  {formation.certification && (
                    <div className="top-4 right-4 bg-yellow-400 text-amber-800 text-xs font-bold px-3 py-1 rounded-full z-10">
                      {formation.certification}
                    </div>
                  )}
                </div>

                {/* Description avec effet "Lire plus" */}
                <div
                  className="text-gray-600 text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(formation.description || ""),
                  }}
                />

                {/* Infos clés (Durée, Prix) */}
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formation.formation?.duree || formation.duree} heures
                  </span>
                  <span className="text-lg font-extrabold text-orange-600">
                    {Number(formation.tarif) > 0
                      ? `${Math.round(Number(formation.tarif))
                          .toLocaleString("fr-FR", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })
                          .replace(/\s/g, "\u00A0")} €`
                      : "À la demande"}
                  </span>
                </div>

                {/* Bouton principal - Effet "Shine" au hover */}
                {isOpen && (
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleInscription(idx);
                    }}
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
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de succès */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        message={successMessage}
        formationTitle={successFormationTitle}
      />
    </>
  );
};

export default AdCatalogueBlock;
