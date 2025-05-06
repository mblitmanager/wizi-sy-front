
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuizNavigationProps {
  activeStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export function QuizNavigation({
  activeStep,
  totalSteps,
  onBack,
  onNext,
  onFinish,
}: QuizNavigationProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between mt-auto pt-3 gap-2 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-t">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={activeStep === 0}
        className={`${isMobile ? 'px-3' : 'min-w-[120px]'}`}
        style={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
      >
        <ChevronLeft className={`${isMobile ? 'mr-0' : 'mr-2'} h-4 w-4`} />
        {!isMobile && "Précédent"}
      </Button>
      <Button
        onClick={activeStep === totalSteps - 1 ? onFinish : onNext}
        className={`${isMobile ? 'px-3' : 'min-w-[120px]'}`}
      >
        {activeStep === totalSteps - 1
          ? "Terminer"
          : isMobile
          ? ""
          : "Suivant"}
        {activeStep !== totalSteps - 1 && (
          <ChevronRight className={`${isMobile ? 'ml-0' : 'ml-2'} h-4 w-4`} />
        )}
      </Button>
    </div>
  );
}
