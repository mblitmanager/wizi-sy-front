import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderSectionProps {
  titre: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function HeaderSection({
  titre,
  buttonText = "Retour",
  onButtonClick,
}: HeaderSectionProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r  from-blue-custom-100 to-blue-custom-50">
        {titre}
      </h3>
      <Button
        onClick={handleClick}
        variant="outline"
        className=" h-8 text-xs flex items-center justify-center gap-1 bg-black hover:bg-[#8B5C2A] text-white transition-colors duration-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Retour
      </Button>
    </div>
  );
}
