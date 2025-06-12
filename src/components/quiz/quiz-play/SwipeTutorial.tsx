import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export const SwipeTutorial = ({ tutorialStep }) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
    <div className="text-center mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Bienvenue dans le quiz !
      </h3>
      <p className="text-gray-600">Apprenez à naviguer entre les questions</p>
    </div>

    <div className="relative w-64 h-32 bg-gray-100 rounded-lg shadow-lg mb-8">
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-16 h-16 bg-amber-500 rounded-lg shadow-md transition-transform duration-500 ease-in-out ${
          tutorialStep === 0
            ? "left-4"
            : tutorialStep === 1
            ? "left-1/2 -translate-x-1/2"
            : "right-4"
        }`}>
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <ArrowRight className="w-8 h-8" />
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4 text-amber-500">
      <div className="flex items-center gap-2">
        <ChevronLeft className="h-6 w-6" />
        <span className="text-sm font-medium">Glissez à gauche</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Glissez à droite</span>
        <ChevronRight className="h-6 w-6" />
      </div>
    </div>
  </div>
);
