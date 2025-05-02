
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
  onButtonClick 
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
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">{titre}</h1>
      <Button 
        variant="outline" 
        onClick={handleClick}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
}
