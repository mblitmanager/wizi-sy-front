
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

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
  const isLastStep = activeStep === totalSteps - 1;

  // Trigger confetti when user clicks finish
  const handleFinish = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onFinish();
  };

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
    initial: { scale: 1 }
  };

  const dotVariants = {
    active: { scale: [1, 1.5, 1], backgroundColor: "var(--primary)", transition: { duration: 0.5, repeat: 0 } },
    completed: { backgroundColor: "var(--primary-light)", scale: 1 },
    upcoming: { backgroundColor: "var(--muted)", scale: 1 }
  };

  return (
    <div className="flex justify-between mt-auto pt-3 gap-2 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-t z-10">
      <motion.div 
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          variant="outline"
          onClick={onBack}
          disabled={activeStep === 0}
          className={`${isMobile ? 'px-3' : 'min-w-[120px]'} ${activeStep === 0 ? 'opacity-0' : 'opacity-100'} transition-all`}
        >
          <ChevronLeft className={`${isMobile ? 'mr-0' : 'mr-2'} h-4 w-4`} />
          {!isMobile && "Précédent"}
        </Button>
      </motion.div>
      
      <div className="flex items-center">
        {[...Array(totalSteps)].map((_, i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            initial={i <= activeStep ? "completed" : "upcoming"}
            animate={i === activeStep ? "active" : i < activeStep ? "completed" : "upcoming"}
            className={`w-2 h-2 rounded-full mx-1`}
          />
        ))}
      </div>
      
      <motion.div 
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          onClick={isLastStep ? handleFinish : onNext}
          className={`${isMobile ? 'px-3' : 'min-w-[120px]'} ${
            isLastStep
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          {isLastStep 
            ? (
                <>
                  {!isMobile && "Terminer"}
                  <Flag className={`${isMobile ? '' : 'ml-2'} h-4 w-4`} />
                </>
              )
            : (
                <>
                  {!isMobile && "Suivant"}
                  <ChevronRight className={`${isMobile ? '' : 'ml-2'} h-4 w-4`} />
                </>
              )
          }
        </Button>
      </motion.div>
    </div>
  );
}
