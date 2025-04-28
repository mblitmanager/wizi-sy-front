
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  onFinish 
}: QuizNavigationProps) {
  return (
    <div className="flex justify-between mt-auto pt-3 gap-2 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-t">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={activeStep === 0}
        className="min-w-[120px]"
        style={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Précédent
      </Button>
      <Button
        onClick={activeStep === totalSteps - 1 ? onFinish : onNext}
        className="min-w-[120px]"
      >
        {activeStep === totalSteps - 1 ? 'Terminer' : 'Suivant'}
        {activeStep !== totalSteps - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
}
