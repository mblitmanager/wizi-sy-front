import { QuizNavigation } from "./QuizNavigation";

export const QuizFooter = ({
  activeStep,
  totalQuestions,
  onBack,
  onNext,
  onFinish,
}) => (
  <div className="fixed left-0 w-full bg-white border-t z-50 mb-10 sm:mb-0 bottom-0 md:left-64 md:w-[calc(100%-16rem)]">
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <div className="text-center text-sm text-gray-500 mb-2">
        Utilisez les flèches ou glissez pour naviguer entre les questions
      </div>
      <QuizNavigation
        activeStep={activeStep}
        totalSteps={totalQuestions}
        onBack={onBack}
        onNext={onNext}
        onFinish={onFinish}
      />
    </div>
  </div>
);
