import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface DownloadPdfButtonProps {
  formationId: string | number;
}

const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({
  formationId,
}) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const lien = await api.get(`/catalogueFormations/formations/${formationId}/pdf`);
      // Récupérer l'URL du PDF depuis la réponse (tableau, premier élément)
      const pdfUrl = lien.data[0];
      window.open(pdfUrl, "_blank", "noopener");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert(
        "Une erreur s'est produite lors du téléchargement du PDF. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="flex-none bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg py-3 transition-all shadow-sm hover:shadow-md focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
      onClick={handleClick}
      asChild={false}
      disabled={loading}>
      <span className="flex items-center" style={{ color: "#B07661" }}>
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-2 text-gray-500"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Chargement...
          </>
        ) : (
          <>
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
            Télécharger le programme de formation
          </>
        )}
        <span className="sr-only">Télécharger la programme </span>
      </span>
    </Button>
  );
};

export default DownloadPdfButton;
