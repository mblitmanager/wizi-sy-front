import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface DownloadPdfButtonProps {
  formationId: string | number;
}

const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ formationId }) => {
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    const apiUrl = `${import.meta.env.VITE_API_URL}/catalogueFormations/formations/${formationId}/pdf`;
    const token = localStorage.getItem("token"); // Retrieve the JWT token from local storage
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from local storage
      const lien = await axios.get(
        apiUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the JWT token to the headers
          },
        }
      );
      // Récupérer l'URL du PDF depuis la réponse (tableau, premier élément)
      const pdfUrl = lien.data[0];
      console.log("Lien de téléchargement:", pdfUrl);
      // Solution sans CORS : déclencher le téléchargement via un lien
      const link = document.createElement('a');
      link.href = pdfUrl;
      // link.setAttribute('download', `formation_${formationId}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      window.open(pdfUrl, '_blank');
      // alert(pdfUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Une erreur s'est produite lors du téléchargement du PDF. Veuillez réessayer plus tard.");
    }
  };

  return (
    <Button
      variant="outline"
      className="flex-none bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg py-3 transition-all shadow-sm hover:shadow-md focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
      onClick={handleClick}
      asChild={false}
    >
      <span className="flex items-center" style={{ color: "#B07661" }}>
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Brochure PDF
        <span className="sr-only">Télécharger la brochure PDF</span>
      </span>
      
    </Button>
  );
};

export default DownloadPdfButton;
