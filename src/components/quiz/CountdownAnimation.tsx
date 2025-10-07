import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NextQuizInfo } from "@/services/quiz/NextQuizService";
import { ProgressBar } from "../ui/ProgressBar";

interface CountdownAnimationProps {
  currentQuizId: string;
  nextQuiz: NextQuizInfo | null;
  delay: number;
  onCountdownEnd: () => void;
}

export function CountdownAnimation({
  currentQuizId,
  nextQuiz,
  delay,
  onCountdownEnd,
}: CountdownAnimationProps) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(delay); // ⭐ State pour le compte à rebours

  useEffect(() => {
    console.log("🎯 CountdownAnimation - Données reçues:", {
      currentQuizId,
      nextQuiz,
      delay,
    });

    if (!nextQuiz) {
      console.log("❌ CountdownAnimation: Aucun nextQuiz disponible");
      return;
    }

    let currentCountdown = delay;

    const interval = setInterval(() => {
      currentCountdown -= 1;
      setCountdown(currentCountdown);

      if (currentCountdown <= 0) {
        console.log(
          "🔄 Countdown terminé, redirection vers:",
          `/quiz/${nextQuiz.id}/start`
        );
        navigate(`/quiz/${nextQuiz.id}/start`);
        onCountdownEnd();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextQuiz, delay, onCountdownEnd, navigate]);

  if (!nextQuiz) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Chargement du prochain quiz...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg text-center min-w-[300px]">
        <h3 className="text-xl font-bold mb-4">
          Quiz suivant dans {countdown} seconde{countdown > 1 ? "s" : ""}
        </h3>

        {/* ⭐ NOUVEAU : Barre de progression des 5 secondes */}
        <div className="mb-4">
          <ProgressBar
            duration={delay}
            currentTime={delay - countdown}
            color="bg-blue-500"
            height={8}
          />
        </div>

        <p className="text-lg font-semibold mb-2">{nextQuiz.titre}</p>
        <p className="text-sm text-gray-600 mb-4">
          {nextQuiz.categorie} - {nextQuiz.niveau}
        </p>

        {/* Animation de chargement */}
        <div className="w-16 h-16 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
