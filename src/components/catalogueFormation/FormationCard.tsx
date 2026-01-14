import { FormationCardData } from "@/types/Formation";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { 
  Clock, 
  Share2, 
  Bot, 
  Paintbrush, 
  Laptop, 
  Globe, 
  Globe2,
  LucideIcon 
} from "lucide-react";
import { CATEGORIES } from "@/utils/constants";
import { ActionTooltip } from "../ui/action-tooltip";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG: Record<string, { icon: LucideIcon; color: string; bgColor: string }> = {
  [CATEGORIES.BUREAUTIQUE]: {
    icon: Laptop,
    color: "#3D9BE9",
    bgColor: "bg-[#3D9BE9]/10",
  },
  [CATEGORIES.LANGUES]: {
    icon: Globe2,
    color: "#A55E6E",
    bgColor: "bg-[#A55E6E]/10",
  },
  [CATEGORIES.IA]: {
    icon: Bot,
    color: "#ABDA96",
    bgColor: "bg-[#ABDA96]/10",
  },
  [CATEGORIES.INTERNET]: {
    icon: Globe,
    color: "#FFC533",
    bgColor: "bg-[#FFC533]/10",
  },
  [CATEGORIES.CREATION]: {
    icon: Paintbrush,
    color: "#9392BE",
    bgColor: "bg-[#9392BE]/10",
  },
};

const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_MEDIA;

const FormationCard = ({ formation }: { formation: FormationCardData }) => {
  const navigate = useNavigate();

  const getCategoryFromFormation = (f: unknown): string => {
    if (!f || typeof f !== "object") return "";
    const obj = f as Record<string, any>;
    if (obj.formation?.categorie) return obj.formation.categorie;
    if (obj.categorie) return obj.categorie;
    return "";
  };

  const categoryString = getCategoryFromFormation(formation);
  const config = CATEGORY_CONFIG[categoryString] || {
    icon: Laptop,
    color: "#6b7280",
    bgColor: "bg-gray-100",
  };
  
  const Icon = config.icon;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: formation.titre,
      text: `Découvrez la formation "${formation.titre}" sur Wizi Learn!\n\n${stripHtml(formation.description || "").substring(0, 100)}...`,
      url: window.location.origin + `/catalogue-formation/${formation.id}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        console.error("Error sharing:", err);
      });
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success("Lien de la formation copié !");
    }
  };

  const handleClick = () => {
    navigate(`/catalogue-formation/${formation.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative flex items-center p-4 bg-[#F8F9FA] border border-gray-100 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden gap-4 min-h-[140px]"
    >
      {/* Left side: Icon Circle */}
      <div className={cn(
        "flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 border-white shadow-inner",
        config.bgColor
      )}>
        {formation.image_url && !formation.image_url.endsWith(".mp4") && !formation.image_url.endsWith(".mp3") ? (
          <img 
            src={`${VITE_API_URL_IMG}/${formation.image_url}`} 
            alt={formation.titre}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Icon 
            className="w-10 h-10 sm:w-12 sm:h-12" 
            style={{ color: config.color }} 
          />
        )}
      </div>

      {/* Right side: Content */}
      <div className="flex-grow flex flex-col justify-between py-1">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-extrabold text-[#111] uppercase leading-tight line-clamp-2">
            {formation.titre}
          </h3>
          <div 
            className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-tight"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(formation.description || ""),
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 bg-white/60 px-2 py-1 rounded-full border border-gray-100">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] sm:text-xs font-bold text-gray-600">
              {formation.duree || 0}h
            </span>
          </div>

          <ActionTooltip label="Partager cette formation">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white text-[#ABDA96] transition-colors"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </ActionTooltip>
        </div>
      </div>
    </div>
  );
};

export default FormationCard;
