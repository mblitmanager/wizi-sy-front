import { QuizNavigation } from "./QuizNavigation";

export const QuizFooter = ({
  activeStep,
  totalQuestions,
  onBack,
  onNext,
  onFinish,
}) => (
  <div className="fixed left-0 bottom-0 w-full bg-white/95 backdrop-blur-sm border-t z-50 md:left-64 md:w-[calc(100%-16rem)]">
    <div className="max-w-4xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Texte d'aide */}
        <div className="text-sm text-gray-500 whitespace-nowrap">
          Utilisez les flèches ou glissez pour naviguer
        </div>

        {/* Navigation */}
        <div className="flex-1 max-w-md">
          <QuizNavigation
            activeStep={activeStep}
            totalSteps={totalQuestions}
            onBack={onBack}
            onNext={onNext}
            onFinish={onFinish}
          />
        </div>
      </div>
    </div>
  </div>
);
